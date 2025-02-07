import { config } from '@/libs/constant';
import type { AppException, IApiListResponse, IHrefTarget, ISortModeType, ResponseMessage, ServerException } from '@/types/common';
import { clearStorage } from '@/utils/storageUtil';
import { Device } from '@capacitor/device';

declare let window: any;

export const isNumber = (value: string | number): boolean => {
  return value != null && value !== '' && !Number.isNaN(Number(value.toString()));
};
export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/i
    );
};
export const isArray = (value: any): boolean => {
  return Array.isArray(value);
};
export const isListResponse = (obj: any): obj is IApiListResponse => {
  return (obj
    && obj.dataList !== undefined
    && obj.last !== undefined
    && obj.totalElements !== undefined
    && obj.totalPages !== undefined
  );
};
export const isAppException = (obj: any): obj is AppException => {
  return (
    obj.status !== undefined
    && obj.message !== undefined
    && obj.errors !== undefined
  );
};
export const isServerException = (obj: any): obj is ServerException => {
  return (
    obj.status !== undefined
    && obj.message !== undefined
    && obj.error !== undefined
    && obj.timestamp !== undefined
    && obj.path !== undefined
  );
};
export const isServerResponseMessage = (obj: any): obj is ResponseMessage => {
  return obj.status !== undefined && obj.message !== undefined;
};
export const openUrlInNewTab = (
  href: string,
  iTarget: IHrefTarget = '_blank',
  ev: Event | undefined = undefined
) => {
  Object.assign(document.createElement('a'), {
    target: iTarget,
    href
  }).click();
  if (ev) {
    ev.stopImmediatePropagation();
  }
};
export const catchUrlFromText = (inputText: string) => {
  return inputText.match(/\bhttps?:\/\/\S+/gi);
};
export const urlify = (
  inputText: string,
  linkColor: string | undefined = undefined
) => {
  const urlRegex = /(https?:\/\/\S+)/g;
  return inputText.replace(urlRegex, (url) => {
    return `<a class="app-text-link ${linkColor || ''
      }" href="${url}" target="_blank">${url}</a>`;
  });
};

export const roundDecimal = (value: number, precision: number) => {
  const multiplier = 10**precision;
  return Math.round(value * multiplier) / multiplier;
};
export const isObjectEmpty = (obj: any) => {
  return Object.keys(obj).length === 0;
};
export const isEmpty = (value: any) => {
  if (typeof value === 'number') {
    return false;
  } else if (typeof value === 'string') {
    return value.trim().length === 0;
  } else if (Array.isArray(value)) {
    return value.length === 0;
  } else if (typeof value === 'object') {
    return value == null || Object.keys(value).length === 0;
  } else if (typeof value === 'boolean') {
    return false;
  } else {
    return !value;
  }
};
export const convertStringToNumber = (n: string | undefined): number => {
  return n ? +n : 0;
};
export const snakeToCamel = (str: string) =>
  str
    ? str
      .toLowerCase()
      .replace(/([-_][a-z])/g, group =>
        group.toUpperCase().replace('-', '').replace('_', '')
      )
    : '';

