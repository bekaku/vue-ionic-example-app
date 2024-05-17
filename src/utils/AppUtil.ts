import { AppException, IHrefTarget, ISortModeType, ResponseMessage, ServerException } from '@/types/Common';
import { config } from '@/utils/Constant';
import { clearStorage } from '@/utils/StorageUtil';
import { Device } from '@capacitor/device';

declare let window: any;

export const isNumber = (value: string | number): boolean => {
  return value != null && value !== '' && !isNaN(Number(value.toString()));
};
export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
export const isAppException = (obj: any): obj is AppException => {
  return (
    obj.status !== undefined &&
    obj.message !== undefined &&
    obj.errors !== undefined
  );
};
export const isServerException = (obj: any): obj is ServerException => {
  return (
    obj.status !== undefined &&
    obj.message !== undefined &&
    obj.error !== undefined &&
    obj.timestamp !== undefined &&
    obj.path !== undefined
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
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return inputText.replace(urlRegex, (url) => {
    return `<a class="app-text-link ${linkColor ? linkColor : ''
      }" href="${url}" target="_blank">${url}</a>`;
  });
};

export const roundDecimal = (value: number, precision: number) => {
  const multiplier = Math.pow(10, precision);
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
      .replace(/([-_][a-z])/g, (group) =>
        group.toUpperCase().replace('-', '').replace('_', '')
      )
    : '';
export const isImageFile = (f: File) => {
  if (!f) {
    return false;
  }
  return /^image\/\w+/.test(f.type);
};
export const getFileTypeIcon = (t: string) => {
  const type = t.toLowerCase();
  let icon = '';
  switch (type) {
    case 'pdf':
    case 'application/pdf':
      break;
    case 'xls':
    case 'xlsx':
    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    case 'vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      break;
    case 'doc':
    case 'docx':
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
      break;
    case 'ppt':
    case 'pptx':
    case 'application/vnd.ms-powerpoint':
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    case 'vnd.openxmlformats-officedocument.presentationml.presentation':
      break;
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'png':
    case 'image/png':
    case 'image/jpeg':
    case 'image/gif':
      break;
    case 'application/x-zip-compressed':
    case 'application/x-rar':
    case 'x-rar':
      break;
    default:
      break;
  }
  return icon;
};
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
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
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
  const regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
  const matches = [];
  let match;

  while ((match = regex.exec(val))) {
    matches.push(match[1]);
  }

  return matches;
};
export const extractHashtagsFromString = (val: string): string[] => {
  if (!val) {
    return [];
  }
  // return val.split(/[\s\n\r]/gim).filter((v) => v.startsWith('#'));
  // return extractHashtagsStartingWithLetter(val)
  return val.split(/[\s\n\r]/gim).filter((v) => {
    if (v.startsWith('#')) {
      // Check if the character following '#' is not a digit (0-9)
      return !(/^\#\d/.test(v));
    }
    return false;
  });
};
export const extractHashtagsStartingWithLetter = (str: string): string[] => {
  // Regular expression to match hashtags starting with a letter
  // const regex = /#[a-zA-Z]\w*/g;
  const regex = /(^|\s)(#[^0-9]\w*)/g;

  // Use match() to find all matches in the string
  const hashtags = str.match(regex);

  return hashtags || []; // Return an empty array if no hashtags are found
};
export const urlToBlob = async (imgPath: any): Promise<Blob> => {
  const file = await fetch(imgPath).then((r) => r.blob());
  return new Promise((resolve) => {
    resolve(file);
  });
};
export const getImgUrlFromFile = (f: any): Promise<string | undefined> => {
  if (!f) {
    return new Promise((resolve) => {
      resolve(undefined);
    });
  }
  return new Promise((resolve) => {
    if (/^image\/\w+/.test(f.type)) {
      const url = URL.createObjectURL(f);
      resolve(url);
    }
  });
};
export const blobToFile = (
  b: Blob,
  originalFileName: string
): Promise<File> => {
  return new Promise((resolve) => {
    const file = new File([b as any], originalFileName, {
      type: b.type
    });
    resolve(file);
  });
};
export const imageUrlToFile = (imageUrl: string, fileName: string): Promise<File> => {
  return new Promise(async (resolve) => {
    // Fetch the image data
    const response = await fetch(imageUrl);
    // Check if the response is successful (status code 200)
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }
    // Convert the image data to a Blob
    const blob = await response.blob();
    const file = new File([blob], fileName, {
      type: blob.type
    });
    // console.log('File name:', JSON.stringify(file.name));
    // console.log('File size:', file.size, 'bytes');
    // console.log('File type:', JSON.stringify(file.type));
    resolve(file);
  });
};
export const imageUrlToBase64 = async (imageUrl: string) => {
  // Fetch the image data
  const response = await fetch(imageUrl);
  // Check if the response is successful (status code 200)
  if (!response.ok) {
    throw new Error('Failed to fetch image');
  }
  // Convert the image data to a Blob
  const blob = await response.blob();
  // Read the blob as a data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
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
  // await clearStorage();
  return new Promise((resolve) => {
    localStorage.clear();
    window.localStorage.clear();
    resolve(true);
  });
};
export const indexedDbClear = () => {
  return new Promise((resolve) => {
    window.indexedDB
      .databases()
      .then((r: any) => {
        for (var i = 0; i < r.length; i++)
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
    return new Promise(async (resolve) => {
      resolve(false);
    });
  }
  return new Promise(async (resolve) => {

    const directory =
      window.cordova.file.applicationStorageDirectory +
      'app_webview/Default/Local Storage/leveldb';
    // cordova.file.dataDirectory + "app_webview/Default/Local Storage/leveldb";
    console.log('deleteDirectory > ' + directory);
    // if (window && window.CacheDelete) {
    //   window.CacheDelete.deleteCache()
    //     .then(() => console.log('delete cache success!!'))
    //     .catch((error: any) => console.error(error));
    // }
    //delete folder
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

    //delete file folder
    window.resolveLocalFileSystemURL(
      directory,
      function (dirEntry: any) {
        const directoryReader = dirEntry.createReader();
        directoryReader.readEntries(
          function (entries: any) {
            entries.forEach(function (entry: any) {
              if (entry.isFile && entry.name.endsWith('.log')) {
                entry.remove(
                  function () {
                    console.log('File removed successfully: ' + entry.name);
                  },
                  function (error: any) {
                    console.error(
                      'Error removing file ' + entry.name + ': ' + error.code
                    );
                  }
                );
              }
            });
          },
          function (error: any) {
            console.error('Error reading directory: ' + error.code);
          }
        );
      },
      function (error: any) {
        console.error('Error resolving directory: ' + error.code);
      }
    );

    resolve(true);
  });
};
export const deleteIOSCacheDirectory = () => {
  if (!window.cordova) {
    return new Promise(async (resolve) => {
      resolve(false);
    });
  }
  return new Promise(async (resolve) => {
    const directory = window.cordova.file.applicationStorageDirectory + 'tmp';
    console.log('deleteIOSCacheDirectory > ' + directory);

    //delete file in folder
    window.resolveLocalFileSystemURL(
      directory,
      function (dirEntry: any) {
        const directoryReader = dirEntry.createReader();
        directoryReader.readEntries(
          function (entries: any) {
            entries.forEach(function (entry: any) {
              //delete .jpg image
              if (entry.isFile && entry.name.endsWith('.jpg')) {
                entry.remove(
                  function () {
                    console.log('File removed successfully: ' + entry.name);
                  },
                  function (error: any) {
                    console.error(
                      'Error removing file ' + entry.name + ': ' + error.code
                    );
                  }
                );
              }

              //delete WKFileUploadPanel, blob folder
              if (
                entry.isDirectory &&
                (entry.name.startsWith('BlobRegistryFiles') ||
                  entry.name.startsWith('WKFileUploadPanel'))
              ) {
                entry.removeRecursively(
                  function () {
                    console.log(
                      'Directory removed successfully: ' + entry.name
                    );
                  },
                  function (error: any) {
                    console.error(
                      'Error removing directory ' +
                      entry.name +
                      ': ' +
                      error.code
                    );
                  }
                );
              }
            });
          },
          function (error: any) {
            console.error('Error reading directory: ' + error.code);
          }
        );
      },
      function (error: any) {
        console.error('Error resolving directory: ' + error.code);
      }
    );

    resolve(true);
  });
};
export const cacheClear = async () => {
  return new Promise(async (resolve) => {
    await indexedDbClear();
    const isIosPlatform = await isIOS();
    if (!isIosPlatform) {
      await deleteAndroidCacheDirectory();
    } else {
      await deleteIOSCacheDirectory();
    }
    resolve(true);
  });
};
export const cordovaClearCach = async () => {
  return new Promise(async (resolve) => {
    await localStorageClear();
    await cacheClear();
    resolve(true);
  });
};
export const downloadFromArrayBuffer = (
  arrayBuffer: any,
  fileName: string,
  fileType: string
) => {
  // Create a Blob from the ArrayBuffer
  const blob = new Blob([arrayBuffer], { type: fileType });
  downloadFromBlob(blob, fileName, fileType);
};
export const downloadFromBlob = (
  blob: any,
  fileName: string,
  fileType: string
) => {
  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);
  // Create a link element
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  // Append the link to the body
  document.body.appendChild(link);
  // Programmatically trigger the click event to start the download
  link.click();
  // Clean up: remove the link and revoke the URL
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const getBlobFromAxiosResponse = (response: any) => {
  return new Promise((resolve) => {
    const blob = new Blob([response.data as BlobPart], {
      type: response.headers['content-type']
    });
    const fileUrlObject = URL.createObjectURL(blob);
    resolve(fileUrlObject);
  });

};
export const getFileNameFromAxiosResponse = (response: any): Promise<string | undefined> => {
  return new Promise((resolve) => {
    const contentDisposition = response.headers['content-disposition'];
    let fileName = undefined;
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match && match[1]) {
        fileName = match[1];
      }
    }
    resolve(fileName);
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
