<template>
    <div v-if="show_back_btn" class="mb-3">
        <button @click="emits('close-image')" class="btn btn-secondary">Back</button>
    </div>

    <div class="d-flex flex-column align-items-center">

        <div class="container text-center" v-if="task_file">
            <img 
                :src="getUploadsPath(task_file?.source_path)" 
                class="img-fluid mx-auto d-block" 
                :alt="task_file?.filename"
            >
        </div>

    </div>
</template>


<script setup lang="ts">
    import type { TaskFile } from '~/composables/powerserve/task/task.types';

    const emits = defineEmits(['close-image'])

    const props = defineProps({
        task_file: {
            type: Object as () => TaskFile,
        },
        show_back_btn: {
            type: Boolean,
            default: true,
        }
    });

    const config = useRuntimeConfig()
    const API_FILE_ENDPOINT = config.public.apiUrl + '/api/v1/file-upload'

    function getUploadsPath(src: string) {

        const path = src.replace(UPLOADS_PATH, '')
        console.log('PATH', path)

        const uploadsPath = API_FILE_ENDPOINT + path
        return uploadsPath

    }

</script>