export const readableNumber = (num: number, digits: number = 2) => {
  if (num < 1000) {
    return num;
  }
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' }
  ];
  const rx = /\.0+$|(\.\d*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find((item) => {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol
    : '0';
};

export const percentage = (val: number, total: number, decimal = 2): number => {
  if (total === 0) {
    return 0;
  }
  return +((val * 100) / total).toFixed(decimal);
};
export const removeDecimal = (val: number) => {
  if (val === 0) {
    return 0;
  }
  return Math.trunc(val);
};
export const roundCeilDecimal = (val: number) => {
  if (val === 0) {
    return 0;
  }
  return Math.ceil(val);
};
export const extractHashtagsFromStringV2 = (val: string): string[] => {
  if (!val) {
    return [];
  }
  const regex = /(?:^|\s)#([a-z\d]+)/gim;
  const matches = [];
  let match;

  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(val))) {
    matches.push(match[1]);
  }

  return matches;
};
export const extractHashtagsFromString = (val: string): string[] => {
  if (!val) {
      return [];
  }
  return val.split(/\s/g).filter((v) => {
      if (v.startsWith('#')) {
          // Check if the character following '#' is not a digit (0-9)
          return !(/^#\d/.test(v));
      }
      return false;
  });
};
export const extractHashtagsStartingWithLetter = (str: string): string[] => {
  // Regular expression to match hashtags starting with a letter
  // const regex = /#[a-zA-Z]\w*/g;
  const regex = /(^|\s)(#\D\w*)/g;

  // Use match() to find all matches in the string
  const hashtags = str.match(regex);

  return hashtags || []; // Return an empty array if no hashtags are found
};



export const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * max) + min;
};
export const numberFormat = (no: number) => {
  return no.toLocaleString();
};

export const deleteCookie = (name: string) => {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;secure;sameSite = \'None\';';
};
export const cloneObject = <T>(obj: T) => {
  return Object.assign({}, obj) as T;
};
export const cloneObjectV2 = <T>(obj: T) => {
  return { ...obj } as T;
};
export const cloneObjectV3 = <T>(obj: T) => {
  return JSON.parse(JSON.stringify(obj)) as T;
};
export const isValidJSON = (jsonString: string) => {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (error) {
    return false;
  }
};
export const localStorageClear = async () => {
  await clearStorage();
  return new Promise((resolve) => {
    // localStorage.clear();
    // window.localStorage.clear();
    resolve(true);
  });
};
export const indexedDbClear = () => {
  return new Promise((resolve) => {
    window.indexedDB
      .databases()
      .then((r: any) => {
        for (let i = 0; i < r.length; i++)
          window.indexedDB.deleteDatabase(r[i].name);
      })
      .then(() => {
        console.log('All data cleared.');
      });
    resolve(true);
  });
};
export const isIOS = async (): Promise<boolean> => {
  const info = await Device.getInfo();
  return new Promise((resolve) => {
    resolve(info.operatingSystem === 'ios');
  });
};
export const deleteAndroidCacheDirectory = () => {
  if (!window.cordova) {
    return new Promise((resolve) => {
      resolve(false);
    });
  }
  return new Promise((resolve) => {
    const directory
      = window.cordova.file.applicationStorageDirectory
        + 'app_webview/Default/Local Storage/leveldb';
    // cordova.file.dataDirectory + "app_webview/Default/Local Storage/leveldb";
    console.log('deleteDirectory > ' + directory);
    // if (window && window.CacheDelete) {
    //   window.CacheDelete.deleteCache()
    //     .then(() => console.log('delete cache success!!'))
    //     .catch((error: any) => console.error(error));
    // }
    // delete folder
    // window.resolveLocalFileSystemURL(
    //   directory,
    //   function (dirEntry) {
    //     dirEntry.removeRecursively(
    //       function () {
    //         console.log("Directory removed successfully.");
    //       },
    //       function (error) {
    //         console.error("Error removing directory: " + error.code);
    //       }
    //     );
    //   },
    //   function (error) {
    //     console.error("Error resolving directory: " + error.code);
    //   }
    // );

    // delete file folder
    window.resolveLocalFileSystemURL(
      directory,
      (dirEntry: any) => {
        const directoryReader = dirEntry.createReader();
        directoryReader.readEntries(
          (entries: any) => {
            entries.forEach((entry: any) => {
              if (entry.isFile && entry.name.endsWith('.log')) {
                entry.remove(
                  () => {
                    console.log('File removed successfully: ' + entry.name);
                  },
                  (error: any) => {
                    console.error(
                      'Error removing file ' + entry.name + ': ' + error.code
                    );
                  }
                );
              }
            });
          },
          (error: any) => {
            console.error('Error reading directory: ' + error.code);
          }
        );
      },
      (error: any) => {
        console.error('Error resolving directory: ' + error.code);
      }
    );

    resolve(true);
  });
};
export const deleteIOSCacheDirectory = () => {
  if (!window.cordova) {
    return new Promise((resolve) => {
      resolve(false);
    });
  }
  return new Promise((resolve) => {
    const directory = window.cordova.file.applicationStorageDirectory + 'tmp';
    console.log('deleteIOSCacheDirectory > ' + directory);

    // delete file in folder
    window.resolveLocalFileSystemURL(
      directory,
      (dirEntry: any) => {
        const directoryReader = dirEntry.createReader();
        directoryReader.readEntries(
          (entries: any) => {
            entries.forEach((entry: any) => {
              // delete .jpg image
              if (entry.isFile && entry.name.endsWith('.jpg')) {
                entry.remove(
                  () => {
                    console.log('File removed successfully: ' + entry.name);
                  },
                  (error: any) => {
                    console.error(
                      'Error removing file ' + entry.name + ': ' + error.code
                    );
                  }
                );
              }

              // delete WKFileUploadPanel, blob folder
              if (
                entry.isDirectory
                && (entry.name.startsWith('BlobRegistryFiles')
                  || entry.name.startsWith('WKFileUploadPanel'))
              ) {
                entry.removeRecursively(
                  () => {
                    console.log(
                      'Directory removed successfully: ' + entry.name
                    );
                  },
                  (error: any) => {
                    console.error(
                      'Error removing directory '
                      + entry.name
                      + ': '
                      + error.code
                    );
                  }
                );
              }
            });
          },
          (error: any) => {
            console.error('Error reading directory: ' + error.code);
          }
        );
      },
      (error: any) => {
        console.error('Error resolving directory: ' + error.code);
      }
    );

    resolve(true);
  });
};
export const cacheClear = async () => {
  await indexedDbClear();
  const isIosPlatform = await isIOS();
  if (!isIosPlatform) {
    await deleteAndroidCacheDirectory();
  } else {
    await deleteIOSCacheDirectory();
  }
  return new Promise((resolve) => {
    resolve(true);
  });
};
export const cordovaClearCach = async () => {
  await localStorageClear();
  await cacheClear();
  return new Promise((resolve) => {
    resolve(true);
  });
};

