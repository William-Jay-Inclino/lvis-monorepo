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

        <nav class="navbar sticky-top navbar-expand-lg navbar-dark" style="background-color: #1877F2;">
            <div class="container">
                <nuxt-link class="navbar-brand" to="/home">
                    <img style="max-height: 60px;" src="/img/leyeco-logo2.png" alt="Leyeco V - SYSTEM Logo" class="img-fluid">
                    Notifications
                </nuxt-link>
                <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <nuxt-link class="nav-link text-white" to="/home">Home</nuxt-link>
                        </li>
                        <li class="nav-item">
                            <NotificationBell />
                        </li>
                        <!-- <li class="nav-item">
                            <nuxt-link class="nav-link text-white" to="/notifications">Pending Forms</nuxt-link>
                        </li> -->
                        <li v-if="authUser" class="nav-item dropdown">
                            <a data-testid="username-dropdown" style="color: #FFFF00;" class="nav-link dropdown-toggle" href="#" id="navbarDropdown"
                                role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <client-only>
                                <font-awesome-icon :icon="['fas', 'user-circle']"/>
                            </client-only>
                                <span class="fw-bold fst-italic ms-1">

                                    {{ authUser.user.username }}

                                </span>
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><nuxt-link class="dropdown-item" to="/update-password">Update Password</nuxt-link></li>
                                <li><nuxt-link class="dropdown-item" to="/activity-logs">Activity Logs</nuxt-link></li>
                                <li>
                                    <a data-testid="logout" @click="handleLogOut" class="dropdown-item"> Logout </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>

            </div>
        </nav>

        <div class="container main-content mb-5">

            <div class="mt-3">
                <!-- <slot /> -->
                <NuxtPage />
            </div>

        </div>

        <Footer />


        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasExample"
            aria-labelledby="offcanvasExampleLabel">
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            <div class="offcanvas-header">
                <img src="/avatar.jpg" alt="Profile Picture" class="img-fluid">
            </div>
            <div class="offcanvas-body d-flex flex-column">
                <ul class="nav flex-column mb-3">
                    <li class="nav-item">
                        <nuxt-link class="nav-link" to="/home">Home</nuxt-link>
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

import Swal from 'sweetalert2';
import { fetchTotalNotifications } from '~/composables/system/user/user.api';
import { logout } from '~/utils/helpers';
const authUser = ref()
const config = useRuntimeConfig()
const API_URL = config.public.apiUrl
const WAREHOUSE_API_URL = config.public.warehouseApiUrl
const router = useRouter()
const SERVER: ServerType = config.public.SERVER as ServerType

const { isInactive } = useUserInactivity(USER_INACTIVITY_MAX_MINS)
let updateUserInterval: ReturnType<typeof setInterval>;

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


watch(isInactive, async (val) => {
    if (val) {
        console.log('isInactive', val);
        handleUserInactivity(handleLogOut)
    }
});

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



<style scoped>
.nav-item {
    padding: 0.5rem 1rem;
    transition: background-color 0.3s;
}

.nav-link {
    color: #343a40;
    /* Dark text color */
    transition: color 0.3s;
}

.dropdown-menu {
    background-color: #f8f9fa;
    /* Light grey background for dropdown menu */
}

.dropdown-item {
    color: #343a40;
    transition: color 0.3s;
}

/* .custom-card {
    background-color: white;
    border-radius: 10px;
    border: 0;
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
    height: 100vh;
    padding: 0px 20px 20px 20px;
    overflow-y: auto;
} */
</style>