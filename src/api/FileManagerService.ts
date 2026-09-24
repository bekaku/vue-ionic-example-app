import { useApi } from '@/composables/useApi';
import { useConfig } from '@/composables/useConfig';
import { FILES_DIRECTORY_ID_ATT, FILES_UPLOAD_ATT } from '@/libs/constant';
import type { ResponseDataType, ResponseMessage, UploadRequest } from '@/types/common';
import type { FileManager, FileUploadChunkMergeRequestDto, FileUploadChunkResponse } from '@/types/models';
import { getBlobUrlFromResponse } from '@/utils/FileUtils';

export default () => {
  const api = useApi();
  const { getEnv } = useConfig();
  const uploadApi = async (
    file: any,
    fileDirectoryId: number = 0,
    resizeImage = true
  ): Promise<FileManager | null> => {
    const postData = new FormData();
    postData.append(FILES_UPLOAD_ATT, file);
    postData.append(FILES_DIRECTORY_ID_ATT, fileDirectoryId.toString());
    postData.append('resizeImage', resizeImage ? '1' : '0');
    return await api<FileManager>('/api/fileManager/uploadApi', { method: 'POST', body: postData, baseURL: getEnv<string>('VITE_CDN_BASE_URL') });
  };
  const uploadBase64Api = async (
    req: UploadRequest
  ): Promise<FileManager | null> => {
    return await api<FileManager>('/api/fileManager/uploadBase64Api', { method: 'POST', body: { uploadRequest: req }, baseURL: getEnv<string>('VITE_CDN_BASE_URL') });
  };

  const uploadChunkApi = async (
    postData: FormData,
  ): Promise<FileUploadChunkResponse | FileManager | void | null> => {
    return await api<FileUploadChunkResponse | FileManager | void>('/api/fileManager/uploadChunkApi', { method: 'POST', body: postData, baseURL: getEnv<string>('VITE_CDN_BASE_URL') });
  };

  const mergeChunkApi = async (req: FileUploadChunkMergeRequestDto): Promise<FileManager | null> => {
    return await api<FileManager>('/api/fileManager/mergeChunkApi', { method: 'POST', body: { ...req }, baseURL: getEnv<string>('VITE_CDN_BASE_URL') });
  };

  const deleteFileApi = async (fileId: number): Promise<ResponseMessage | null> => {
    return await api<ResponseMessage>(`/api/fileManager/deleteFileApi/${fileId}`, { method: 'DELETE', baseURL: getEnv<string>('VITE_CDN_BASE_URL') });
  };
  const updateUserAvatar = async (
    fileManagerId: number
  ): Promise<ResponseMessage | null> => {
    return await api<ResponseMessage>(`/api/fileManager/updateUserAvatar?fileManagerId=${fileManagerId}`, { method: 'PUT', baseURL: getEnv<string>('VITE_CDN_BASE_URL') });
  };
  const updateUserCover = async (
    fileManagerId: number
  ): Promise<ResponseMessage | null> => {
    return await api<ResponseMessage>(`/api/fileManager/updateUserCover?fileManagerId=${fileManagerId}`, { method: 'PUT', baseURL: getEnv<string>('VITE_CDN_BASE_URL') });
  };
  const fethCdnData = async (
    path: string,
    responseDataType: ResponseDataType = 'blob'
  ): Promise<any> => {
    // const cdnBase = getEnv<string>('VITE_CDN_BASE_URL');
    // const src = path ? path.replace(cdnBase || '', '') : path;
    const response = await api.raw<ArrayBuffer>(path, {
      // baseURL: cdnBase,
      baseURL: '',
      responseType: 'arrayBuffer'
    });
    if (response._data) {
      if (responseDataType == 'blob') {
        return getBlobUrlFromResponse(response);
      } else if (responseDataType == 'arraybuffer') {
        return response._data;
      } else if (responseDataType == 'response') {
        return response;
      }
    }
    return null;
  };
  return {
    uploadApi,
    uploadChunkApi,
    mergeChunkApi,
    uploadBase64Api,
    deleteFileApi,
    updateUserCover,
    updateUserAvatar,
    fethCdnData
  };
};
