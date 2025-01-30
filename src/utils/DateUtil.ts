import {
  formatRelative,
  formatDistance,
  formatDistanceToNow,
  format,
  parse,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  parseISO,
  isEqual,
  isAfter,
  isBefore
} from 'date-fns';
import { th, enUS } from 'date-fns/locale';

export const FORMAT_DATE = 'dd/MM/yyyy'; // 25/05/2022
export const FORMAT_DATETIME = 'dd/MM/yyyy HH:mm:ss'; // 25/05/2022 17:26:31
export const FORMAT_DATE1 = 'dd MMM yyyy'; // 25 JAn 2022
export const FORMAT_DATE2 = 'dd MMMM yyyy'; // 25 May 2022
export const FORMAT_DATE3 = 'E dd MMMM yyyy'; // Wed 25 May 2022
export const FORMAT_DATE4 = 'EEEE dd MMMM yyyy'; // Wednesday 25 May 2022
export const FORMAT_DATE5 = 'E dd MMM yyyy'; // Wed 25 Jan 2022
export const FORMAT_DATE6 = 'PPP'; // May 25th, 2022
export const FORMAT_DATE7 = 'PPPppp'; // May 25th, 2022 at 5:26:31 PM GMT+7
export const FORMAT_DATE8 = 'E dd MMMM yyyy HH:mm:ss'; // Wed 25 May 2022 17:26:31
export const FORMAT_DATE9 = 'dd MMMM yyyy HH:mm:ss'; // 25 May 2022 17:26:31
export const FORMAT_DATE10 = 'yyyy/MM/dd'; // 2022/05/25
export const FORMAT_DATE11 = 'PPPp'; // April 28th, 2022 at 11:30 AM
export const FORMAT_DATE12 = 'PPp'; // Apr 28, 2022, 11:30 AM
export const FORMAT_DATE13 = 'yyyy-MM-dd HH:mm:ss';
export const FORMAT_DATE14 = 'yyyy-MM-dd';
export const FORMAT_DATE15 = 'aaa'; // am, pm
export const FORMAT_DATE16 = 'dd/MM/yy'; // 25/05/22
export const FORMAT_DATE17 = 'dd/MM/yyyy HH:mm'; // 25/05/2022 17:26

export const addDateByDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};
export const addDateByDaysV2 = (d: Date, days: number) => {
  d.setDate(d.getDate() + days);
  return d;
};
export const getDateNow = () => {
  return new Date();
};
export const getMonthNow = () => {
  return new Date().getMonth();
};
export const getYearNow = () => {
  return new Date().getFullYear();
};
export const getCurrentTimestamp = () => {
  const currentDate = new Date();
  return currentDate.getTime();
};
export const convertStringToDate = (
  dateString: string,
  format: string = 'yyyy-MM-dd HH:mm:ss'
): Date => {
  return parse(dateString, format, new Date());
  // return new Date(dateString);
};
export const isDate2GreaterThan = (d1: Date, d2: Date) => {
  return d2.getTime() > d1.getTime();
};
/**
 *
 * @param dateLeft  the later date
 * @param dateRight the earlier date
 * @returns
 */
export const getDateDiff = (
  dateLeft: Date | number,
  dateRight: Date | number
) => {
  return differenceInDays(dateRight, dateLeft);
};
/**
 *
 * @param dateLeft the later date
 * @param dateRight the earlier date
 * @returns
 */
export const getDateDiffHours = (
  dateLeft: Date | number,
  dateRight: Date | number
) => {
  return differenceInHours(dateRight, dateLeft);
};
/**
 *
 * @param dateLeft the later date
 * @param dateRight the earlier date
 * @returns
 */
export const getDateDiffMinutes = (
  dateLeft: Date | number,
  dateRight: Date | number
) => {
  return differenceInMinutes(dateRight, dateLeft);
};
/**
 *
 * @param dateLeft the later date
 * @param dateRight the earlier date
 * @returns
 */
