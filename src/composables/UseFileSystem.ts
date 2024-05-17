import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { FileSaveResult } from '@/types/Common';
import { getCurrentTimestamp } from '@/utils/DateUtil';
import { PrefixKey } from '@/utils/Constant';
import { Media, MediaSaveOptions } from '@capacitor-community/media';
import { useDevice } from '@/composables/UseDevice'
import { useLang } from './UseLang';
import { useBase } from './UseBase';
import { ref } from 'vue';
export const useFileSystem = () => {
  const { isIOS } = useDevice();
  const { t } = useLang();
  const { WeeToast } = useBase();
  const setStatus = ref<string>();
  const appAlbumName = PrefixKey + "Album";
  const createAlbumIfNotExist = async () => {
    const { albums } = await Media.getAlbums();
    const demoAlbum = albums.find(a => a.name === appAlbumName);
    if (demoAlbum) {
      return;
    }

    try {
      await Media.createAlbum({ name: appAlbumName });
    } catch (error) {
      console.error(error);
      throw new Error(`${JSON.stringify(error)}`);
    }

  }
  const ensureDemoAlbum = async () => {
    const { albums } = await Media.getAlbums();
    await createAlbumIfNotExist();
    const demoAlbum = albums.find(a => a.name === appAlbumName);
    if (!demoAlbum) {
      throw new Error(`${appAlbumName}  album does not exist`);
    }

    return demoAlbum.identifier;
  };
  const savePicture = async (
    path: string,
    fileName: string | undefined = undefined
  ): Promise<FileSaveResult> => {
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
      : `gd5_${getCurrentTimestamp()}.jpeg`;
    const base64Data = await base64FromPath(path!);
    const result = await Filesystem.writeFile({
      path: saveName,
      data: base64Data,
      directory: Directory.Data
    });
    if (result && result.uri) {

      const i18n = t;
      let opts: MediaSaveOptions = { path: result.uri, albumIdentifier: await ensureDemoAlbum(), fileName: "fromDataURI" };
      // await Media.savePhoto(opts);
      Media
        .savePhoto(opts)
        .then((res) => {
          WeeToast({
            text: i18n('success.saved')
          });
        })
        .catch((e) => {
          throw new Error(`${JSON.stringify(e)}`);
        });
    }
    return {
      filepath: saveName,
      webviewPath: path
    };
  };

  const base64FromPath = async (path: string): Promise<string> => {
    const response = await fetch(path);
    const blob = await response.blob();
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

  return { savePicture, base64FromPath };
};
