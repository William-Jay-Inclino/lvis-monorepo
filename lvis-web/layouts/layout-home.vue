<template>
    <div id="wrapper">

        <!-- Top bar -->
        <div v-if="SERVER !== 'production'" class="topbar bg-dark text-white py-1">
            <div class="container">
                <div>
                    Server: <span :class="SERVER_OBJECT[SERVER].color"> {{ SERVER_OBJECT[SERVER].label }} </span> 
                </div>
            </div>
        </div>

        <nav v-if="authUser" class="navbar sticky-top navbar-expand-lg navbar-dark" style="background-color: #1877F2;">
            <div class="container">
                <nuxt-link class="navbar-brand d-flex align-items-center" to="/home">
                    <img style="max-height: 50px;" src="/img/leyeco-logo2.png" alt="Leyeco V - SYSTEM Logo" class="img-fluid me-2">
                    <span class="text-white">Home</span>
                </nuxt-link>


                <!-- Notification Icon for Small Screens -->
                <div v-if="isApprover(authUser)" class="d-lg-none ms-auto me-5 position-relative">
                    <client-only>
                        <nuxt-link class="text-white position-relative" to="/notifications/pendings">
                            <font-awesome-icon :icon="['fas', 'clock']" />
                            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {{ totalPendings }}
                            </span>
                        </nuxt-link>
                    </client-only>
                </div>

                <!-- Offcanvas Toggler -->
                <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <NotificationBell />
                        </li>
                        <li v-if="isApprover(authUser)" class="nav-item">
                            <client-only>
                                <nuxt-link data-testid="notification" class="nav-link me-3 text-white position-relative" to="/notifications/pendings">
                                    <font-awesome-icon :icon="['fas', 'clock']" />
                                    <span
                                        class="position-absolute top-1 start-100 translate-middle badge rounded-pill bg-danger">
                                        {{ totalPendings }}
                                    </span>
                                </nuxt-link>
                            </client-only>
                        </li>
                        <li class="nav-item dropdown">
                            <a style="color: #FFFF00;" class="nav-link dropdown-toggle" href="#" id="navbarDropdown"
                                role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                
                                <client-only>
                                    <font-awesome-icon :icon="['fas', 'user-circle']" />
                                </client-only>

                                <span class="fw-bold fst-italic ms-1">

                                    {{ authUser.user.username }}

                                </span>
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><nuxt-link class="dropdown-item" to="/update-password">Update Password</nuxt-link></li>
                                <li><nuxt-link class="dropdown-item" to="/activity-logs">Activity Logs</nuxt-link></li>
                                <li>
                                    <a @click="handleLogOut" class="dropdown-item"> Logout </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <div class="container main-content mb-5">
            <!-- <slot /> -->
            <NuxtPage />
        </div>
        
        <Footer />

        <div v-if="authUser" class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasExample"
            aria-labelledby="offcanvasExampleLabel">
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            <div class="offcanvas-header">
                <img src="/avatar.jpg" alt="Profile Picture" class="img-fluid">
            </div>
            <div class="offcanvas-body d-flex flex-column">
                <ul class="nav flex-column mb-3">
                    <li class="nav-item">
                        <a href="javascript:void(0)" class="nav-link text-warning fst-italic fw-bold">
                            {{ authUser.user.username }}
                        </a>
                    </li>
                    <li class="nav-item">
                        <nuxt-link class="nav-link text-muted" to="/update-password">Update Password</nuxt-link>
                    </li>
                    <li class="nav-item">
                        <nuxt-link class="nav-link text-muted" to="/activity-logs">Activity Logs</nuxt-link>
                    </li>
                </ul>
                <div class="mt-auto d-grid">
                    <a @click="handleLogOut" class="btn btn-outline-danger btn-block"> Logout </a>
                </div>
            </div>
        </div>

        <Assistant />
        <AssistantModal />

    </div>
</template>



<script setup lang="ts">

import { logout } from '~/utils/helpers';
import { useUserInactivity } from '~/composables/user-inactivity';
import Swal from 'sweetalert2';
import { fetchTotalNotifications } from '~/composables/system/user/user.api';

const authUser = ref<AuthUser >()
const router = useRouter()
const config = useRuntimeConfig()
const API_URL = config.public.apiUrl
const WAREHOUSE_API_URL = config.public.warehouseApiUrl
const SERVER: ServerType = config.public.SERVER as ServerType
let updateUserInterval: ReturnType<typeof setInterval>;
const { isInactive } = useUserInactivity(USER_INACTIVITY_MAX_MINS)

const screenWidth = ref(0);
const isMobile = computed(() => screenWidth.value <= MOBILE_WIDTH);

onMounted(async() => {
    screenWidth.value = window.innerWidth;

    window.addEventListener('resize', () => {
        screenWidth.value = window.innerWidth;
    });

    authUser.value = await getAuthUserAsync()
    await updateTotalNotifications()
    updateUserInterval = setInterval(updateTotalNotifications, UPDATE_TOTAL_NOTIFS_INTERVAL);
})

onUnmounted( () => {
    clearInterval(updateUserInterval);
})


const totalPendings = computed(() => {
    if (!authUser.value) return
    if (authUser.value.user.user_employee?.employee.total_pending_approvals) {
        return authUser.value.user.user_employee?.employee.total_pending_approvals
    }
    return 0
})

watch(isInactive, async (val) => {
    if (val) {
        console.log('isInactive', val);
        handleUserInactivity(handleLogOut)
    }
});


const isApprover = (authUser: AuthUser) => {

    const total_pendings = authUser.user.user_employee?.employee.total_pending_approvals
    if (total_pendings && total_pendings > 0) {
        return true
    }

}

async function updateTotalNotifications() {
    console.log('updateTotalNotifications');
    
    if(!authUser.value) return 

    if(authUser.value.user.user_employee) {
        const response = await fetchTotalNotifications(authUser.value.user.user_employee.employee_id, WAREHOUSE_API_URL)
        if(response !== undefined) {
            authUser.value.user.user_employee.employee.total_pending_approvals = response
            const newAuthUser = JSON.stringify(authUser.value);
            localStorage.setItem(LOCAL_STORAGE_AUTH_USER_KEY, newAuthUser);
        }
    }

}

async function handleLogOut() {

    console.log('handleLogOut', authUser.value);

    if(!authUser.value) {
        console.error('authUser is not define in local storage');
        return 
    }

    Swal.fire({
        title: 'Logging out...',
        text: 'Please wait while we log you out.',
        allowOutsideClick: false, 
        didOpen: () => {
            Swal.showLoading(); 
        },
        willClose: () => {
            Swal.hideLoading(); 
        }
    });

    try {
        await logout({...authUser.value}, API_URL);
        router.push('/');
    } catch (error) {
        console.error('Error during logout:', error);
        Swal.fire({
            icon: 'error',
            title: 'Logout Failed',
            text: 'An error occurred while logging you out. Please contact system administrator.'
        });
    } finally {
        Swal.close();
    }

}
</script>

