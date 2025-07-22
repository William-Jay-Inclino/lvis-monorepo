<template>
    <div class="topbar bg-dark text-light py-3 shadow-sm">
        <div class="container d-flex justify-content-between align-items-center">
            
            <!-- Server info -->
            <div class="d-flex align-items-center gap-2">
                <span class="fw-semibold">Server:</span>
                <span :class="['badge', SERVER_OBJECT[SERVER].color]">
                    {{ SERVER_OBJECT[SERVER].label }}
                </span>
            </div>

            <!-- Icons -->
            <div class="d-flex align-items-center gap-5">
                <client-only>
                    <!-- <NotificationBell /> -->
                    <NotificationPending />
                </client-only>
            </div>


        </div>
    </div>
</template>

<script setup lang="ts">
    const config = useRuntimeConfig()
    const SERVER: ServerType = config.public.SERVER as ServerType
</script>
