import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  differenceInCalendarDays,
  format,
  formatDistance,
  formatDistanceToNow,
  formatRelative,
  isAfter,
  isBefore,
  isEqual,
  isValid,
  parse,
  parseISO,
} from 'date-fns';
import { enUS, th } from 'date-fns/locale';
import { getCurrentInstance, toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';
import { useLang } from './useLang';
import {
  FORMAT_DATE13,
  FORMAT_DATE_TIME_ALT,
  FORMAT_DATE_DD_MM_YY,
  FORMAT_DATE_DD_MM,
  FORMAT_DATE_HH_MM,
  FORMAT_DATE_DD_MM_HH_MM,
  FORMAT_DATE_YYYY_MM_DD,
} from '@/utils/DateUtil';

export interface DateFormatOptions {
  date: string | null | undefined;
  iso?: boolean;
  /** Output pattern. Parsing uses ISO or inputFormat independently. */
  format?: string;
  inputFormat?: string;
  suffix?: boolean;
}
export interface DateCompareOptions {
  dateLeft: string;
  dateRight: string;
  iso?: boolean;
  format?: string;
}

/** Setup callers inherit the app locale; non-setup callers can pass 'en' or 'th'. */
export const useDateFns = (locale?: MaybeRefOrGetter<string>) => {
  const activeLocale =
    locale ?? (getCurrentInstance() ? useLang().locale : 'en');
  const localeOptions = () => ({
    locale: toValue(activeLocale) === 'th' ? th : enUS,
  });

  const convertStringToDate = (
    date: string,
    iso = false,
    inputFormat = FORMAT_DATE13,
  ): Date => {
    if (iso)
return parseISO(date);
    const parsed = parse(date, inputFormat, new Date());
    if (isValid(parsed))
return parsed;
    const isoDate = parseISO(date);
    if (isValid(isoDate))
return isoDate;
    return parse(date, FORMAT_DATE_TIME_ALT, new Date());
  };
  const parseDateLoose = (
    date: string | null | undefined,
    inputFormat = FORMAT_DATE13,
  ): Date | null => {
    if (!date)
return null;
    const parsed = convertStringToDate(date, false, inputFormat);
    return isValid(parsed) ? parsed : null;
  };
  const readDate = (
    options: DateFormatOptions,
    inputFormat = FORMAT_DATE13,
  ): Date | null => {
    if (!options.date)
return null;
    const parsed = convertStringToDate(
      options.date,
      options.iso ?? false,
      options.inputFormat ?? inputFormat,
    );
    return isValid(parsed) ? parsed : null;
  };
  const formatDateBy = (date: Date | number, pattern: string): string =>
    isValid(date) ? format(date, pattern, localeOptions()) : '';
  const formatDateTime = (options: DateFormatOptions): string => {
    const date = readDate(options);
    return date
      ? formatDateBy(date, options.format ?? FORMAT_DATE_TIME_ALT)
      : '';
  };
  const formatDate = (options: DateFormatOptions): string => {
    const date = readDate(options, FORMAT_DATE_YYYY_MM_DD);
    return date
      ? formatDateBy(date, options.format ?? FORMAT_DATE_YYYY_MM_DD)
      : '';
  };
  const formatIso = (options: { date: string; forMatString: string }): string =>
    formatDateTime({
      date: options.date,
      iso: true,
      format: options.forMatString,
    });
  const getCurrentDateByFormat = (pattern = FORMAT_DATE_YYYY_MM_DD): string =>
    formatDateBy(new Date(), pattern);
  const removeTime = (date: string): string | undefined => {
    const parsed = parseDateLoose(date);
    return parsed ? formatDateBy(parsed, FORMAT_DATE_YYYY_MM_DD) : undefined;
  };
  const getDateDiffNow = (date: string): number => {
    const parsed = parseDateLoose(date);
    return parsed ? differenceInCalendarDays(new Date(), parsed) : 0;
  };
  const autoFormat = (
    options: DateFormatOptions,
    withTime: boolean,
  ): string => {
    const parsed = readDate(options);
    if (!parsed)
return '';
    const days = differenceInCalendarDays(new Date(), parsed);
    const pattern = withTime
      ? days === 0
        ? FORMAT_DATE_HH_MM
        : days > 0 && days < 365
          ? FORMAT_DATE_DD_MM_HH_MM
          : FORMAT_DATE_TIME_ALT
      : days === 0
        ? FORMAT_DATE_HH_MM
        : Math.abs(days) < 365
          ? FORMAT_DATE_DD_MM
          : FORMAT_DATE_DD_MM_YY;
    return formatDateBy(parsed, pattern);
  };
  const getDateAutoFormatBy = (options: DateFormatOptions) =>
    autoFormat(options, false);
  const getDateTimeAutoFormatBy = (options: DateFormatOptions) =>
    autoFormat(options, true);
  const formatRelativeFromNow = (options: DateFormatOptions): string => {
    const date = readDate(options);
    return date ? formatRelative(date, new Date(), localeOptions()) : '';
  };
  const formatDistanceFromNow = (options: DateFormatOptions): string => {
    const date = readDate(options);
    return date
      ? formatDistanceToNow(date, {
          ...localeOptions(),
          addSuffix: options.suffix ?? false,
        })
      : '';
  };
  const formatDistanceFrom = (
    options: DateFormatOptions & { fromDate?: string },
  ): string => {
    const date = readDate(options);
    const from = options.fromDate
      ? parseDateLoose(options.fromDate, options.inputFormat)
      : new Date();
    return date && from
      ? formatDistance(date, from, {
          ...localeOptions(),
          addSuffix: options.suffix ?? true,
        })
      : '';
  };
  const getDateDistanceAutoFormatBy = (options: DateFormatOptions): string => {
    const parsed = readDate(options);
    if (!parsed)
return '';
    return differenceInCalendarDays(new Date(), parsed) === 0
      ? formatDistanceFromNow({ ...options, suffix: false })
      : getDateTimeAutoFormatBy(options);
  };
  const compareDates = (
    options: DateCompareOptions,
    compare: (left: Date, right: Date) => boolean,
  ): boolean => {
    const left = readDate(
      { date: options.dateLeft, iso: options.iso, inputFormat: options.format },
      FORMAT_DATE_YYYY_MM_DD,
    );
    const right = readDate(
      {
        date: options.dateRight,
        iso: options.iso,
        inputFormat: options.format,
      },
      FORMAT_DATE_YYYY_MM_DD,
    );
    return left && right ? compare(left, right) : false;
  };
  const isDateEqua = (options: DateCompareOptions) =>
    compareDates(options, isEqual);
  const isDateAfter = (options: DateCompareOptions) =>
    compareDates(options, isAfter);
  const isDateBefore = (options: DateCompareOptions) =>
    compareDates(options, isBefore);
  const addDateByDays = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  };
  const addDateByDaysV2 = (d: Date, days: number) => {
    d.setDate(d.getDate() + days);
    return d;
  };
  const getDateNow = () => {
    return new Date();
  };
  const getMonthNow = () => {
    return new Date().getMonth();
  };
  const getYearNow = () => {
    return new Date().getFullYear();
  };
  const getCurrentTimestamp = () => {
    const currentDate = new Date();
    return currentDate.getTime();
  };
  const isDate2GreaterThan = (d1: Date, d2: Date) => {
    return d2.getTime() > d1.getTime();
  };
  /**
   *
   * @param dateLeft the start date
   * @param dateRight the end date (positive differences when later)
   * @returns
   */
  const getDateDiff = (dateLeft: Date | number, dateRight: Date | number) => {
    return differenceInDays(dateRight, dateLeft);
  };
  /**
   *
   * @param dateLeft the start date
   * @param dateRight the end date (positive differences when later)
   * @returns
   */
  const getDateDiffHours = (
    dateLeft: Date | number,
    dateRight: Date | number,
  ) => {
    return differenceInHours(dateRight, dateLeft);
  };
  /**
   *
   * @param dateLeft the start date
   * @param dateRight the end date (positive differences when later)
   * @returns
   */
  const getDateDiffMinutes = (
    dateLeft: Date | number,
    dateRight: Date | number,
  ) => {
    return differenceInMinutes(dateRight, dateLeft);
  };
  /**
   *
   * @param dateLeft the start date
   * @param dateRight the end date (positive differences when later)
   * @returns
   */
  const getDateDiffSeconds = (
    dateLeft: Date | number,
    dateRight: Date | number,
  ) => {
    return differenceInSeconds(dateRight, dateLeft);
  };

  const convertDateFormatToThai = (dateString?: string | null) => {
    // convert YYYY-MM-DD to DD/MM/YYYY
    if (!dateString) {
      return undefined;
    }
    const parts = dateString.split('-');
    return parts[2] + '/' + parts[1] + '/' + parts[0];
  };
  const convertThaiDateFormatToEng = (dateString?: string | null) => {
    // convert DD/MM/YYYY to YYYY-MM-DD
    if (!dateString) {
      return undefined;
    }
    const parts = dateString.split('/');
    return parts[2] + '-' + parts[1] + '-' + parts[0];
  };
  function getCurrentFormattedDatetime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-11
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    return `${year}${month}${day}_${hours}${minutes}${seconds}${milliseconds}`;
  }
  const formatDurationFromSecond = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const remainingSeconds = seconds % 60;
    const remainingMinutes = minutes % 60;

    const parts: string[] = [];
    if (hours > 0) {
      parts.push(`${hours}h`);
    }
    if (minutes > 0) {
      parts.push(`${remainingMinutes}m`);
    }
    if (remainingSeconds > 0 || parts.length === 0) {
      parts.push(`${remainingSeconds}s`);
    }
    return parts.join(' ');
  };
  const formatDurationHMS = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const pad = (n: number) => n.toString().padStart(2, '0');

    if (h > 0) {
      return `${pad(h)}:${pad(m)}:${pad(s)}`; // hh:mm:ss
    } else {
      return `${pad(m)}:${pad(s)}`; // mm:ss
    }
  };
  // Preserve the existing device-locale cache key representation.
  const formatLocalDateBy = (date: Date): string => date.toLocaleDateString();
  return {
    formatLocalDateBy,
    parseISO,
    convertStringToDate,
    parseDateLoose,
    removeTime,
    formatDate,
    formatDateTime,
    formatDateBy,
    formatIso,
    getCurrentDateByFormat,
    getDateDiffNow,
    getDateAutoFormatBy,
    getDateTimeAutoFormatBy,
    getDateDistanceAutoFormatBy,
    formatRelativeFromNow,
    formatDistanceFromNow,
    formatDistanceFrom,
    isDateEqua,
    isDateAfter,
    isDateBefore,
    isDate2GreaterThan,
    getDateDiff,
    getDateDiffHours,
    getDateDiffMinutes,
    getDateDiffSeconds,
    addDateByDays,
    addDateByDaysV2,
    getDateNow,
    getMonthNow,
    getYearNow,
    getCurrentTimestamp,
    getCurrentFormattedDatetime,
    convertDateFormatToThai,
    convertThaiDateFormatToEng,
    formatDurationFromSecond,
    formatDurationHMS,
  };
};
