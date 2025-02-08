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
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease;
        box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.2), 0px 8px 20px rgba(0, 0, 0, 0.1);
    }

    /* Hover effect for dramatic lift */
    .floating-button:hover {
        background-color: #ffffff;
        transform: translateY(-8px); /* Stronger lift effect */
        box-shadow: 0px 12px 25px rgba(0, 0, 0, 0.3), 0px 18px 30px rgba(0, 0, 0, 0.1); /* Stronger shadow for more pop */
        filter: brightness(1.2); /* Subtle brightness effect */
    }

    .floating-button:active {
        transform: translateY(2px); /* Slight button press */
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1), 0px 6px 15px rgba(0, 0, 0, 0.1);
        filter: brightness(1); /* Return to normal brightness on click */
    }

    .button-image {
        width: 80px;
        height: 80px; 
        object-fit: contain; 
    }

    /* Mobile Specific Adjustments */
    @media (max-width: 768px) {
        .floating-button {
            width: 80px;
            height: 80px;
        }

        .button-image {
            width: 60px;
            height: 60px; 
        }
    }

</style>
