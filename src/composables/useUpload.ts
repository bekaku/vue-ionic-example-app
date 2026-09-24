import FileManagerService from '@/api/FileManagerService';
import { FileUploadKey } from '@/libs/constant';
import type { UploadStatus } from '@/types/common';
import type { FileManager, FileManagerMetaData, FileUploadChunkMergeRequest } from '@/types/models';
import { generateUniqueFilename } from '@/utils/FileUtils';
import { generateSnowFlakeId } from '@/utils/snowflake';
import { computed, ref } from 'vue';
export const useUpload = () => {
    const { uploadChunkApi, mergeChunkApi } = FileManagerService();
    const files = ref<FileManager[]>([]);
    const uploading = ref(false);
    const progress = ref(0);
    const status = ref<UploadStatus>();
    const CHUNK_SIZE = 1024 * 1024;
    const MAX_RETRIES = 1;

    const uploadFileTotal = ref<number>(0);
    const uploadFileSuccess = ref<number>(0);
    const fileUploadedIdItems = ref<(string | number)[]>([]);

    // Track uploaded chunks for resume support
    const uploadedChunks = new Set<number>();
    const chunkFileName = ref<string>('');
    const currentFileIndex = ref(0);

    const uploadSuccessPercent = computed<number>(() => {
        if (uploadFileTotal.value === 0 || uploadFileSuccess.value === 0) {
            return 0;
        }
        const percent = (uploadFileSuccess.value / uploadFileTotal.value) * 100;
        return Math.round(percent);
    });

    const onClearFileUpload = (clearFileItems = false) => {
        fileUploadedIdItems.value = [];
        if (clearFileItems) {
            files.value = [];
            uploadFileSuccess.value = 0;
            uploadFileTotal.value = 0;
        }
    };

    const onChunkUploadClear = () => {
        chunkFileName.value = '';
        progress.value = 0;
        status.value = undefined;
        uploadedChunks.clear();
    };

    const setUploadProgress = (index: number, statusParam: UploadStatus, uploading: boolean, progressParam?: number | undefined): Promise<void> => {
        const item = files.value[index];
        if (item && item.uploadProgress) {
            item.uploadProgress = {
                progress: progressParam || item.uploadProgress.progress,
                uploading,
                status: statusParam
            };
            files.value[index] = item;
        }
        if (progressParam != undefined) {
            progress.value = progressParam;
        }
        status.value = statusParam;
        return Promise.resolve();
    };

    const setUploadStatus = (): Promise<void> => {
        const item = files.value[currentFileIndex.value];
        if (item) {
            item.uploadProgress = {
                progress: 0,
                uploading: true,
                status: 'UPLOADING',
                uploadData: null
            };
            files.value[currentFileIndex.value] = item;
        }
        return Promise.resolve();
    };

    const checkAlreadyUpload = async (index: number): Promise<boolean> => {
        const item = files.value[index];
        if (item && item.uploadProgress) {
            return item.uploadProgress.status === 'COMPLETED';
        }
        return false;
    };

    const onUploadChunk = async (file: File, options?: {
        uniqueId?: string;
        filename?: string;
        setProgress?: boolean;
        chunkSize?: number;
        maxRetries?: number;
        metaData?: FileManagerMetaData
    }): Promise<FileManager | null> => {
        if (!file)
            return null;
        onChunkUploadClear();

        const chunkSize = options?.chunkSize || CHUNK_SIZE;
        const maxRetries = options?.maxRetries || MAX_RETRIES;
        const totalChunks = Math.ceil(file.size / chunkSize);
        const filename = options?.filename || file.name;
        const uniqueId = options?.uniqueId || generateSnowFlakeId().toString();
        const chunkFilename = generateUniqueFilename(filename, uniqueId);
        const setProgress = options?.setProgress ?? true;

        let responseFile: FileManager | null = null;

        try {
            // 1. Upload Chunks
            for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
                if (uploadedChunks.has(chunkIndex))
                    continue;

                const start = chunkIndex * chunkSize;
                const end = Math.min(start + chunkSize, file.size);
                const chunk = file.slice(start, end);

                const formData = new FormData();
                formData.append(FileUploadKey, chunk);
                formData.append('originalFilename', filename);
                formData.append('chunkFilename', chunkFilename);
                const chunkNumber = chunkIndex + 1;
                formData.append('chunkNumber', chunkNumber.toString());
                formData.append('totalChunks', totalChunks.toString());

                console.log('formData', {
                    originalFilename: filename,
                    chunkFilename,
                    chunkNumber,
                    totalChunks
                })

                //

                let chunkSuccess = false;
                for (let attempt = 0; attempt < maxRetries; attempt++) {
                    try {
                        console.log(`Uploading chunk ${chunkIndex + 1}/${totalChunks} (Attempt ${attempt + 1})`);
                        const chunkResponse = await uploadChunkApi(formData)
                        if (chunkResponse) {
                            chunkSuccess = true;
                            uploadedChunks.add(chunkIndex);
                            break;
                        }
                    } catch (err) {
                        console.warn(`Chunk ${chunkIndex} failed on attempt ${attempt + 1}`);
                        if (attempt === maxRetries - 1)
                            throw err;
                    }
                }

                if (!chunkSuccess) {
                    throw new Error(`Failed to upload chunk ${chunkIndex} after ${maxRetries} attempts`);
                }

                if (setProgress) {
                    const progressPercent = Math.round(((chunkIndex + 1) / totalChunks) * 100);
                    await setUploadProgress(currentFileIndex.value, 'UPLOADING', true, progressPercent);
                }
            }

            console.log('All chunks uploaded, starting merge...');

            const mergeData: FileUploadChunkMergeRequest = {
                chunkFilename,
                fileMime: file.type || null,
                totalChunks,
                originalFilename: filename,
                resizeImage: true,
                createThumbnail: true
            };

            if (options?.metaData) {
                if (options.metaData?.duration)
                    mergeData.duration = options.metaData.duration;
                if (options.metaData?.hidden)
                    mergeData.hidden = options.metaData.hidden;
                if (options.metaData?.title)
                    mergeData.title = options.metaData.title;
                if (options.metaData?.description)
                    mergeData.description = options.metaData.description;
                if (options.metaData?.thumbnailFileId)
                    mergeData.thumbnailFileId = options.metaData.thumbnailFileId;
                if (options.metaData?.resizeImage === false)
                    mergeData.resizeImage = false;
                if (options.metaData?.createThumbnail === false)
                    mergeData.createThumbnail = false;
            }
            const mergeResponse = await mergeChunkApi(mergeData);
            if (mergeResponse && mergeResponse.id) {
                responseFile = mergeResponse;
            } else {
                throw new Error('Failed to merge chunks');
            }

            // 3. Finish Upload
            if (setProgress) {
                await setUploadProgress(currentFileIndex.value, 'COMPLETED', false, 100);
            }
            console.log('Upload Complete!');
            return responseFile;
        } catch (error) {
            if (setProgress) {
                await setUploadProgress(currentFileIndex.value, 'FAILED', false);
            }
            console.error('Upload failed:', error);
            return null;
        }
    };

    const onStartUploadChunk = async () => {
        if (files.value && files.value.length > 0) {
            uploadFileTotal.value = files.value.length;
            uploading.value = true;
            const fileItems = files.value;

            for (let index = 0; index < fileItems.length; index++) {
                const isAlreadyUpload = await checkAlreadyUpload(index);
                if (isAlreadyUpload)
                    continue;

                const f = fileItems[index];
                if (f && f.file) {
                    let metaData: FileManagerMetaData | undefined;
                    currentFileIndex.value = index;
                    await setUploadStatus();

                    if (f.thumbnailFile) {
                        const thumbnailResponse = await onUploadChunk(f.thumbnailFile, {
                            setProgress: false,
                            metaData: { hidden: true }
                        });

                        if (thumbnailResponse && thumbnailResponse.id) {
                            metaData = {
                                thumbnailFileId: thumbnailResponse.id.toString(),
                                duration: f.duration || 0,
                                title: f.title || null,
                                description: f.description || null,
                                width: f.width || 0,
                                height: f.height || 0,
                            };
                        }
                    }
                    const response = await onUploadChunk(f.file, {
                        setProgress: true,
                        metaData
                    });

                    if (response && response.id) {
                        if (uploadFileSuccess.value == undefined || uploadFileSuccess.value == null) {
                            uploadFileSuccess.value = 0;
                        }
                        uploadFileSuccess.value++;
                        fileUploadedIdItems.value.push(response.id.toString());
                    }
                }
            }
            uploading.value = false;
        }
    };

    return {
        onStartUploadChunk,
        onUploadChunk,
        files,
        uploading,
        status,
        fileUploadedIdItems,
        uploadFileTotal,
        uploadFileSuccess,
        uploadSuccessPercent,
        onClearFileUpload
    };
}