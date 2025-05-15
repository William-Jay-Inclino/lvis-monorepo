<template>
    <div class="upload-container">
        <!-- Hidden file input -->
        <input 
            type="file" 
            id="pdfDropzone" 
            class="d-none" 
            :accept="acceptedFileTypes" 
            @change="handleFileUpload"
            :multiple="allowMultiple"
            ref="fileInput"
        >
        
        <!-- Dropzone (shown when no files) -->
        <div 
            v-if="uploadedFiles.length === 0"
            class="border rounded p-4 text-center dropzone"
            :class="{ 'border-primary': isDragging, 'border-secondary': !isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
            @drop.prevent="handleDrop"
            @click="triggerFileInput"
        > 
            <h5>{{ dropzoneTitle }}</h5>
            <p class="text-muted">{{ dropzoneSubtitle }}</p>
            <p class="small text-muted">Maximum {{ maxFiles }} {{ fileTypeLabel }} files ({{ maxSizeMB }}MB each)</p>
        </div>
        
        <!-- File list (shown when files exist) -->
        <div v-else class="file-list-container">
            <div class="file-count mb-2 text-muted">
                {{ uploadedFiles.length }}/{{ maxFiles }} files selected
            </div>
            
            <div class="file-list">
                <div 
                    v-for="(file, index) in uploadedFiles" 
                    :key="index" 
                    class="file-item d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded"
                >
                    <div class="d-flex align-items-center">
                        <client-only>
                            <font-awesome-icon :icon="fileIcon" class="me-3" />
                        </client-only>
                        <div>
                            <h6 class="mb-0">{{ file.name }}</h6>
                            <small class="text-muted">{{ formatFileSize(file.size) }}</small>
                        </div>
                    </div>
                    <button 
                        type="button" 
                        class="btn btn-sm btn-outline-danger" 
                        @click.stop="removeFile(index)"
                    >
                        <client-only>
                            <font-awesome-icon :icon="['fas', 'trash']" />
                        </client-only>
                    </button>
                </div>
            </div>
            
            <!-- Action buttons -->
            <div class="mt-3 text-center">
                <button 
                    v-if="allowMultiple && uploadedFiles.length < maxFiles"
                    type="button" 
                    class="btn btn-outline-primary me-2" 
                    @click="triggerFileInput"
                >
                    <client-only>
                        <font-awesome-icon :icon="['fas', 'plus']" />
                    </client-only> 
                    Add More Files
                </button>
                <button 
                    type="button" 
                    class="btn btn-outline-secondary" 
                    @click="clearAllFiles"
                    v-if="showClearButton && uploadedFiles.length > 0"
                >
                    <client-only>
                        <font-awesome-icon :icon="['fas', 'times']" />
                    </client-only>
                    Clear All
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useToast } from "vue-toastification"

    interface Attachment {
        filename: string 
        src: string
    }

    const config = useRuntimeConfig()
    const API_FILE_ENDPOINT = config.public.apiUrl + '/api/v1/file-upload'

    const toast = useToast()
    const isDragging = ref(false)
    const uploadedFiles = ref<File[]>([])
    const fileInput = ref<HTMLInputElement | null>(null)
    const files = ref<File[]>([])

    const emit = defineEmits<{
        (e: 'files-selected', files: File[]): void
        (e: 'files-updated', files: File[]): void
        (e: 'files-cleared'): void
    }>()

    const props = withDefaults(defineProps<{
        maxFiles?: number
        maxSizeMB?: number
        acceptedFileTypes?: string
        allowMultiple?: boolean
        dropzoneTitle?: string
        dropzoneSubtitle?: string
        fileTypeLabel?: string
        fileIcon?: string[]
        initialFiles?: Attachment[]
        showClearButton?: boolean
    }>(), {
        maxFiles: 3,
        maxSizeMB: 5,
        acceptedFileTypes: '.pdf',
        allowMultiple: true,
        dropzoneTitle: 'Drag & Drop files here',
        dropzoneSubtitle: 'or click to browse',
        fileTypeLabel: 'PDF',
        fileIcon: () => ['fas', 'file-pdf'],
        initialFiles: () => [],
        showClearButton: true
    })

    // Initialize with any provided initial files
    onMounted(async() => {
        if (props.initialFiles && props.initialFiles.length > 0) {
            uploadedFiles.value = [...await getFiles({ files: props.initialFiles })]
            emit('files-selected', uploadedFiles.value)
        }
    })

    const maxSizeBytes = computed(() => props.maxSizeMB * 1024 * 1024)

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const triggerFileInput = () => {
        if (uploadedFiles.value.length >= props.maxFiles) {
            toast.error(`Maximum ${props.maxFiles} files allowed`)
            return
        }
        fileInput.value?.click()
    }

    const handleFileUpload = (event: Event) => {
        const target = event.target as HTMLInputElement
        if (target.files) {
            processFiles(Array.from(target.files))
            if (fileInput.value) {
                fileInput.value.value = ''
            }
        }
    }

    const handleDrop = (event: DragEvent) => {
        isDragging.value = false
        if (event.dataTransfer?.files) {
            processFiles(Array.from(event.dataTransfer.files))
        }
    }

    const processFiles = (files: File[]) => {
        const remainingSlots = props.maxFiles - uploadedFiles.value.length
        if (remainingSlots <= 0) {
            toast.error(`Maximum ${props.maxFiles} files allowed`)
            return
        }

        const filesToProcess = files.slice(0, remainingSlots)
        
        const validFiles = filesToProcess.filter(file => {
            // Check file type against accepted types
            if (props.acceptedFileTypes && !isFileTypeValid(file)) {
                toast.error(`File ${file.name} is not a valid ${props.fileTypeLabel}`)
                return false
            }
            if (file.size > maxSizeBytes.value) {
                toast.error(`File ${file.name} exceeds ${props.maxSizeMB}MB limit`)
                return false
            }
            return true
        })
        
        uploadedFiles.value = [...uploadedFiles.value, ...validFiles]
        emit('files-selected', uploadedFiles.value)

        if (files.length > remainingSlots) {
            toast.error(`Only ${remainingSlots} file(s) were added. Maximum ${props.maxFiles} files allowed.`)
        }
    }

    const isFileTypeValid = (file: File): boolean => {
        if (!props.acceptedFileTypes) return true
        
        const acceptedTypes = props.acceptedFileTypes.split(',').map(type => type.trim())
        return acceptedTypes.some(type => {
            if (type.startsWith('.')) {
                // Check file extension
                return file.name.toLowerCase().endsWith(type.toLowerCase())
            } else {
                // Check MIME type
                return file.type === type
            }
        })
    }

    const removeFile = (index: number) => {
        uploadedFiles.value.splice(index, 1)
        emit('files-updated', uploadedFiles.value)
    }

    const clearAllFiles = () => {
        uploadedFiles.value = []
        emit('files-updated', uploadedFiles.value)
    }

    function getUploadsPath(src: string) {

        const path = src.replace(UPLOADS_PATH, '')
        console.log('PATH', path)

        const uploadsPath = API_FILE_ENDPOINT + path
        return uploadsPath

    }

    async function getFiles(payload: { files: Attachment[] }) {

        const { files } = payload

        console.log('files', files);

        const result = [];

        for (const file of files) {
            if (file instanceof File) {
                result.push(file);
                continue;
            }
            
            const path = getUploadsPath(file.src);
            const response = await fetch(path);
            const blob = await response.blob();

            const filename = file.filename || path.split('/').pop() || 'file';

            result.push(new File([blob], filename, {
                type: blob.type || 'application/octet-stream',
                lastModified: new Date().getTime()
            }));
        }

        console.log('result', result);

        return result
    }

</script>

<style scoped>
    .upload-container {
        position: relative;
    }

    .dropzone {
        cursor: pointer;
        transition: border-color 0.2s ease;
    }

    .dropzone:hover {
        border-color: #0d6efd !important;
    }

    .file-list-container {
        cursor: default;
    }

    .file-item {
        transition: background-color 0.2s ease;
    }

    .file-item:hover {
        background-color: #e9ecef !important;
    }

    .file-count {
        font-size: 0.875rem;
    }
</style>