import FileManagerService from '@/api/FileManagerService';
import type { UploadStatus } from '@/types/common';
import type { FileManagerDto, FileUploadChunkResponseDto } from '@/types/models';
import { ref } from 'vue';

export const useFileUpload = () => {
    const { uploadChunkApi, mergeChunkApi } = FileManagerService();
    const files = ref<File[]>([])
    const previews = ref<FileManagerDto[]>([])
    const uploading = ref(false)
    const progress = ref(0)
    const status = ref<UploadStatus>();
    const chunkSize = 1 * 1024 * 1024 // 1 MB
    const maxRetries = 3

    // Track uploaded chunks for resume support
    const uploadedChunks = new Set<number>()
    const chunkFileName = ref<string>('');
    const currentFileIndex = ref(0)

    const onChunkUploadClear = () => {
        chunkFileName.value = '';
        progress.value = 0;
        status.value = undefined;
        uploadedChunks.clear()
    }
    const setDownloadProgress = (index: number, statusParam: UploadStatus, uploading: boolean, progressParam?: number | undefined): Promise<void> => {
        const item = previews.value[index]
        if (item && item.uploadProgress) {
            item.uploadProgress = {
                progress: progressParam || item.uploadProgress.progress,
                uploading,
                status: statusParam
            }
            previews.value[index] = item
        }
        if (progressParam != undefined) {
            progress.value = progressParam;
        }
        status.value = statusParam
        return Promise.resolve();
    }
    const setDownloadStatus = (): Promise<void> => {
        const item = previews.value[currentFileIndex.value]
        if (item) {
            item.uploadProgress = {
                progress: 0,
                uploading: true,
                status: 'UPLOADING',
                uploadData: null
            }
            previews.value[currentFileIndex.value] = item
        }
        return Promise.resolve();
    }
    const checkAlreadyUpload = (index: number): Promise<boolean> => {
        const item = previews.value[index]
        if (item) {
            return Promise.resolve(item.uploadProgress != undefined)
        }

        return Promise.resolve(false)
    }
    const onUploadChunkProcess = async (chunk: Blob, index: number, total: number, filename: string): Promise<FileUploadChunkResponseDto | null> => {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await uploadChunkApi(chunk, index, total, filename, chunkFileName.value)
                uploadedChunks.add(index)
                if (response && response.filename) {
                    chunkFileName.value = response.filename
                }
                return response
            } catch (err) {
                console.warn(`Chunk ${index} failed (attempt ${attempt})`, err)
                await new Promise(res => setTimeout(res, 1000)) // wait before retry
            }
        }
        return {
            status: false
        }
    }

    const onUploadChunk = async (selectedFile: File): Promise<FileManagerDto | null> => {
        if (!selectedFile) {
            return new Promise(resolve => resolve(null))
        }
        onChunkUploadClear()
        await setDownloadStatus();
        const totalChunks = Math.ceil(selectedFile.size / chunkSize)
        const filename = selectedFile.name
        for (let chunkIndex = 1; chunkIndex <= totalChunks; chunkIndex++) {
            if (uploadedChunks.has(chunkIndex))
                continue // skip if already uploaded

            const start = (chunkIndex - 1) * chunkSize
            const end = Math.min(start + chunkSize, selectedFile.size)
            const chunk = selectedFile.slice(start, end)
            console.log('Uploading chunk', chunkIndex, 'of', totalChunks)
            const response = await onUploadChunkProcess(chunk, chunkIndex, totalChunks, filename)
            if (!response || response.status == false) {
                console.warn(`Upload failed at chunk ${chunkIndex}`)
                await setDownloadProgress(currentFileIndex.value, 'FAILED', false);
                return new Promise(resolve => resolve(null))
            }
            // progress.value = chunkIndex / totalChunks
            const progressPercent = chunkIndex / totalChunks
            await setDownloadProgress(currentFileIndex.value, 'UPLOADING', true, progressPercent);
        }
        // Merge request
        try {
            const response = await mergeChunkApi({
                chunkFilename: chunkFileName.value,
                fileMime: null,
                totalChunks,
                originalFilename: filename,
                resizeImage: true
            })
            if (response && response.id && response.id > 0) {
                console.info('Merge complete')
                await setDownloadProgress(currentFileIndex.value, 'COMPLETED', false);
                return new Promise(resolve => resolve(response))
            }
        } catch (e) {
            console.warn('Merge failed', e)
            await setDownloadProgress(currentFileIndex.value, 'FAILED', false);
            return new Promise(resolve => resolve(null))
        }
        return new Promise(resolve => resolve(null))
    }
    const onStartUploadChunk = async () => {
        if (files.value && files.value.length > 0) {
            uploading.value = true
            const items = files.value;
            for (let index = 0; index < items.length; index++) {
                const isAlreadyUpload = await checkAlreadyUpload(index);
                console.log('isAlreadyUpload : index > ', index, isAlreadyUpload);
                if (isAlreadyUpload) {
                    continue;
                }
                console.log('Uploading file', index, 'of', items.length);
                const f = items[index];
                if (f) {
                    currentFileIndex.value = index;
                    const response = await onUploadChunk(f);
                    if (response) {
                        console.log('Upload chunk and merged complete');
                    }
                }
            }
            uploading.value = false
        }
    }
    return {
        onStartUploadChunk,
        onUploadChunk,
        files,
        previews,
        uploading,
        status,
        progress
    }
}