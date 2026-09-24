import type { RefreshTokenResponse } from '@/types/models';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiFetchError, useApi } from '@/composables/useApi';

const state = vi.hoisted(() => ({
  token: null as RefreshTokenResponse | null,
  tokenStatus: 'VALID' as 'VALID' | 'EXPIRED',
  removeAuthToken: vi.fn(),
  routerReplace: vi.fn(),
}));

vi.mock('@/router', () => ({ default: { replace: state.routerReplace } }));
vi.mock('@/composables/useAppStorage', () => ({
  useAppStorage: () => ({
    getCurrentUserToken: async () => state.token,
    setAuthToken: async (t: RefreshTokenResponse) => {
      state.token = t;
    },
    removeAuthToken: state.removeAuthToken,
  }),
}));
vi.mock('@/composables/useDevice', () => ({
  useDevice: () => ({ canSyncActiveStatusToServer: async () => false }),
}));
vi.mock('@/utils/StorageUtil', () => ({
  loadStorage: async () => 'th',
  clearStorage: async () => true,
}));
vi.mock('@/utils/JwtUtil', () => ({
  getTokenStatus: async () => state.tokenStatus,
}));
vi.mock('@ionic/vue', () => ({
  toastController: { create: async () => ({ present: async () => undefined }) },
}));

const json = (body: unknown, status = 200) =>
  new Response(typeof body === 'string' ? body : JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  state.token = { userId: '350897401642356736', authenticationToken: 'old-jwt', refreshToken: 'refresh-1' };
  state.tokenStatus = 'VALID';
  state.removeAuthToken.mockReset();
  state.routerReplace.mockReset();
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => {
  vi.unstubAllGlobals();
});

const headersOf = (call: number) => fetchMock.mock.calls[call]![1]!.headers as Headers;
const urlOf = (call: number) => String(fetchMock.mock.calls[call]![0]);

describe('useApi', () => {
  it('sends auth/locale/client headers and a JSON body', async () => {
    fetchMock.mockResolvedValueOnce(json({ ok: true }));
    const api = useApi();

    const res = await api('/api/x', { method: 'POST', body: { a: 1 }, query: { page: 0, q: 'a b', skip: undefined } });

    expect(res).toEqual({ ok: true });
    expect(urlOf(0)).toMatch(/\/api\/x\?page=0&q=a\+b$/);
    const h = headersOf(0);
    expect(h.get('Authorization')).toBe('Bearer old-jwt');
    expect(h.get('X-User-ID')).toBe('350897401642356736');
    expect(h.get('Accept-Language')).toBe('th');
    expect(h.get('Accept-Apiclient')).toBeTruthy();
    expect(h.get('Content-Type')).toBe('application/json');
    expect(fetchMock.mock.calls[0]![1]!.body).toBe('{"a":1}');
    expect(fetchMock.mock.calls[0]![1]!.credentials).toBe('same-origin');
  });

  it('keeps snowflake ids exact (json-bigint as string)', async () => {
    fetchMock.mockResolvedValueOnce(json('{"id":350897401642356736,"n":1}'));
    const res = await useApi()<{ id: string; n: number }>('/api/x');
    expect(res.id).toBe('350897401642356736');
    expect(res.n).toBe(1);
  });

  it('throws ApiFetchError with status and body on >= 400', async () => {
    fetchMock.mockResolvedValueOnce(json({ status: 'Not Found', message: 'nope', errors: [] }, 404));
    const error = await useApi()('/api/missing', { notify: false }).catch(e => e);
    expect(error).toBeInstanceOf(ApiFetchError);
    expect(error.status).toBe(404);
    expect(error.data.message).toBe('nope');
  });

  it('api.raw returns status, headers and _data', async () => {
    fetchMock.mockResolvedValueOnce(json({ message: 'saved' }));
    const res = await useApi().raw<{ message: string }>('/api/x');
    expect(res.status).toBe(200);
    expect(res._data?.message).toBe('saved');
  });

  it('401 with expired token: one shared refresh, then retries with the new token', async () => {
    state.tokenStatus = 'EXPIRED';
    let refreshCalls = 0;
    fetchMock.mockImplementation(async (input, init) => {
      const url = String(input);
      const auth = (init!.headers as Headers).get('Authorization');
      if (url.endsWith('/api/auth/refreshTokenApi')) {
        refreshCalls++;
        expect(init!.body).toBe('{"refreshToken":"refresh-1"}');
        return json({ userId: '350897401642356736', authenticationToken: 'new-jwt', refreshToken: 'refresh-2' });
      }
      return auth === 'Bearer new-jwt' ? json({ url }) : json({}, 401);
    });
    const api = useApi();

    const [a, b] = await Promise.all([api<{ url: string }>('/api/a'), api<{ url: string }>('/api/b')]);

    expect(refreshCalls).toBe(1);
    expect(a.url).toMatch(/\/api\/a$/);
    expect(b.url).toMatch(/\/api\/b$/);
    expect(state.token?.authenticationToken).toBe('new-jwt');
  });

  it('refresh answering 403 removes the token and redirects to login', async () => {
    state.tokenStatus = 'EXPIRED';
    fetchMock.mockImplementation(async input =>
      String(input).endsWith('/api/auth/refreshTokenApi') ? json({}, 403) : json({}, 401));

    const error = await useApi()('/api/a').catch(e => e);

    expect(error).toBeInstanceOf(ApiFetchError);
    expect(error.status).toBe(403);
    expect(state.removeAuthToken).toHaveBeenCalledTimes(1);
    expect(state.routerReplace).toHaveBeenCalledWith('/auth/login');
  });

  it('times out with a TimeoutError cause', async () => {
    fetchMock.mockImplementation((_input, init) => new Promise((_resolve, reject) => {
      init!.signal!.addEventListener('abort', () => reject(init!.signal!.reason));
    }));
    const error = await useApi()('/api/slow', { timeout: 10, notify: false }).catch(e => e);
    expect(error).toBeInstanceOf(ApiFetchError);
    expect((error.cause as Error).name).toBe('TimeoutError');
  });
});
