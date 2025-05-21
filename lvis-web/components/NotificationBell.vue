<template>
    <div ref="dropdownRef" class="position-relative">
        <!-- icon -->
        <nuxt-link 
            class="nav-link position-relative" 
            to="#"
            @click.prevent="toggleDropdown"
            aria-label="Notifications"
        >
            <font-awesome-icon class="text-white" :icon="['fas', 'bell']"/>
            <span
                v-if="unreadCount > 0"
                class="position-absolute top-1 start-100 translate-middle badge rounded-pill bg-danger"
            >
                {{ unreadCount }}
                <span class="visually-hidden">unread notifications</span>
            </span>
        </nuxt-link>

        <!-- content -->
        <div
            v-if="dropdownOpen"
            class="dropdown-menu dropdown-menu-end show mt-2 shadow-lg p-2 border-0 notification-dropdown"
        >
            <h6 class="dropdown-header text-primary">Notifications</h6>

            <div v-if="notifications.length === 0" class="text-center text-muted p-3">
                No new notifications
            </div>

            <div 
                v-for="(notification, index) in notifications" 
                :key="index" 
                class="dropdown-item d-flex gap-3 align-items-start py-3"
                @click="handleNotificationClick(notification)"
            >
                <div class="icon-circle bg-primary text-white flex-shrink-0">
                    <font-awesome-icon :icon="['fas', 'bell']" />
                </div>
                <div class="flex-grow-1" style="min-width: 0;"> 
                    <div class="fw-bold">{{ notification.title }}</div>
                    <div class="text-muted text-wrap text-break"> 
                        {{ notification.message }}
                    </div>
                    <div class="text-secondary" style="font-size: 0.75rem;">
                        {{ formatTimeAgo(notification.created_at || new Date().toISOString()) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useNotification } from '~/composables/useNotification';


const dropdownOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const authUser = ref<AuthUser>();

// Use notification composable
const { notifications, connect, disconnect, isConnected, error } = useNotification();

onMounted(async() => {

    authUser.value = await getAuthUserAsync()

})

// Computed
const unreadCount = computed(() => notifications.value.length);

// Methods
const toggleDropdown = (e: Event) => {
    e.preventDefault();
    dropdownOpen.value = !dropdownOpen.value;
};

const handleNotificationClick = (notification: any) => {
    console.log('Notification clicked:', notification);
    dropdownOpen.value = false;
    // Add any notification click handling logic here
};

const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

// Lifecycle
onMounted(async () => {
    authUser.value = await getAuthUserAsync();
    if (authUser.value.user) {
        connect(authUser.value.user.username);
    }
});

// Clean up on unmount
onUnmounted(() => {
    disconnect();
});
</script>

<style scoped>
.icon-circle {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    flex-shrink: 0;
}
.notification-item:hover {
    background-color: #f8f9fa;
    cursor: pointer;
}

.dropdown-menu.notification-dropdown {
    min-width: 350px;
    max-width: 450px;
    max-height: 750px;
    overflow-y: auto;
    border-radius: 0.75rem;
    z-index: 1055 !important;
}
</style>