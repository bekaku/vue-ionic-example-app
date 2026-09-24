import { DefaultApiCLient, LocaleKey } from '@/libs/constant';
import router from '@/router';
import type { AppException, ResponseMessage } from '@/types/common';
import type { RefreshTokenResponse } from '@/types/models';
import { isAppException, isServerResponseMessage } from '@/utils/AppUtil';
import { getTokenStatus } from '@/utils/JwtUtil';
import { loadStorage } from '@/utils/StorageUtil';
import { toastController } from '@ionic/vue';
import { alertCircle, closeOutline } from 'ionicons/icons';
import JSONbig from 'json-bigint';
import { useAppStorage } from './useAppStorage';
import { useConfig } from './useConfig';
import { useDevice } from './useDevice';

/*
Usage (ofetch style, native fetch underneath):

const api = useApi();
const user = await api<UserDto>('/api/appUser/currentUserData');
const saved = await api<UserDto>('/api/appUser', { method: 'POST', body: { name: 'Beka' } });
const list = await api<UserDto[]>('/api/appUser', { query: { page: 0, size: 20 } });
const res = await api.raw<Blob>('/api/fileManager/download', { responseType: 'blob' });
*/

export type ApiResponseType = 'json' | 'text' | 'blob' | 'arrayBuffer';

export interface ApiFetchOptions extends Omit<RequestInit, 'body' | 'method'> {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';
  baseURL?: string;
  query?: Record<string, any>;
  body?: any;
  responseType?: ApiResponseType;
  timeout?: number;
  // show ionic toast for AppException / ResponseMessage / network error (default true)
  notify?: boolean;
  // replaces axios onDownloadProgress, total is undefined when server sends no Content-Length
  onDownloadProgress?: (event: ApiProgressEvent) => void;
}

export interface ApiProgressEvent {
  loaded: number;
  total?: number;
}

export interface ApiFetchResponse<T> extends Response {
  _data?: T;
}

export class ApiFetchError<T = any> extends Error {
  request: string;
  options: ApiFetchOptions;
  response?: ApiFetchResponse<T>;
  data?: T;
  status?: number;
  statusText?: string;

  constructor(message: string, request: string, options: ApiFetchOptions, response?: ApiFetchResponse<T>, cause?: unknown) {
    super(message, { cause });
    this.name = 'ApiFetchError';
    this.request = request;
    this.options = options;
    this.response = response;
    this.data = response?._data;
    this.status = response?.status;
    this.statusText = response?.statusText;
  }
}

const JSONbigString = JSONbig({ storeAsString: true });
const BIGINT_PATTERN = /\d{16,}/;
const DEFAULT_TIMEOUT = Number(import.meta.env.VITE_API_TIMOUT) || 3 * 60000;
const REFRESH_TOKEN_API = '/api/auth/refreshTokenApi';

// shared across every useApi() instance so concurrent 401s wait for one refresh
let refreshPromise: Promise<RefreshTokenResponse> | null = null;

const parseJson = (text: string) => {
  if (!text) {
    return undefined;
  }
  try {
    if (BIGINT_PATTERN.test(text)) {
      return JSON.parse(JSON.stringify(JSONbigString.parse(text)));
    }
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const isJsonBody = (body: any) => {
  if (body === undefined || body === null || typeof body !== 'object') {
    return false;
  }
  return !(body instanceof FormData
    || body instanceof Blob
    || body instanceof ArrayBuffer
    || ArrayBuffer.isView(body)
    || body instanceof URLSearchParams
    || body instanceof ReadableStream);
};

// read body stream chunk by chunk so progress can be reported
const readBodyWithProgress = async (response: Response, onProgress: (event: ApiProgressEvent) => void): Promise<Blob> => {
  const type = response.headers.get('content-type') || '';
  if (!response.body) {
    return response.blob();
  }
  const contentLength = Number(response.headers.get('content-length'));
  const total = contentLength > 0 ? contentLength : undefined;
  const reader = response.body.getReader();
  const chunks: BlobPart[] = [];
  let loaded = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value as BlobPart);
    loaded += value.byteLength;
    onProgress({ loaded, total });
  }
  return new Blob(chunks, { type });
};

