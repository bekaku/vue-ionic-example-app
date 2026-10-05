// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import { defineComponent, h, ref } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDateFns } from '@/composables/useDateFns';
import { FORMAT_DATE_TIME_ALT } from '@/utils/DateUtil';
import BaseDatePicker from '@/components/base/BaseDatePicker.vue';

vi.mock('@ionic/vue', () => ({
  IonDatetime: { name: 'IonDatetime', template: '<div><slot /></div>' },
  IonCol: { template: '<div><slot /></div>' },
  IonRow: { template: '<div><slot /></div>' },
}));

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 9, 5, 12, 0, 0, 123));
});
afterEach(() => vi.useRealTimers());

const dates = () => useDateFns('en');

describe('useDateFns', () => {
  it('uses the requested default and keeps parsing independent of output format', () => {
    expect(FORMAT_DATE_TIME_ALT).toBe('dd/MM/yyyy HH:mm');
    const d = dates();
    for (const date of [
      '2026-10-05 09:30:00',
      '2026-10-05T09:30:00',
      '05/10/2026 09:30',
    ]) {
      expect(d.formatDateTime({ date })).toBe('05/10/2026 09:30');
      expect(d.formatDateTime({ date, format: 'HH:mm' })).toBe('09:30');
    }
    expect(
      d.formatDateTime({
        date: '05.10.2026 09:30',
        inputFormat: 'dd.MM.yyyy HH:mm',
      }),
    ).toBe('05/10/2026 09:30');
    expect(
      d.formatDateTime({
        date: '2026-10-05T02:30:00Z',
        iso: true,
        format: 'T',
      }),
    ).toBe(String(Date.UTC(2026, 9, 5, 2, 30)));
  });

  it('does not throw on empty or malformed dates in rendering helpers', () => {
    const d = dates();
    for (const date of [
      undefined,
      null,
      '',
      'bad-date',
      '2026-02-30',
      '31/02/2026 10:00',
    ]) {
      const options = { date };
      expect(d.formatDate(options)).toBe('');
      expect(d.formatDateTime(options)).toBe('');
      expect(d.formatRelativeFromNow(options)).toBe('');
      expect(d.formatDistanceFromNow(options)).toBe('');
      expect(d.formatDistanceFrom(options)).toBe('');
      expect(d.getDateAutoFormatBy(options)).toBe('');
      expect(d.getDateTimeAutoFormatBy(options)).toBe('');
      expect(d.getDateDistanceAutoFormatBy(options)).toBe('');
      expect(d.parseDateLoose(date)).toBeNull();
    }
    expect(d.formatIso({ date: 'bad-date', forMatString: 'yyyy-MM-dd' })).toBe(
      '',
    );
    expect(d.formatDateBy(new Date(NaN), 'yyyy')).toBe('');
  });

  it('reads reactive locales on every call, including distance/relative methods', () => {
    const locale = ref('en');
    const d = useDateFns(locale);
    expect(d.formatDate({ date: '2026-10-05', format: 'MMMM' })).toBe(
      'October',
    );
    expect(
      d.formatDistanceFromNow({ date: '2026-10-05T11:00:00', suffix: true }),
    ).toBe('about 1 hour ago');
    expect(d.formatRelativeFromNow({ date: '2026-10-05T11:00:00' })).toContain(
      'today',
    );
    locale.value = 'th';
    expect(d.formatDate({ date: '2026-10-05', format: 'MMMM' })).toBe('ตุลาคม');
    expect(
      d.formatDistanceFromNow({ date: '2026-10-05T11:00:00', suffix: true }),
    ).toContain('ที่ผ่านมา');
    expect(d.formatRelativeFromNow({ date: '2026-10-05T11:00:00' })).toContain(
      'วันนี้',
    );
    expect(
      d.formatDistanceFrom({
        date: '2026-10-05T11:00:00',
        fromDate: '2026-10-05T12:00:00',
      }),
    ).toContain('ที่ผ่านมา');
  });

  it('inherits the app locale in setup and responds to language switching', () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'th',
      messages: { en: {}, th: {} },
    });
    let api!: ReturnType<typeof useDateFns>;
    const wrapper = mount(
      defineComponent({
        setup() {
          api = useDateFns();
          return () => h('div');
        },
      }),
      { global: { plugins: [createPinia(), i18n] } },
    );
    expect(api.formatDateTime({ date: '2026-10-05', format: 'MMM' })).toBe(
      'ต.ค.',
    );
    i18n.global.locale.value = 'en';
    expect(api.formatDateTime({ date: '2026-10-05', format: 'MMM' })).toBe(
      'Oct',
    );
    wrapper.unmount();
  });

  it('selects auto formats by calendar day, year boundary and future dates', () => {
    const d = dates();
    expect(d.getDateAutoFormatBy({ date: '2026-10-05T00:01:00' })).toBe(
      '00:01',
    );
    expect(d.getDateTimeAutoFormatBy({ date: '2026-10-04T23:59:00' })).toBe(
      '04/10 23:59',
    );
    expect(d.getDateAutoFormatBy({ date: '2025-10-05T09:30:00' })).toBe(
      '05/10/25',
    );
    expect(d.getDateTimeAutoFormatBy({ date: '2025-10-05T09:30:00' })).toBe(
      '05/10/2025 09:30',
    );
    expect(d.getDateTimeAutoFormatBy({ date: '2026-10-06T09:30:00' })).toBe(
      '06/10/2026 09:30',
    );
    expect(d.getDateAutoFormatBy({ date: '2027-10-06T09:30:00' })).toBe(
      '06/10/27',
    );
    expect(d.getDateDistanceAutoFormatBy({ date: '2026-10-05T11:00:00' })).toBe(
      'about 1 hour',
    );
    expect(d.getDateDistanceAutoFormatBy({ date: '2026-10-04T11:00:00' })).toBe(
      '04/10 11:00',
    );
    expect(d.removeTime('2026-10-05 09:30:00')).toBe('2026-10-05');
    expect(d.getDateDiffNow('2026-10-04T23:59:00')).toBe(1);
  });

  it('counts calendar days across midnight and daylight-saving transitions', () => {
    vi.setSystemTime(new Date(2026, 2, 9, 0, 30));
    const d = dates();
    expect(d.getDateDiffNow('2026-03-08T00:30:00')).toBe(1);
    expect(d.getDateTimeAutoFormatBy({ date: '2026-03-08T23:59:00' })).toBe(
      '08/03 23:59',
    );
  });

  it('keeps signed difference semantics used by resume and sync thresholds', () => {
    const d = dates();
    const start = new Date(2026, 9, 1);
    const end = new Date(2026, 9, 2);
    expect(d.getDateDiff(start, end)).toBe(1);
    expect(d.getDateDiffHours(start, end)).toBe(24);
    expect(d.getDateDiffMinutes(0, 15 * 60 * 1000)).toBe(15);
    expect(d.getDateDiffMinutes(15 * 60 * 1000, 0)).toBe(-15);
    expect(d.getDateDiffSeconds(0, 1500)).toBe(1);
  });

  it('compares parsed dates and handles invalid comparisons', () => {
    const d = dates();
    const options = { dateLeft: '2026-10-05', dateRight: '2026-10-04' };
    expect(d.isDateAfter(options)).toBe(true);
    expect(d.isDateBefore(options)).toBe(false);
    expect(d.isDateEqua({ ...options, dateRight: options.dateLeft })).toBe(
      true,
    );
    expect(d.isDateBefore({ ...options, dateLeft: 'bad' })).toBe(false);
    expect(
      d.isDateAfter({
        dateLeft: '05/10/2026',
        dateRight: '04/10/2026',
        format: 'dd/MM/yyyy',
      }),
    ).toBe(true);
  });

  it('retains cache key, filename timestamp, numeric date and duration contracts', () => {
    const d = dates();
    expect(d.getCurrentFormattedDatetime()).toBe('20261005_120000123');
    expect(d.getCurrentDateByFormat()).toBe('2026-10-05');
    expect(d.formatLocalDateBy(d.getDateNow())).toBe(
      new Date().toLocaleDateString(),
    );
    expect(d.getCurrentTimestamp()).toBe(Date.now());
    expect(d.getMonthNow()).toBe(9);
    expect(d.getYearNow()).toBe(2026);
    expect(d.convertDateFormatToThai('2026-10-05')).toBe('05/10/2026');
    expect(d.convertThaiDateFormatToEng('05/10/2026')).toBe('2026-10-05');
    expect(d.formatDurationFromSecond(3661)).toBe('1h 1m 1s');
    expect(d.formatDurationHMS(3661)).toBe('01:01:01');
    expect(d.formatDurationHMS(61)).toBe('01:01');
  });

  it('keeps date picker ISO output and selection event behavior', async () => {
    const wrapper = mount(BaseDatePicker, {
      props: { presentation: 'date' },
      global: {
        plugins: [
          createPinia(),
          createI18n({
            legacy: false,
            locale: 'th',
            messages: { th: {}, en: {} },
          }),
        ],
      },
    });
    wrapper
      .getComponent({ name: 'IonDatetime' })
      .vm.$emit('ionChange', { detail: { value: '2026-10-05T09:30:00' } });
    expect(wrapper.emitted('update:modelValue')).toEqual([['2026-10-05']]);
    expect(wrapper.emitted('on-select')).toEqual([['2026-10-05']]);
    wrapper.unmount();
  });
});
