<template>
    <div class="upload-container">
        <!-- Hidden file input -->
        <input 
            type="file" 
            id="pdfDropzone" 
            class="d-none" 
            accept=".pdf" 
            @change="handleFileUpload"
            multiple
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
            <h5>Drag & Drop PDFs here</h5>
            <p class="text-muted">or click to browse</p>
            <p class="small text-muted">Maximum {{ maxFiles }} PDF files ({{ maxSizeMB }}MB each)</p>
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
                        <i class="bi bi-file-earmark-pdf fs-3 me-3"></i>
                        <div>
                            <h6 class="mb-0">{{ file.name }}</h6>
                            <small class="text-muted">{{ (file.size / 1024 / 1024).toFixed(2) }} MB</small>
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
                    v-if="uploadedFiles.length < maxFiles"
                    type="button" 
                    class="btn btn-outline-primary me-2" 
                    @click="triggerFileInput"
                >
                    <client-only>
                        <font-awesome-icon :icon="['fas', 'plus']" />
                    </client-only> 
                    Add More Files
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useToast } from "vue-toastification"


    const toast = useToast()
    const isDragging = ref(false)
    const uploadedFiles = ref<File[]>([])
    const fileInput = ref<HTMLInputElement | null>(null)

    const emit = defineEmits<{
        (e: 'files-selected', files: File[]): void
        (e: 'files-updated', files: File[]): void
    }>()

    const props = withDefaults(defineProps<{
        maxFiles?: number
        maxSizeMB?: number
    }>(), {
        maxFiles: 3,
        maxSizeMB: 5
    })

    const maxSizeBytes = computed(() => props.maxSizeMB * 1024 * 1024)
    const maxSizeMB = computed(() => props.maxSizeMB)

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
            if (file.type !== 'application/pdf') {
                toast.error(`File ${file.name} is not a valid PDF`)
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

    const removeFile = (index: number) => {
        uploadedFiles.value.splice(index, 1)
        emit('files-updated', uploadedFiles.value)
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