import type { FileManager } from '@/types/models';
import { generateSnowFlakeId, idToString } from '@/utils/snowflake';
import { MaxImageResize } from '@/libs/constant';
import { blobToFile, getFileExtension, getFileMimeType, urlToBlob } from '@/utils/FileUtils';
import type { MediaResult } from '@capacitor/camera';
import { Camera, CameraDirection, MediaTypeSelection } from '@capacitor/camera';
import { heicTo } from 'heic-to'

export const useCamera = () => {
    const onTakePicture = async (): Promise<FileManager | null> => {
        try {
            const result = await Camera.takePhoto({
                quality: 90,
                // editable: 'in-app',
                editable: 'no',
                cameraDirection: CameraDirection.Rear,
                includeMetadata: true,
                targetWidth: MaxImageResize,
                // targetHeight: 720,
            });

            const f = await getFileFromResult(result, false);
            return new Promise((resolve) => {
                resolve(f);
            });
        } catch (e: any) {
            console.warn(JSON.stringify(e))
            return new Promise((resolve) => {
                resolve(null);
            });
        }
    };

    const onPickPhoto = async (limit: number = 10): Promise<FileManager[] | null> => {
        return await onPickPhotoOrVideo(limit, MediaTypeSelection.Photo);
    }
    const onPickVideo = async (limit: number = 10): Promise<FileManager[] | null> => {
        return await onPickPhotoOrVideo(limit, MediaTypeSelection.Video);
    }
    const onRecordVideo = async (): Promise<FileManager | null> => {
        try {
            const result = await Camera.recordVideo({
                saveToGallery: false,
                isPersistent: true, // keep the file available across app launches
                includeMetadata: true,
            });

            const f = await getFileFromResult(result);
            return new Promise((resolve) => {
                resolve(f);
            });
        } catch (e) {
            const error = e as any;
            const message = error.code ? `[${error.code}] ${error.message}` : error.message;
            console.error('recordVideo failed:', message);
            return new Promise((resolve) => {
                resolve(null);
            });
        }
    }
    const onPlayVideo = async (videoUri: string): Promise<void> => {
        if (videoUri) {
            try {
                await Camera.playVideo({ uri: videoUri });
            } catch (e) {
                const error = e as any;
                const message = error.code ? `[${error.code}] ${error.message}` : error.message;
                console.error('playVideo failed:', message);
            }
        }
    }
    const onPickPhotoOrVideo = async (limit: number = 10, source: MediaTypeSelection = MediaTypeSelection.Photo): Promise<FileManager[] | null> => {
        try {
            const { results } = await Camera.chooseFromGallery({
                mediaType: source, // photos, videos, or both
                allowMultipleSelection: true,
                limit,
                quality: 90,
                includeMetadata: true,
            });
            const items = results.slice(0, limit);
            const list: FileManager[] = [];
            for (const item of items) {
                const f = await getFileFromResult(item);
                list.push(f);
            }
            return new Promise((resolve) => {
                resolve(list);
            });
        } catch (e: any) {
            console.warn(JSON.stringify(e))
            return new Promise((resolve) => {
                resolve(null);
            });
        }
    };

    const getFileFromResult = async (r: MediaResult, useThumbnail: boolean = true): Promise<FileManager> => {
        const mt = r.metadata
        let w = 0
        let h = 0
        if (mt && mt.resolution) {
            const resolution = mt.resolution.split('x')
            w = Number.parseInt(resolution[0])
            h = Number.parseInt(resolution[1])
        }

        let b = await urlToBlob(r.webPath)
        let ext = mt?.format ? `.${mt.format}` : getFileExtension(b?.type || '')

        // 1. ตรวจสอบว่าไฟล์เป็น HEIC หรือ HEIF หรือไม่
        const isHeic =
            b?.type === 'image/heic' ||
            b?.type === 'image/heif' ||
            // eslint-disable-next-line regexp/no-unused-capturing-group
            /\.(heic|heif)$/i.test(ext as any) ||
            // eslint-disable-next-line regexp/no-unused-capturing-group
            /\.(heic|heif)$/i.test(r.webPath || '')

        // 2. ถ้าเป็น HEIC/HEIF ให้ทำการแปลงเป็น JPEG Blob
        if (isHeic && b) {
            try {
                const convertedBlob = await heicTo({
                    blob: b,
                    type: 'image/jpeg',
                    quality: 0.85,
                })

                if (convertedBlob) {
                    b = convertedBlob
                    ext = '.jpg'
                }
            } catch (error) {
                console.error('Failed to convert HEIC to JPG in getFileFromResult:', error)
            }
        }

        const newUniqueId = generateSnowFlakeId()
        const generateFileName = `${newUniqueId}${ext}`
        const f = await blobToFile(b, generateFileName)
        const fileMimeType = getFileMimeType(b)

        // จัดการ Thumbnail กรณี format เดิมเป็น heic/heif ให้เปลี่ยน mime type เป็น jpeg
        const thumbFormat = isHeic ? 'jpeg' : (mt?.format || 'jpeg')
        const thumbnailUrl = useThumbnail
            ? r.thumbnail
                ? `data:image/${thumbFormat};base64,${r.thumbnail}`
                : ''
            : r.webPath

        return {
            id: null,
            fileMime: b?.type || 'image/jpeg',
            fileName: generateFileName,
            uniqueId: idToString(newUniqueId),
            filePath: r.webPath || '',
            fileThumbnailPath: thumbnailUrl || '',
            fileSize: f?.size ? f.size : (mt?.size|| 0),
            functionId: 0,
            fileMimeType: fileMimeType || 'IMAGE',
            file: f,
            width: w,
            height: h,
            duration: mt?.duration || 0,
        }
    }

    return {
        onTakePicture,
        onPickPhoto,
        onPickVideo,
        onRecordVideo,
        onPlayVideo
    }
}
