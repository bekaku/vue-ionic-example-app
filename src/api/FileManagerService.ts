import { useAxios } from '@/composables/useAxios';
import { useConfig } from '@/composables/useConfig';
import type { ResponseDataType, ResponseMessage, UploadRequest } from '@/types/common';
import type { FileManagerDto } from '@/types/models';
import { getBlobFromAxiosResponse, getFileNameFromAxiosResponse } from '@/utils/appUtil';
import { FILES_DIRECTORY_ID_ATT, FILES_UPLOAD_ATT } from '@/libs/constant';
import { base64FromArrayByffer, generateFileNameByExtesnsion, getFileExtension } from '@/utils/fileUtils';

export default () => {
  const { callAxios, callAxiosV2, validateServerResponse, callAxiosFile } = useAxios();
  const { getEnv } = useConfig();
  const uploadApi = async (
    file: any,
    fileDirectoryId: number = 0,
    resizeImage = true
  ): Promise<FileManagerDto | null> => {
    const postData = new FormData();
    postData.append(FILES_UPLOAD_ATT, file);
    postData.append(FILES_DIRECTORY_ID_ATT, fileDirectoryId.toString());
    postData.append('resizeImage', resizeImage ? '1' : '0');
    const res = await callAxios<FileManagerDto>({
      API: '/api/fileManager/uploadApi',
      method: 'POST',
      body: postData,
      baseURL: getEnv<string>('VITE_CDN_BASE_URL'),
      contentType: 'multipart/form-data'
    });
    return await validateServerResponse<FileManagerDto>(res);
  };
  const uploadBase64Api = async (
    req: UploadRequest
  ): Promise<FileManagerDto | null> => {
    return await callAxiosV2<FileManagerDto>({
      API: '/api/fileManager/uploadBase64Api',
      method: 'POST',
      body: {
        uploadRequest: req
      },
      baseURL: getEnv<string>('VITE_CDN_BASE_URL')
    });
  };

  const deleteFileApi = async (fileId: number): Promise<ResponseMessage> => {
    return await callAxios<ResponseMessage>({
      API: `/api/fileManager/deleteFileApi/${fileId}`,
      method: 'DELETE',
      baseURL: getEnv<string>('VITE_CDN_BASE_URL')
    });
  };
  const updateUserAvatar = async (
    fileManagerId: number
  ): Promise<ResponseMessage> => {
    return await callAxios<ResponseMessage>({
      API: `/api/fileManager/updateUserAvatar?fileManagerId=${fileManagerId}`,
      method: 'PUT',
      baseURL: getEnv<string>('VITE_CDN_BASE_URL')
    });
  };
  const updateUserCover = async (
    fileManagerId: number
  ): Promise<ResponseMessage> => {
    return await callAxios<ResponseMessage>({
      API: `/api/fileManager/updateUserCover?fileManagerId=${fileManagerId}`,
      method: 'PUT',
      baseURL: getEnv<string>('VITE_CDN_BASE_URL')
    });
  };
  const fethCdnData = async (
    path: string,
    responseDataType: ResponseDataType = 'blob'
  ): Promise<any> => {
    const cdnBase = getEnv<string>('VITE_CDN_BASE_URL');
    const src = path ? path.replace(cdnBase || '', '') : path;
    const response = await callAxiosFile<any>({
      API: src,
      baseURL: cdnBase,
      method: 'GET',
      responseType: 'arraybuffer'
    });
    if (response.data) {
      if (responseDataType == 'blob') {
        const imageUrlObject = await getBlobFromAxiosResponse(response);
        return new Promise(resolve => resolve(imageUrlObject));
      } else if (responseDataType == 'arraybuffer') {
        return new Promise(resolve => resolve(response.data));
      } else if (responseDataType == 'axiosresponse') {
        return new Promise(resolve => resolve(response));
      }
    }
    return new Promise(resolve => resolve(null));
  };
  const downloadCdnData = async (
    path: string,
    downloadFileName?: string
  ): Promise<any> => {
    const response = await fethCdnData(path, 'axiosresponse');
    if (response.data) {
      const contentType = response.headers['content-type'];
      // const contentDisposition = response.headers['content-disposition'];
      let fileName = await getFileNameFromAxiosResponse(response);
      if (!fileName) {
        const fileExtension = getFileExtension(contentType);
        fileName = generateFileNameByExtesnsion(fileExtension, downloadFileName);
      }
      if (fileName) {
        // downloadFromArrayBuffer(response.data, fileName, contentType);
        const base64 = await base64FromArrayByffer(response.data);
        if (base64) {
          // await saveFile(base64, fileName);
        }
      }
      return new Promise(resolve => resolve(response.data));
    }
    return new Promise(resolve => resolve(null));
  };
  return {
    uploadApi,
    uploadBase64Api,
    deleteFileApi,
    updateUserCover,
    updateUserAvatar,
    fethCdnData,
    downloadCdnData
  };
};