export const getConfig = <T>(key: string): T => {
  return config[key as keyof typeof config] as unknown as T;
};
export const sortedArray = <T>(list: any[], filedName: string, mode: ISortModeType): Promise<T> => {
  return new Promise((resolve) => {
    let finalList = [];
    if (list && list.length > 0) {
      if (mode === 'asc') {
        finalList = list.sort((a, b) => a[filedName] - b[filedName]);
      } else {
        finalList = list.sort((a, b) => b[filedName] - a[filedName]);
      }
    }
    resolve(finalList as T);
  });
};
export const generateUUID = (): string => {
  let d = new Date().getTime();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now(); // use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
};
export const escapeHtml = (unsafe: string | undefined) => {
  if (!unsafe) {
    return '';
  }
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#039;'
  };

  return unsafe.replace(/[&<>"']/g, char => map[char]);
};
export const unescapeHtml = (safe: string | undefined) => {
  if (!safe) {
    return '';
  }
  const map: { [key: string]: string } = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': '\''
  };
  return safe.replace(/&(amp|lt|gt|quot|#039);/g, entity => map[entity]);
};
export const formatBytes = (bytes: any, decimals = 2) => {
  if (bytes === 0)
return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Number.parseFloat((bytes / k**i).toFixed(dm)) + ' ' + sizes[i];
};
export const appPreventDefult = async (event: any) => {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
    event.stopImmediatePropagation();
  }
};
export const isLinkFromWebApp = (link: string): boolean => {
  // const webDomain=import.meta.env.VITE_WEB_APP_URL
  return link.includes(config.webAppDomain);
};