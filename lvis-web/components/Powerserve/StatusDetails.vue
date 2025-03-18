<template>
    <div class="mt-4">
        <div class="row g-3">
            <div v-for="status in statuses" :key="status.name" class="col-lg-2 col-md-4 col-sm-6 col-12">
                <div :class="`soft-card soft-card-${status.color_class}`">
                    <div class="soft-card-header">
                        <h5 class="status-title">{{ status.name }}</h5>
                        <span class="status-total">{{ status.total }}</span>
                    </div>
                    <p class="status-description">
                        {{ status.description }} 
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { ComplaintStatus } from '~/composables/powerserve/complaint/complaint.types';
    import type { TaskStatus } from '~/composables/powerserve/task/task.types';

    const props = defineProps({
        statuses: {
            type: Array as () => ComplaintStatus[] | TaskStatus[],
        },
    })
</script>

<style scoped>
/* Ensure all cards have the same size and alignment */
.soft-card {
    border: none;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
    height: 160px; /* Uniform height */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: left;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    overflow: hidden; /* Prevent content overflow */
}

/* Hover effect for better UI experience */
.soft-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* Header section: title and total count */
.soft-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px; /* Fixed height for the header */
    flex-shrink: 0; /* Prevent the header from shrinking */
}

/* Title Styling */
.status-title {
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 0;
    white-space: nowrap; /* Prevent text wrapping */
    overflow: hidden; /* Hide overflow */
    max-width: 70%; /* Limit width to prevent overflow */
}

/* Fancy Total Number */
.status-total {
    font-size: 1.5rem;
    font-weight: bold;
    background: rgba(255, 255, 255, 0.2);
    padding: 4px 12px;
    border-radius: 8px;
}

/* Left-aligned description with scroll */
.status-description {
    font-size: 0.85rem;
    flex-grow: 1; /* Take up remaining space */
    max-width: 100%; /* Ensure it doesn't overflow */
    text-align: left;
    overflow-y: auto; /* Enable vertical scrolling */
    height: calc(100% - 40px); /* Dynamic height based on card height minus header height */
    padding-right: 8px; /* Add some padding to avoid overlap with scrollbar */
    margin-top: 0.5rem; /* Add some spacing between header and description */
}

/* Color Themes */
.soft-card-gray { background: #e2e3e5; color: #6c757d; }
.soft-card-blue { background: #cfe2ff; color: #084298; }
.soft-card-yellow { background: #fff3cd; color: #856404; }
.soft-card-orange { background: #ffe5d0; color: #b45309; }
.soft-card-green { background: #d1e7dd; color: #0f5132; }
.soft-card-red { background: #f8d7da; color: #842029; }
.soft-card-violet { background: #e0c3fc; color: #5a189a; }
</style>