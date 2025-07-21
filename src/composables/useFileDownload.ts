import $appAxios from '@/plugins/axios';
import { FileOpener } from '@capacitor-community/file-opener';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import type { AxiosProgressEvent } from 'axios';
import { computed, reactive, ref } from 'vue';
export interface DownloadOptions {
    url: string
    filename: string
    directory?: Directory
    showOpenDialog?: boolean
    showShareDialog?: boolean
}

export interface DownloadedFile {
    name: string
    path: string
    size: number
    downloadedAt: Date
    mimeType: string
}

export interface DownloadState {
    isDownloading: boolean
    progress: number
    currentFile: string | null
    error: string | null
}

export const useFileDownload = () => {
    // Reactive state
    const downloadState = reactive<DownloadState>({
        isDownloading: false,
        progress: 0,
        currentFile: null,
        error: null
    });

    const downloadedFiles = ref<DownloadedFile[]>([]);
    const downloadHistory = ref<DownloadedFile[]>([]);

    // Computed properties
    const isIdle = computed(() => !downloadState.isDownloading);
    const hasError = computed(() => downloadState.error !== null);
    const progressPercentage = computed(() => Math.round(downloadState.progress));
    const totalDownloads = computed(() => downloadedFiles.value.length);

    // Reset state
    const resetDownloadState = () => {
        downloadState.isDownloading = false;
        downloadState.progress = 0;
        downloadState.currentFile = null;
        downloadState.error = null;
    };

    // Convert blob to base64 string
    const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    const base64 = reader.result.split(',')[1];
                    resolve(base64);
                } else {
                    reject(new Error('Failed to convert blob to base64'));
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    // Get MIME type based on file extension
    const getMimeType = (filename: string): string => {
        const extension = filename.split('.').pop()?.toLowerCase();
        const mimeTypes: { [key: string]: string } = {
            pdf: 'application/pdf',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            gif: 'image/gif',
            webp: 'image/webp',
            doc: 'application/msword',
            docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            xls: 'application/vnd.ms-excel',
            xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ppt: 'application/vnd.ms-powerpoint',
            pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            txt: 'text/plain',
            csv: 'text/csv',
            json: 'application/json',
            xml: 'application/xml',
            zip: 'application/zip',
            rar: 'application/x-rar-compressed',
            mp3: 'audio/mpeg',
            mp4: 'video/mp4',
            avi: 'video/x-msvideo',
            mov: 'video/quicktime'
        };
        return mimeTypes[extension || ''] || 'application/octet-stream';
    };

    // Main download function
    const downloadFile = async (options: DownloadOptions): Promise<string> => {
        const {
            url,
            filename,
            directory = Directory.Documents,
            showOpenDialog = false,
            showShareDialog = false
        } = options;

        console.log('downloadFile', JSON.stringify({
            url, filename, showOpenDialog, showShareDialog
        }));
        try {
            resetDownloadState();
            downloadState.isDownloading = true;
            downloadState.currentFile = filename;

            // reset baseUrl to empty
            // Download the file using axios
            const response = await $appAxios({
                method: 'GET',
                baseURL: '',
                url,
                responseType: 'blob',
                timeout: 60000, // 60 second timeout
                onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
                    if (progressEvent.total) {
                        downloadState.progress = (progressEvent.loaded / progressEvent.total) * 100;
                    }
                }
            });

            // Convert blob to base64 for Capacitor
            const base64Data = await blobToBase64(response.data);

            // Save file to device
            const result = await Filesystem.writeFile({
                path: filename,
                data: base64Data,
                directory,
                recursive: true
            });

            // Create download record
            const downloadedFile: DownloadedFile = {
                name: filename,
                path: result.uri,
                size: response.data.size || 0,
                downloadedAt: new Date(),
                mimeType: getMimeType(filename)
            };

            // Add to downloaded files
            // downloadedFiles.value.push(downloadedFile);
            // downloadHistory.value.push(downloadedFile);

            // Optional actions
            if (showOpenDialog) {
                await openFile(result.uri, downloadedFile.mimeType);
            }

            if (showShareDialog) {
                await shareFile(result.uri, filename);
            }

            downloadState.progress = 100;

            return result.uri;
        } catch (error) {
            downloadState.error = error instanceof Error ? error.message : 'Download failed';
            throw error;
        } finally {
            downloadState.isDownloading = false;
            downloadState.currentFile = null;
        }
    };
    // Download image with specific options
    const downloadImage = async (url: string, filename: string): Promise<string> => {
        return downloadFile({
            url,
            filename,
            directory: Directory.Documents,
            showOpenDialog: true
        });
    };

    // Download PDF with specific options
    const downloadPDF = async (url: string, filename: string): Promise<string> => {
        return downloadFile({
            url,
            filename,
            directory: Directory.Documents,
            showOpenDialog: true
        });
    };

    // Download document with specific options
    const downloadDocument = async (url: string, filename: string): Promise<string> => {
        return downloadFile({
            url,
            filename,
            directory: Directory.Documents,
            showOpenDialog: true,
            showShareDialog: false
        });
    };

    const downloadAndShareFile = async (filePath: string, fileName: string) => {
        await downloadFile({
            url: filePath,
            filename: fileName,
            directory: Directory.Documents,
            showOpenDialog: false,
            showShareDialog: true,
        })
    }

    // Open a file using the default system app
    const openFile = async (filePath: string, mimeType: string): Promise<void> => {
        try {
            if (Capacitor.isNativePlatform()) {
                await FileOpener.open({
                    filePath,
                    contentType: mimeType
                });
            } else {
                // Web fallback
                window.open(filePath, '_blank');
            }
        } catch (error) {
            console.error('Error opening file:', error);
            // Fallback to share if open fails
            // await shareFile(filePath, 'Downloaded File');
        }
    };

    // Share a file using the system share dialog
    const shareFile = async (filePath: string, title: string): Promise<void> => {
        try {
            if (Capacitor.isNativePlatform()) {
                await Share.share({
                    title,
                    url: filePath
                });
            } else {
                // Web fallback
                if (navigator.share) {
                    await navigator.share({
                        title,
                        url: filePath
                    });
                }
            }
        } catch (error) {
            console.error('Error sharing file:', error);
        }
    };

    // Check if file exists
    const fileExists = async (filename: string, directory: Directory = Directory.Documents): Promise<boolean> => {
        try {
            await Filesystem.stat({
                path: filename,
                directory
            });
            return true;
        } catch {
            return false;
        }
    };

    // Get file information
    const getFileInfo = async (filename: string, directory: Directory = Directory.Documents) => {
        try {
            return await Filesystem.stat({
                path: filename,
                directory
            });
        } catch (error) {
            console.error('Error getting file info:', error);
            return null;
        }
    };

    // Delete a file
    const deleteFile = async (filename: string, directory: Directory = Directory.Documents): Promise<boolean> => {
        try {
            await Filesystem.deleteFile({
                path: filename,
                directory
            });

            // Remove from downloaded files list
            downloadedFiles.value = downloadedFiles.value.filter(file => file.name !== filename);

            return true;
        } catch (error) {
            console.error('Error deleting file:', error);
            return false;
        }
    };

    // List files in directory
    const listFiles = async (directory: Directory = Directory.Documents): Promise<string[]> => {
        try {
            const result = await Filesystem.readdir({
                path: '',
                directory
            });
            return result.files.map(file => file.name);
        } catch (error) {
            console.error('Error listing files:', error);
            return [];
        }
    };
    // Clear all downloaded files
    const clearDownloadedFiles = () => {
        downloadedFiles.value = [];
    };

    // Clear download history
    const clearDownloadHistory = () => {
        downloadHistory.value = [];
    };

    // Get file by name
    const getFileByName = (filename: string): DownloadedFile | undefined => {
        return downloadedFiles.value.find(file => file.name === filename);
    };

    // Filter files by type
    const getFilesByType = (type: string): DownloadedFile[] => {
        return downloadedFiles.value.filter(file => file.mimeType.includes(type));
    };

    // Get images only
    const getImages = computed(() => getFilesByType('image'));

    // Get PDFs only
    const getPDFs = computed(() => getFilesByType('pdf'));

    // Get documents only
    const getDocuments = computed(() =>
        downloadedFiles.value.filter(file =>
            file.mimeType.includes('document') ||
            file.mimeType.includes('text') ||
            file.mimeType.includes('pdf')
        )
    );

    // Format file size
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0)
            return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Number.parseFloat((bytes / k ** i).toFixed(2)) + ' ' + sizes[i];
    };

    // Format date
    const formatDate = (date: Date): string => {
        return new Intl.DateTimeFormat('default', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    // Load existing files on mount
    const loadExistingFiles = async () => {
        try {
            const files = await listFiles(Directory.Documents);
            console.log('Available files:', files);
            // You might want to populate downloadedFiles with existing files
            // This would require storing metadata about downloads
        } catch (error) {
            console.error('Error loading existing files:', error);
        }
    };
    return {
        // State
        downloadState,
        downloadedFiles,
        downloadHistory,

        // Computed
        isIdle,
        hasError,
        progressPercentage,
        totalDownloads,
        getImages,
        getPDFs,
        getDocuments,

        // Actions
        downloadFile,
        downloadImage,
        downloadPDF,
        downloadDocument,
        downloadAndShareFile,
        openFile,
        shareFile,
        deleteFile,
        fileExists,
        getFileInfo,
        listFiles,
        clearDownloadedFiles,
        clearDownloadHistory,
        getFileByName,
        getFilesByType,
        loadExistingFiles,
        resetDownloadState,

        // Utilities
        getMimeType,
        formatFileSize,
        formatDate
    };
}