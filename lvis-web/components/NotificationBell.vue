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
            >
                <div class="icon-circle bg-primary text-white flex-shrink-0">
                    <font-awesome-icon :icon="['fas', 'bell']" />
                </div>
                <div class="flex-grow-1" style="min-width: 0;"> 
                    <div class="fw-bold">{{ notification.title }}</div>
                    <div class="text-muted text-wrap text-break small" v-html="notification.message" /> 
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
import { mark_notifications_as_read } from '~/composables/notification/notification.api';
import { useNotification } from '~/composables/useNotification';

const dropdownOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const authUser = ref<AuthUser>();

const { notifications, connect } = useNotification();


onMounted(async() => {

    authUser.value = await getAuthUserAsync();
    if (authUser.value.user) {
        connect(authUser.value.user.username);
    }

    document.addEventListener('click', handleClickOutside);

})

const unreadNotifications = computed(() => {
    return notifications.value.filter(i => i.is_read === false)
});

const unreadCount = computed(() => unreadNotifications.value.length);

const toggleDropdown = async(e: Event) => {
    e.preventDefault();
    dropdownOpen.value = !dropdownOpen.value;
    
    if(dropdownOpen.value === true && unreadCount.value > 0) {

        const notification_ids = unreadNotifications.value.map(i => i.id)

        const total_updated_notifications = await mark_notifications_as_read({ notification_ids })

        console.log('total_updated_notifications', total_updated_notifications);

        unreadNotifications.value.forEach(notification => {
            notification.is_read = true;
        });


    }

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

const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
        dropdownOpen.value = false;
    }
};

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


/* Soft Badges */
::v-deep(.soft-badge) {
    border-radius: 12px;
    font-weight: bold;
    padding: 6px 12px;
}

/* Status Colors */
::v-deep(.soft-badge-gray) {
    background: #e2e3e5; /* Soft Gray */
    color: #6c757d;
}

::v-deep(.soft-badge-blue) {
    background: #cfe2ff; /* Softer Blue */
    color: #084298;
}

::v-deep(.soft-badge-yellow) {
    background: #fff3cd; /* Soft Yellow */
    color: #856404;
}

::v-deep(.soft-badge-orange) {
    background: #ffe5d0; /* Soft Pastel Orange */
    color: #b45309;
}

::v-deep(.soft-badge-green) {
    background: #d1e7dd; /* Soft Green */
    color: #0f5132;
}

::v-deep(.soft-badge-red) {
    background: #f8d7da; /* Soft Red */
    color: #842029;
}

::v-deep(.soft-badge-violet) {
    background: #e0c3fc; /* Soft Violet */
    color: #5a189a;
}

::v-deep(.soft-blue) {
    color: #cfe2ff;
}

/* Soft Button Styles */
::v-deep(.soft-btn-gray) {
    background: #e2e3e5;
    color: #6c757d;
    border: none;
}

::v-deep(.soft-btn-blue) {
    background: #cfe2ff;
    color: #084298;
    border: none;
}

::v-deep(.soft-btn-yellow) {
    background: #fff3cd;
    color: #856404;
    border: none;
}

::v-deep(.soft-btn-orange) {
    background: #ffe5d0;
    color: #b45309;
    border: none;
}

::v-deep(.soft-btn-green) {
    background: #d1e7dd;
    color: #0f5132;
    border: none;
}

::v-deep(.soft-btn-red) {
    background: #f8d7da;
    color: #842029;
    border: none;
}

::v-deep(.soft-btn-violet) {
    background: #e0c3fc;
    color: #5a189a;
    border: none;
}

/* Hover Effects */
::v-deep(.soft-btn-gray:hover) {
    background: #d6d8db;
}

::v-deep(.soft-btn-blue:hover) {
    background: #b6d4fe;
}

::v-deep(.soft-btn-yellow:hover) {
    background: #ffe8a1;
}

::v-deep(.soft-btn-orange:hover) {
    background: #ffdab8;
}

::v-deep(.soft-btn-green:hover) {
    background: #bcd9c6;
}

::v-deep(.soft-btn-red:hover) {
    background: #f5c6cb;
}

::v-deep(.soft-btn-violet:hover) {
    background: #cfb0f9;
}

</style>