<template>
    <div class="attachments-container">
        <div class="row g-3">
            <div v-for="attachment in meqs_attachments" :key="attachment.id" class="col-md-6 col-lg-4">
                <div class="card attachment-card h-100">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex align-items-center mb-3">
                            <div class="attachment-icon bg-danger text-white rounded p-3 me-3">
                                <client-only>
                                    <font-awesome-icon class="fa-2x" :icon="['fas', 'file-pdf']"/>
                                </client-only>
                            </div>
                            <div class="flex-grow-1 min-width-0">
                                <h6 class="card-title mb-1 text-truncate" :title="attachment.filename">
                                    {{ attachment.filename }}
                                </h6>
                                <small class="text-muted">PDF Document</small>
                            </div>
                        </div>
                        <div class="mt-auto d-flex justify-content-end gap-2">
                            <a 
                                :href="getUploadsPath(attachment.src)" 
                                target="_blank" 
                                class="btn btn-sm btn-outline-primary"
                                title="View PDF"
                            >
                                <client-only>
                                    <font-awesome-icon class="me-1" :icon="['fas', 'eye']"/>
                                </client-only> 
                                <span>View</span>
                            </a>
                            <a 
                                :href="getUploadsPath(attachment.src)" 
                                download 
                                class="btn btn-sm btn-outline-secondary"
                                title="Download PDF"
                            >
                                <client-only>
                                    <font-awesome-icon class="me-1" :icon="['fas', 'download']"/>
                                </client-only> 
                                <span>Download</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { MeqsAttachment } from '~/composables/purchase/meqs/meqs-attachment';

    const config = useRuntimeConfig();
    const API_FILE_ENDPOINT = config.public.apiUrl + '/api/v1/file-upload';

    defineProps<{
        meqs_attachments: MeqsAttachment[];
    }>();

    function getUploadsPath(src: string) {
        const path = src.replace(UPLOADS_PATH, '');
        return API_FILE_ENDPOINT + path;
    }
</script>

<style scoped>
.attachments-container {
    margin: 1.5rem 0;
}

.attachment-card {
    border-radius: 0.5rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    border: none;
    background-color: #f8f9fa; /* Light gray background */
    border-left: 4px solid #dc3545; /* Red accent border to match the PDF icon */
}

.attachment-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.12);
    background-color: #ffffff; /* White on hover */
}

.attachment-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background-color: #dc3545 !important; /* Brighter red */
    transition: all 0.3s ease;
}

.attachment-card:hover .attachment-icon {
    background-color: #c82333 !important; /* Darker red on hover */
}

.min-width-0 {
    min-width: 0;
}

.text-truncate {
    display: inline-block;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Improve button contrast against the card background */
.btn-outline-primary {
    border-color: #0d6efd;
    color: #0d6efd;
}

.btn-outline-secondary {
    border-color: #6c757d;
    color: #6c757d;
}
</style>