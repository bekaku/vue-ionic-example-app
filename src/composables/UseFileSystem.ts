import { useDevice } from '@/composables/useDevice';
import type { ChoosePhotoItem, FileSaveResult } from '@/types/common';
import { urlToBlob } from '@/utils/appUtil';
import { AppAlbumName } from '@/libs/constant';
import { base64FromPath, generateAutoName } from '@/utils/fileUtils';
import type { MediaSaveOptions } from '@capacitor-community/media';
import { Media } from '@capacitor-community/media';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { useBase } from './useBase';
import { useLang } from './useLang';

export const useFileSystem = () => {
  const { t } = useLang();
  const { appToast } = useBase();
  const { isWeb } = useDevice();
  const appAlbumName = AppAlbumName;
  const createAlbumIfNotExist = async () => {
    const { albums } = await Media.getAlbums();
    const demoAlbum = albums.find(a => a.name === appAlbumName);
    if (demoAlbum) {
      return;
    }

    try {
      await Media.createAlbum({ name: appAlbumName });
    } catch (error) {
      console.error(JSON.stringify(error));
      throw new Error(`${JSON.stringify(error)}`);
    }
  };
  const ensureDemoAlbum = async () => {
    const { albums } = await Media.getAlbums();
    await createAlbumIfNotExist();
    const demoAlbum = albums.find(a => a.name === appAlbumName);
    if (!demoAlbum) {
      throw new Error(`${appAlbumName}  album does not exist`);
    }
    // android issue https://github.com/capacitor-community/media/issues/100
    // '/storage/emulated/0/Android/media/com.grandats.mobile.givedeefive/Givedeefive'
    return demoAlbum.identifier;
  };

  /*
  const savePicture = async (
    path: string,
    fileName: string | undefined = undefined
  ): Promise<FileSaveResult> => {

    const web = await isWeb();
    if (web) {//TODO implement save on web version
      return new Promise((resolve) => {
        resolve({
          filepath: '',
          webviewPath: ''
        });
      });
    }
    await createAlbumIfNotExist();
    // const isOsIos = await isIOS();
    // if (!isOsIos) {
    //   let permStatus = await Filesystem.checkPermissions();
    //   if (permStatus.publicStorage !== 'granted') {
    //     permStatus = await Filesystem.requestPermissions();
    //   }
    //   if (permStatus.publicStorage !== 'granted') {
    //     console.error('savePicture > User denied permissions!');
    //   }
    // }
    const saveName = fileName
      ? fileName
      : `${FileNamePrefix}${getCurrentTimestamp()}.jpeg`;
    const base64Data = await base64FromPath(path!);
    if (!base64Data) {
      return new Promise((resolve) => {
        resolve({
          filepath: '',
          webviewPath: ''
        });
      });
    }
    const result = await Filesystem.writeFile({
      path: saveName,
      data: base64Data,
      directory: Directory.Data
    });
    if (result && result.uri) {

      const i18n = t;
      let opts: MediaSaveOptions = {
        path: result.uri,
        albumIdentifier: await ensureDemoAlbum(),
        fileName: 'fromDataURI'
      };
      // await Media.savePhoto(opts);
      Media
        .savePhoto(opts)
        .then((res) => {
          appToast({
            text: i18n('success.saved')
          });
        })
        .catch((e) => {
          throw new Error(`${JSON.stringify(e)}`);
        });
    }
    return new Promise((resolve) => {
      resolve({
        filepath: saveName,
        webviewPath: path
      });
    });
  };
  */

  /**
   *
   * @param path blob url blob:http://localhost:8001/e0d6215f-66c3-4b5e-ac30-9e875a41298c path or http://127.0.0.1/image/one.jpg
   * @param fileName
   */
  const savePicture = async (
    path: string,
    fileName: string | undefined = undefined
  ): Promise<FileSaveResult> => {
    const web = await isWeb();
    if (web || !path) { // TODO implement save on web version
      return new Promise((resolve) => {
        resolve({
          filepath: '',
          webviewPath: ''
        });
      });
    }
    await createAlbumIfNotExist();
    const saveName = fileName || `${generateAutoName()}.jpeg`;
    const base64Data = await base64FromPath(path!);
    const res = await saveProcess(path, saveName, base64Data);
    return new Promise((resolve) => {
      resolve(res);
    });
  };
  const saveFile = async (
    base64Data: string,
    fileName: string
  ): Promise<FileSaveResult> => {
    const web = await isWeb();
    if (web || !base64Data || !fileName) { // TODO implement save on web version
      return new Promise((resolve) => {
        resolve({
          filepath: '',
          webviewPath: ''
        });
      });
    }
    await createAlbumIfNotExist();
    const res = await saveProcess('', fileName, base64Data);
    return new Promise((resolve) => {
      resolve(res);
    });
  };

  const saveProcess = async (
    path: string,
    fileName: string,
    base64Data?: string
  ): Promise<FileSaveResult> => {
    if (!base64Data) {
      return new Promise((resolve) => {
        resolve({
          filepath: '',
          webviewPath: ''
        });
      });
    }
    const result = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });
    if (result && result.uri) {
      const i18n = t;
      const opts: MediaSaveOptions = {
        path: result.uri,
        albumIdentifier: await ensureDemoAlbum(),
        fileName: generateAutoName()
      };
      // await Media.savePhoto(opts);
      Media
        .savePhoto(opts)
        .then((res) => {
          console.warn('useFileSystem > saveProcess', JSON.stringify(res));
          appToast({
            text: i18n('success.saved')
          });
        })
        .catch((e) => {
          throw new Error(`${JSON.stringify(e)}`);
        });
    }
    return new Promise((resolve) => {
      resolve({
        filepath: fileName,
        webviewPath: path
      });
    });
  };

  const onTakePicture = async (): Promise<ChoosePhotoItem | null> => {
    try {
      const image = await Camera.getPhoto({
        quality: 99,
        allowEditing: false,
        saveToGallery: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        webUseInput: true,
        promptLabelHeader: t('base.photo'),
        promptLabelCancel: t('base.cancel'),
        promptLabelPhoto: t('base.fromPhotos'),
        promptLabelPicture: t('base.takePicture')
      });

      const f = await getFileFromWebPath(image.webPath);
      return new Promise((resolve) => {
        resolve(f);
      });
    } catch (e: any) {
      console.warn('useFileSystem > onTakePicture', JSON.stringify(e));
      return new Promise((resolve) => {
        resolve(null);
      });
    }
  };
  const onPickPhoto = async (multiple: boolean, limit: number = 10): Promise<ChoosePhotoItem[] | null> => {
    if (multiple) {
      const files = await pickPhotoAlbum(limit);
      return new Promise((resolve) => {
        resolve(files);
      });
    } else {
      const file = await takePickSiglePicture().then(r => r);
      if (file != null) {
        return new Promise((resolve) => {
          resolve([file]);
        });
      }
      return new Promise((resolve) => {
        resolve(null);
      });
    }
  };
  const takePickSiglePicture = async (): Promise<ChoosePhotoItem | null> => {
    try {
      const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        saveToGallery: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
        webUseInput: true,
        promptLabelHeader: t('base.photo'),
        promptLabelCancel: t('base.cancel'),
        promptLabelPhoto: t('base.fromPhotos'),
        promptLabelPicture: t('base.takePicture')
      });

      // image.webPath will contain a path that can be set as an image src.
      // You can access the original file using image.path, which can be
      // passed to the Filesystem API to read the raw data of the image,
      // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
      const f = await getFileFromWebPath(image.webPath);
      return new Promise((resolve) => {
        resolve(f);
      });
    } catch (e: any) {
      console.warn('useFileSystem > takePickSiglePicture', JSON.stringify(e));
      return new Promise((resolve) => {
        resolve(null);
      });
    }
  };
  const pickPhotoAlbum = async (limit: number = 10): Promise<ChoosePhotoItem[] | null> => {
    try {
      const images = await Camera.pickImages({
        quality: 100,
        limit
      });
      const items = images.photos;
      const list: ChoosePhotoItem[] = [];
      for (const item of items) {
        const f = await getFileFromWebPath(item.webPath);
        list.push(f);
      }
      return new Promise((resolve) => {
        resolve(list);
      });
    } catch (e: any) {
      console.warn('useFileSystem > pickPhotoAlbum', JSON.stringify(e));
      return new Promise((resolve) => {
        resolve(null);
      });
    }
  };
  const getFileFromWebPath = async (webPath: any): Promise<ChoosePhotoItem> => {
    const file = await urlToBlob(webPath);
    return new Promise((resolve) => {
      resolve({
        webPath,
        file
      });
    });
  };
  const requestFileSystemPermissions = async () => {
    const web = await isWeb();
    if (!web) {
      await Filesystem.requestPermissions();
    }
    return new Promise((resolve) => {
      resolve(true);
    });
  };
  const checkFileSystemPermissions = async (): Promise<boolean> => {
    const web = await isWeb();
    if (!web) {
      const permitCamera = await Filesystem.checkPermissions();
      return new Promise((resolve) => {
        resolve(permitCamera.publicStorage == 'granted');
      });
    } else {
      return new Promise((resolve) => {
        resolve(false);
      });
    }
  };
  const requestCameraPermissions = async () => {
    const web = await isWeb();
    if (!web) {
      await Camera.requestPermissions();
    }
    return new Promise((resolve) => {
      resolve(false);
    });
  };
  const checkCameraPermissions = async () => {
    const web = await isWeb();
    if (!web) {
      const permitCamera = await Camera.checkPermissions();
      return new Promise((resolve) => {
        resolve(permitCamera);
      });
    } else {
      return new Promise((resolve) => {
        resolve(null);
      });
    }
  };
  return {
    savePicture,
    base64FromPath,
    saveFile,
    onTakePicture,
    onPickPhoto,
    requestCameraPermissions,
    checkCameraPermissions,
    requestFileSystemPermissions,
    checkFileSystemPermissions
  };
};