export const getDateDiffSeconds = (
  dateLeft: Date | number,
  dateRight: Date | number
) => {
  return differenceInSeconds(dateRight, dateLeft);
};

/**
 * formatRelativeFromNow('2022-05-25 17:26:31', locale.value)
 * @param dateString
 * @param locale
 * @returns
 */
export const formatRelativeFromNow = (
  dateString: string | undefined,
  locale: string
) => {
  if (!dateString) {
    return;
  }
  return formatRelative(Date.parse(dateString), new Date(), {
    locale: locale == 'th' ? th : enUS
  });
};
/**
 * formatDistanceFromNow('2022-05-25 17:26:31', locale.value)
 * @param dateString
 * @param locale
 * @returns
 */
export const formatDistanceFromNow = (
  dateString: string,
  locale: string | unknown,
  suffix: boolean = false
) => {
  return formatDistanceToNow(convertStringToDate(dateString), {
    locale: locale == 'th' ? th : enUS,
    addSuffix: suffix
  });
};
export const formatDistanceFrom = (
  dateString: string,
  fromDateString: string | undefined,
  locale: string | unknown
) => {
  return formatDistance(
    convertStringToDate(dateString),
    fromDateString ? convertStringToDate(fromDateString) : new Date(),
    {
      locale: locale == 'th' ? th : enUS,
      addSuffix: true
    }
  );
};
/**
 * formatDate('2022-05-25 17:26:31', 'dd MMMM yyyy', locale.value)
 * @param dateString
 * @param forMatString
 * @param locale
 * @returns
 */
export const formatDateTime = (
  dateString: string,
  forMatString: string,
  locale: string | unknown
) => {
  return format(convertStringToDate(dateString), forMatString, {
    locale: locale == 'th' ? th : enUS
  });
};
export const formatDate = (
  dateString: string,
  forMatString: string,
  locale: string | unknown
) => {
  return format(convertStringToDate(dateString, FORMAT_DATE14), forMatString, {
    locale: locale == 'th' ? th : enUS
  });
};
export const formatDateBy = (d: Date, forMatString: string) => {
  return format(d, forMatString);
};
export const formatIso = (d: string, forMatString: string) => {
  return format(parseISO(d), forMatString);
};
export const getCurrentDateByFormat = (forMatString: string | undefined = undefined) => {
  return formatDateBy(getDateNow(), forMatString || FORMAT_DATE14);
};
export const isDateEqua = (dateLeft: string, dateRight: string) => {
  const d1 = convertStringToDate(dateLeft, FORMAT_DATE14);
  const d2 = convertStringToDate(dateRight, FORMAT_DATE14);
  return isEqual(d1, d2)
}
export const isDateAfter = (dateLeft: string, dateRight: string) => {
  const d1 = convertStringToDate(dateLeft, FORMAT_DATE14);
  const d2 = convertStringToDate(dateRight, FORMAT_DATE14);
  return isAfter(d1, d2)
}
export const isDateBefore = (dateLeft: string, dateRight: string) => {
  const d1 = convertStringToDate(dateLeft, FORMAT_DATE14);
  const d2 = convertStringToDate(dateRight, FORMAT_DATE14);
  return isBefore(d1, d2)
}
export const convertDateFormatToThai = (dateString?: string | null) => { // convert YYYY-MM-DD to DD/MM/YYYY
  if (!dateString) {
    return undefined
  }
  const parts = dateString.split('-');
  return parts[2] + '/' + parts[1] + '/' + parts[0];
}
export const convertThaiDateFormatToEng = (dateString?: string | null) => { // convert DD/MM/YYYY to YYYY-MM-DD
  if (!dateString) {
    return undefined
  }
  const parts = dateString.split('/');
  return parts[2] + '-' + parts[1] + '-' + parts[0];
}
export function getCurrentFormattedDatetime() {
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
