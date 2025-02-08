<template>
    <div class="floating-button-container">
        <button class="floating-button" data-bs-toggle="modal" data-bs-target="#assistantModal">
            <img src="/assistant-avatar.webp" alt="Chat Icon" class="button-image" />
        </button>

    </div>
</template>
  
<script setup lang="ts">

    import { useAssistantStore } from '#imports';

    const store = useAssistantStore()


</script>
  
<style scoped>
    /* Floating Button Styles */
    .floating-button-container {
        position: fixed;
        bottom: 20px;
        left: -14px;
        z-index: 1000;
    }

    .floating-button {
        background-color: #007bff;
        border: none;
        border-radius: 50%;
        width: 110px;
        height: 110px;
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.3s ease;
    }

    .floating-button:hover {
    background-color: white;
    }

    .button-image {
        width: 80px;
        height: 80px; 
        object-fit: contain; 
    }


    /* Mobile Specific Adjustments */
    @media (max-width: 768px) {
        .floating-button {
            width: 80px; /* Smaller size for mobile */
            height: 80px;
        }

        .button-image {
            width: 60px; /* Smaller image size */
            height: 60px; 
        }
    }

</style>