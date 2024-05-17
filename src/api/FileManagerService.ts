import { FileManagerDto } from '@/types/Models';
import { ResponseDataType, ResponseMessage, UploadRequest } from '@/types/Common';
import { FILES_UPLOAD_ATT, FILES_DIRECTORY_ID_ATT } from '@/utils/Constant';
import { useAxios } from '@/composables/UseAxios';
import { useConfig } from '@/composables/UseConfig';
import { downloadFromArrayBuffer, getBlobFromAxiosResponse, getFileNameFromAxiosResponse } from '@/utils/AppUtil';

export default () => {
  const { callAxios, callAxiosV2, validateServerResponse, callAxiosFile } = useAxios();
  const { getConfigPublicType } = useConfig();
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
      baseURL: getConfigPublicType<string>('cdnBaseUrl'),
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
      baseURL: getConfigPublicType<string>('cdnBaseUrl')
    });
  };

  const deleteFileApi = async (fileId: number): Promise<ResponseMessage> => {
    return await callAxios<ResponseMessage>({
      API: `/api/fileManager/deleteFileApi/${fileId}`,
      method: 'DELETE',
      baseURL: getConfigPublicType<string>('cdnBaseUrl')
    });
  };
  const updateUserAvatar = async (
    fileManagerId: number
  ): Promise<ResponseMessage> => {
    return await callAxios<ResponseMessage>({
      API: `/api/fileManager/updateUserAvatar?fileManagerId=${fileManagerId}`,
      method: 'PUT',
      baseURL: getConfigPublicType<string>('cdnBaseUrl')
    });
  };
  const updateUserCover = async (
    fileManagerId: number
  ): Promise<ResponseMessage> => {
    return await callAxios<ResponseMessage>({
      API: `/api/fileManager/updateUserCover?fileManagerId=${fileManagerId}`,
      method: 'PUT',
      baseURL: getConfigPublicType<string>('cdnBaseUrl')
    });
  };
  const fethCdnData = async (
    path: string,
    responseDataType: ResponseDataType = 'blob'
  ): Promise<any> => {
    const cdnBase = getConfigPublicType<string>('cdnBaseUrl');
    const src = path.replace(cdnBase, '');
    const response = await callAxiosFile<any>({
      API: src,
      baseURL: cdnBase,
      method: 'GET',
      responseType: 'arraybuffer'
    });
    return new Promise(async (resolve /*reject*/) => {
      if (response.data) {
        if (responseDataType == 'blob') {
          const imageUrlObject = await getBlobFromAxiosResponse(response);
          resolve(imageUrlObject);
        } else if (responseDataType == 'arraybuffer') {
          resolve(response.data);
        } else if (responseDataType == 'download') {
          const contentType = response.headers['content-type'];
          const fileName = await getFileNameFromAxiosResponse(response);
          if (fileName) {
            downloadFromArrayBuffer(response.data, fileName, contentType);
          }
          // const name = 'Test.'
          resolve(response.data);
        } else if (responseDataType == 'axiosresponse') {
          resolve(response);
        }
      }
    });
  };
  return {
    uploadApi,
    uploadBase64Api,
    deleteFileApi,
    updateUserCover,
    updateUserAvatar,
    fethCdnData
  };
};
