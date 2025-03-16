<template>
    <div class="mt-4">
        <div class="row g-3">
            <div v-for="status in store.complaint_statuses" :key="status.name" class="col-lg-2 col-md-4 col-sm-6 col-12">
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
    import { COMPLAINT_STATUS } from '~/composables/powerserve/complaints/complaint.constants';
import { useComplaintStore } from '~/composables/powerserve/complaints/complaints.store';

    const store = useComplaintStore();
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
}

/* Title Styling */
.status-title {
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 0.2rem;
}

/* Fancy Total Number */
.status-total {
    font-size: 1.5rem;
    font-weight: bold;
    background: rgba(255, 255, 255, 0.2);
    padding: 4px 12px;
    border-radius: 8px;
}

/* Left-aligned description */
.status-description {
    font-size: 0.85rem;
    flex-grow: 1;
    max-width: 90%;
    text-align: left;
}

/* Responsive Design */
@media (max-width: 992px) {
    .soft-card {
        height: 170px;
    }
}

@media (max-width: 768px) {
    .soft-card {
        height: auto; /* Adjust height dynamically for smaller screens */
        padding: 1rem;
    }

    .status-title {
        font-size: 0.9rem;
    }

    .status-total {
        font-size: 1.3rem;
    }
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
