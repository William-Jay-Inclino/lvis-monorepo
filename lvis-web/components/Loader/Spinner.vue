<template>
    <div class="spinner-container">
        <div class="spinner">
            <div class="spinner-inner"></div>
        </div>
        <p class="loading-text text-muted fst-italic">
            <!-- How about a quick smile while waiting? -->
            Loading... please wait
            <client-only>
                <font-awesome-icon :icon="['fas', 'smile']"/>
            </client-only>
        </p>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.spinner-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 20vh;
}

.spinner {
    width: 80px;
    height: 80px;
    position: relative;
}

.spinner-inner {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 64px;
    height: 64px;
    margin: 8px;
    border: 6px solid #ccc;
    border-radius: 50%;
    animation: spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #ccc transparent transparent transparent;
}

.loading-text {
    font-size: 16px;
    margin-top: 16px;
}

@keyframes spinner {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>