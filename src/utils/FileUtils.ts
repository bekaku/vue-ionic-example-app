/* eslint-disable ts/no-unused-vars */
import { FileNamePrefix } from '@/libs/constant';
import type { FileType } from '@/types/common';
import { getCurrentFormattedDatetime } from '@/utils/dateUtil';
import { biFileEarmarkImage, biFileEarmarkPpt, biFileEarmarkZip, biFiletypePdf, biFiletypeXlsx, biFileWord, biPaperclip } from '@quasar/extras/bootstrap-icons';
import JSZip from 'jszip';

export const fileToBlob = (file: File): Promise<any> => {
  return new Promise((resolve) => {
    const blob = new Blob([file as BlobPart], {
      type: file.type
    });
    const fileUrlObject = URL.createObjectURL(blob);
    resolve(fileUrlObject);
  });
};
export const urlToBlob = async (imgPath: any): Promise<Blob> => {
  const file = await fetch(imgPath).then(r => r.blob());
  return new Promise((resolve) => {
    resolve(file);
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
export const imageUrlToFile =async (imageUrl: string, fileName: string): Promise<File> => {
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
  return new Promise((resolve) => {
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
    let fileName;
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match && match[1]) {
        fileName = match[1];
      }
    }
    resolve(fileName);
  });
};

export const generateFileNameByExtesnsion = (extension: string | undefined, downloadFileName?: string): string | undefined => {
  if (!extension) {
    return undefined;
  }
  if (downloadFileName) {
    const fileName = downloadFileName.split('.')[0];
    if (fileName) {
      return `${fileName}${extension}`;
    }
  }


  return `${generateAutoName()}${extension}`;
};

export const getFileExtension = (t: string): string | undefined => {
  if (!t) {
    return undefined;
  }

  let mimeType = t.split(';')[0];
  mimeType = mimeType.toLowerCase();
  let extension;
  switch (mimeType) {
    case 'pdf':
    case 'application/pdf':
      extension = '.pdf';
      break;
    case 'xls':
    case 'application/vnd.ms-excel':
      extension = '.xls';
      break;
    case 'xlsx':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    case 'vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      extension = '.xlsx';
      break;
    case 'application/msword':
    case 'doc':
      extension = '.doc';
      break;
    case 'docx':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
      extension = '.docx';
      break;
    case 'ppt':
    case 'application/vnd.ms-powerpoint':
      extension = '.docx';
      break;
    case 'pptx':
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    case 'vnd.openxmlformats-officedocument.presentationml.presentation':
      extension = '.pptx';
      break;
    case 'image/png':
      extension = '.png';
      break;
    case 'image/jpeg':
      extension = '.jpg';
      break;
    case 'image/gif':
      extension = '.gif';
      break;
    case 'application/zip':
    case 'application/x-zip-compressed':
      extension = '.zip';
      break;
    case 'application/vnd.rar':
    case 'application/x-rar':
    case 'x-rar':
      extension = '.rar';
      break;
    default:
      extension = undefined;
      break;
  }
  return extension;
};
export const getFileTypeIcon = (t: string) => {
  if (!t) {
    return biPaperclip;
  }
  const type = t.toLowerCase();
  let icon = '';
  switch (type) {
    case 'pdf':
    case 'application/pdf':
      icon = biFiletypePdf;
      break;
    case 'xls':
    case 'xlsx':
    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    case 'vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      icon = biFiletypeXlsx;
      break;
    case 'doc':
    case 'docx':
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
      icon = biFileWord;
      break;
    case 'ppt':
    case 'pptx':
    case 'application/vnd.ms-powerpoint':
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    case 'vnd.openxmlformats-officedocument.presentationml.presentation':
      icon = biFileEarmarkPpt;
      break;
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'png':
    case 'image/png':
    case 'image/jpeg':
    case 'image/gif':
    case 'image/webp':
      icon = biFileEarmarkImage;
      break;
    case 'application/zip':
    case 'application/x-zip-compressed':
    case 'application/x-rar':
    case 'application/vnd.rar':
    case 'x-rar':
      icon = biFileEarmarkZip;
      break;
    default:
      icon = biPaperclip;
      break;
  }
  return icon;
};
export const getFileType = (t: string): FileType | undefined => {
  if (!t) {
    return undefined;
  }

  const mimeType = t.toLowerCase();
  let type: FileType | undefined;
  switch (mimeType) {
    case 'pdf':
    case 'application/pdf':
      type = 'pdf';
      break;
    case 'xls':
    case 'xlsx':
    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    case 'vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      type = 'msexcel';
      break;
    case 'doc':
    case 'docx':
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
      type = 'msword';
      break;
    case 'ppt':
    case 'pptx':
    case 'application/vnd.ms-powerpoint':
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    case 'vnd.openxmlformats-officedocument.presentationml.presentation':
      type = 'mspowerpoint';
      break;
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'png':
    case 'image/png':
    case 'image/jpeg':
    case 'image/gif':
    case 'image/webp':
      type = 'image';
      break;
    case 'application/zip':
    case 'application/x-zip-compressed':
    case 'application/x-rar':
    case 'application/vnd.rar':
    case 'x-rar':
      type = 'zip';
      break;
    default:
      type = 'unknown';
      break;
  }
  return type;
};
export const base64FromPath = async (path: string): Promise<string | undefined> => {
  if (!path) {
    return new Promise((resolve) => {
      resolve(undefined);
    });
  }
  const response = await fetch(path);
  const blob = await response.blob();
  const base64Data = await base64FromBlob(blob);
  return new Promise((resolve, reject) => {
    resolve(base64Data);
  });
  // return new Promise((resolve, reject) => {
  //   const reader = new FileReader();
  //   reader.onerror = reject;
  //   reader.onload = () => {
  //     if (typeof reader.result === 'string') {
  //       resolve(reader.result);
  //     } else {
  //       reject('method did not return a string');
  //     }
  //   };
  //   reader.readAsDataURL(blob);
  // });
};
export const base64FromBlob = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject('method did not return a string');
      }
    };
    reader.readAsDataURL(blob);
  });
};
export const base64FromArrayByffer = async (fileArrayBuffer: ArrayBuffer): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    if (!fileArrayBuffer) {
      resolve(undefined);
    }
    const uint8Array = new Uint8Array(fileArrayBuffer);
    // Convert Uint8Array to binary string
    let binaryString = '';
    uint8Array.forEach((byte) => {
      binaryString += String.fromCharCode(byte);
    });
    // Convert binary string to base64
    const base64String = btoa(binaryString);
    resolve(base64String);
  });
};
export const generateAutoName = () => {
  return `${FileNamePrefix}_${getCurrentFormattedDatetime()}`;
};

export const zipFile = async (file: File): Promise<File> => {
  const zip = new JSZip();
  zip.file(file.name, file);
  const blob = await zip.generateAsync({ type: 'blob' });
  const zippedFile = new File([blob], `${file.name}.zip`, { type: 'application/zip' });
  return new Promise((resolve) => {
    resolve(zippedFile);
  });
};
export const isImageFile = (f: File) => {
  if (!f) {
    return false;
  }
  return /^image\/\w+/.test(f.type);
};