const buildUrl = (request: string, baseURL: string | undefined, query?: Record<string, any>) => {
  let url = /^https?:\/\//i.test(request) || !baseURL
    ? request
    : `${baseURL.replace(/\/+$/, '')}/${request.replace(/^\/+/, '')}`;
  if (query) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) {
        continue;
      }
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, String(v)));
      } else {
        params.append(key, String(value));
      }
    }
    const qs = params.toString();
    if (qs) {
      url += (url.includes('?') ? '&' : '?') + qs;
    }
  }
  return url;
};

export const useApi = () => {
  const { getCurrentUserToken, setAuthToken, removeAuthToken } = useAppStorage();
  const { isDevMode, getEnv } = useConfig();
  const { canSyncActiveStatusToServer } = useDevice();

  const getBaseHeaders = async (headers?: HeadersInit, token?: RefreshTokenResponse) => {
    const finalHeaders = new Headers(headers);
    finalHeaders.set('Accept-Apiclient', DefaultApiCLient);
    const locale = await loadStorage<string>(LocaleKey);
    if (locale) {
      finalHeaders.set('Accept-Language', locale);
    }
    const currentToken = token || await getCurrentUserToken();
    if (currentToken?.authenticationToken) {
      finalHeaders.set('Authorization', `Bearer ${currentToken.authenticationToken}`);
      finalHeaders.set('X-User-ID', String(currentToken.userId || ''));
    }
    return finalHeaders;
  };

  const notifyException = async (response: AppException) => {
    const toast = await toastController.create({
      header: response.message,
      message: response.errors?.length ? response.errors.join(', ') : undefined,
      icon: alertCircle,
      duration: 5 * 1000,
      position: 'top',
      color: 'danger',
      mode: 'ios',
      buttons: [{ icon: closeOutline, side: 'end' }]
    });
    await toast.present();
  };

  const notifyServerMessage = async (response: ResponseMessage, status: number) => {
    if (!response.message) {
      return;
    }
    const toast = await toastController.create({
      message: response.message,
      duration: 3 * 1000,
      position: 'top',
      color: status < 400 ? undefined : 'danger',
      mode: 'ios',
      buttons: [{ icon: closeOutline, side: 'end' }]
    });
    await toast.present();
  };

  const exceptionNotify = (data: any, status: number) => {
    if (!data || typeof data !== 'object') {
      return;
    }
    if (isAppException(data)) {
      notifyException(data);
    } else if (isServerResponseMessage(data)) {
      notifyServerMessage(data, status);
    }
  };

  const notifyNetworkError = async (error: ApiFetchError) => {
    const toast = await toastController.create({
      header: (error.cause as Error | undefined)?.name || error.name,
      message: error.message,
      icon: alertCircle,
      duration: 15 * 1000,
      position: 'top',
      color: 'danger',
      mode: 'ios',
      buttons: [{ icon: closeOutline, side: 'end' }]
    });
    await toast.present();
  };

  const fetchOnce = async <T>(request: string, options: ApiFetchOptions, token?: RefreshTokenResponse): Promise<ApiFetchResponse<T>> => {
    const {
      baseURL = getEnv<string>('VITE_API_BASE_URL'),
      query,
      body,
      responseType = 'json',
      timeout = DEFAULT_TIMEOUT,
      onDownloadProgress,
      headers,
      signal,
      ...init
    } = options;

    const url = buildUrl(request, baseURL, query);
    const finalHeaders = await getBaseHeaders(headers, token);
    let finalBody = body;
    if (isJsonBody(body)) {
      finalBody = JSON.stringify(body);
      if (!finalHeaders.has('Content-Type')) {
        finalHeaders.set('Content-Type', 'application/json');
      }
    }

    // timeout + caller signal (AbortSignal.any/timeout not available on older WebViews)
    const controller = new AbortController();
    const onAbort = () => controller.abort(signal?.reason);
    if (signal) {
      if (signal.aborted) {
        controller.abort(signal.reason);
      } else {
        signal.addEventListener('abort', onAbort, { once: true });
      }
    }
    const timer = timeout > 0
      ? setTimeout(() => controller.abort(new DOMException(`Request timeout after ${timeout}ms`, 'TimeoutError')), timeout)
      : undefined;

    let response: ApiFetchResponse<T>;
    try {
      response = await fetch(url, {
        ...init,
        method: options.method || 'GET',
        headers: finalHeaders,
        body: finalBody,
        // same as axios withCredentials: false (no cookies on cross-origin requests)
        credentials: init.credentials || 'same-origin',
        signal: controller.signal
      }) as ApiFetchResponse<T>;

      if (response.status !== 204 && options.method !== 'HEAD') {
        const source: Response | Blob = onDownloadProgress
          ? await readBodyWithProgress(response, onDownloadProgress)
          : response;
        if (responseType === 'blob') {
          response._data = (source instanceof Blob ? source : await source.blob()) as T;
        } else if (responseType === 'arrayBuffer') {
          response._data = await source.arrayBuffer() as T;
        } else if (responseType === 'text') {
          response._data = await source.text() as T;
        } else {
          response._data = parseJson(await source.text());
        }
      }
    } catch (error: any) {
      const reason = controller.signal.aborted ? controller.signal.reason : error;
      throw new ApiFetchError(`[${options.method || 'GET'}] "${url}": ${reason?.message || reason}`, url, options, undefined, reason);
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', onAbort);
    }

    if (isDevMode()) {
      // no body/headers/_data: refresh + login payloads carry tokens
      console.log('[fetch response]', { url, method: options.method || 'GET', status: response.status });
    }
    if (!response.ok) {
      throw new ApiFetchError(`[${options.method || 'GET'}] "${url}": ${response.status} ${response.statusText}`, url, options, response);
    }
    return response;
  };

  const refreshToken = async (currentToken: RefreshTokenResponse): Promise<RefreshTokenResponse> => {
    if (!refreshPromise) {
      refreshPromise = fetchOnce<RefreshTokenResponse>(REFRESH_TOKEN_API, {
        method: 'POST',
        body: { refreshToken: currentToken.refreshToken }
      }, currentToken)
        .then(async (res) => {
          const data = res._data as RefreshTokenResponse;
          await setAuthToken(data);
          return data;
        })
        .catch(async (error: ApiFetchError) => {
          if (error.status == 403) {
            await removeAuthToken();
            router.replace('/auth/login');
          }
          throw error;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }
    return refreshPromise;
  };

  // A central function for handling both normal and raw requests.
  const executeFetch = async <T>(request: string, fetchOptions: ApiFetchOptions = {}): Promise<ApiFetchResponse<T>> => {
    const notify = fetchOptions.notify !== false;
    // tell server to update user active status at most every 5 minutes
    const headers = new Headers(fetchOptions.headers);
    headers.set('X-Sync-Active', await canSyncActiveStatusToServer() ? '1' : '0');
    const options: ApiFetchOptions = { ...fetchOptions, headers };
    try {
      const response = await fetchOnce<T>(request, options);
      if (notify) {
        exceptionNotify(response._data, response.status);
      }
      return response;
    } catch (err) {
      const error = err as ApiFetchError<T>;
      if (error.status !== 401) {
        if (notify && error.status !== 403) {
          if (error.response) {
            exceptionNotify(error.data, error.status!);
          } else {
            notifyNetworkError(error);
          }
        }
        throw error;
      }

      const currentToken = await getCurrentUserToken();
      if (!currentToken?.refreshToken || !currentToken.authenticationToken) {
        throw error;
      }
      // token still valid (e.g. refreshed by another request) -> retry once with it
      const status = await getTokenStatus(currentToken.authenticationToken);
      const newToken = status == 'VALID'
        ? currentToken
        : await refreshToken(currentToken);

      const response = await fetchOnce<T>(request, options, newToken);
      if (notify) {
        exceptionNotify(response._data, response.status);
      }
      return response;
    }
  };

  // Calling the normal pattern, returns the parsed body.
  const apiFetch = async <T = any>(request: string, options?: ApiFetchOptions): Promise<T> => {
    const response = await executeFetch<T>(request, options);
    return response._data as T;
  };

  // Using the raw format to extract the full response (status, headers, _data).
  apiFetch.raw = <T = any>(request: string, options?: ApiFetchOptions): Promise<ApiFetchResponse<T>> => {
    return executeFetch<T>(request, options);
  };

  return apiFetch;
};
