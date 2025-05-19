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
                    <img style="max-height: 60px;" src="/img/leyeco-logo2.png" alt="Leyeco V - SYSTEM Logo" class="img-fluid">
                    Motorpool
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
                            <nuxt-link :class="{ active: $route.path === '/motorpool' }" class="nav-link text-white" to="/motorpool">Dashboard</nuxt-link>
                        </li>
                        <li v-if="canView('canManageTripTicket', authUser)" class="nav-item">
                            <nuxt-link :class="{ active: $route.path.startsWith('/motorpool/trip-ticket') }" class="nav-link text-white" to="/motorpool/trip-ticket">Trip Ticket</nuxt-link>
                        </li>
                        <li v-if="canView('canManageGasSlip', authUser)" class="nav-item">
                            <nuxt-link data-testid="gas-slip-menu" :class="{ active: $route.path.startsWith('/motorpool/gas-slip') }" class="nav-link text-white" to="/motorpool/gas-slip">Gas Slip</nuxt-link>
                        </li>
                        <!-- <li v-if="canView('canManageVehicle', authUser)" class="nav-item">
                            <nuxt-link :class="{ active: $route.path.startsWith('/motorpool/vehicle') }" class="nav-link text-white" to="/motorpool/vehicle">Vehicle</nuxt-link>
                        </li> -->
                        <li v-if="canViewVehicle(authUser)" class="nav-item dropdown">
                            <a data-testid="vehicle-dropdown" :class="{ active: isActiveVehicle }" class="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown" role="button"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                Vehicle
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li v-if="canView('canManageVehicle', authUser)"><nuxt-link data-testid="vehicle-management-menu" class="dropdown-item"
                                    to="/motorpool/vehicle">Vehicle Management</nuxt-link>
                                </li>
                                <li v-if="canView('canManageVehicleMaintenance', authUser)"><nuxt-link class="dropdown-item"
                                    to="/motorpool/vehicle-maintenance">Vehicle PMS</nuxt-link>
                                </li>
                                <li v-if="canView('canManageVehicleService', authUser)"><nuxt-link class="dropdown-item"
                                    to="/motorpool/services">PMS Services</nuxt-link>
                                </li>
                            </ul>
                        </li>
                        <li class="nav-item dropdown">
                            <a data-testid="reports-dropdown" :class="{ active: isActiveReports }" class="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown" role="button"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                Reports
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><nuxt-link class="dropdown-item"
                                    to="/motorpool/reports/trip-ticket-summary">Trip Ticket Summary</nuxt-link>
                                </li><li><nuxt-link class="dropdown-item"
                                    to="/motorpool/reports/trip-ticket-per-vehicle-type">Trip Ticket Per Vehicle Type</nuxt-link>
                                </li>
                            </ul>
                        </li>
                        <li class="nav-item">
                            <NotificationBell />
                        </li>
                        <li v-if="isApprover(authUser)" class="nav-item">
                            <client-only>
                                <nuxt-link class="nav-link text-white position-relative" to="/notifications/pendings">
                                        <font-awesome-icon :icon="['fas', 'clock']" />
                                        <span
                                        class="position-absolute top-1 start-100 translate-middle badge rounded-pill bg-danger">
                                        {{ totalPendings }}
                                    </span>
                                </nuxt-link>
                            </client-only>
                        </li>
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

        <div v-if="authUser" class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasExample"
            aria-labelledby="offcanvasExampleLabel">
            <button ref="offCanvassCloseBtn" type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
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
                        <nuxt-link class="nav-link" to="/home">Home</nuxt-link>
                    </li>
                    <li class="nav-item">
                        <nuxt-link class="nav-link text-muted" to="/update-password">Update Password</nuxt-link>
                    </li>
                    <li class="nav-item">
                        <nuxt-link class="nav-link text-muted" to="/activity-logs">Activity Logs</nuxt-link>
                    </li>
                    <li v-if="canView('canManageTripTicket', authUser)" class="nav-item">
                        <nuxt-link @click="closeOffcanvas" class="nav-link" to="/motorpool/trip-ticket">Trip Ticket</nuxt-link>
                    </li>
                    <li v-if="canView('canManageGasSlip', authUser)" class="nav-item">
                        <nuxt-link @click="closeOffcanvas" class="nav-link" to="/motorpool/gas-slip">Gas Slip</nuxt-link>
                    </li>
                    <li v-if="canView('canManageVehicle', authUser)" class="nav-item">
                        <nuxt-link @click="closeOffcanvas" class="nav-link" to="/motorpool/vehicle">Vehicle Management</nuxt-link>
                    </li>
                    <li v-if="canView('canManageVehicleMaintenance', authUser)" class="nav-item">
                        <nuxt-link @click="closeOffcanvas" class="nav-link" to="/motorpool/vehicle-maintenance">Vehicle PMS</nuxt-link>
                    </li>
                    <li v-if="canView('canManageVehicleService', authUser)" class="nav-item">
                        <nuxt-link @click="closeOffcanvas" class="nav-link" to="/motorpool/services">PMS Services</nuxt-link>
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
const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()
const API_URL = config.public.apiUrl
const WAREHOUSE_API_URL = config.public.warehouseApiUrl
const offCanvassCloseBtn = ref<HTMLButtonElement>()
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

const totalPendings = computed(() => {
    if (!authUser.value) return
    if (authUser.value.user.user_employee?.employee.total_pending_approvals) {
        return authUser.value.user.user_employee?.employee.total_pending_approvals
    }
    return 0
})

const isActiveVehicle = computed(() => 
    route.path.startsWith('/motorpool/vehicle') ||
    route.path.startsWith('/motorpool/vehicle-maintenance') ||
    route.path.startsWith('/motorpool/services')
)

const isActiveReports = computed(() => 
    route.path.startsWith('/motorpool/reports')
)


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

const isApprover = (authUser: AuthUser) => {

    const total_pendings = authUser.user.user_employee?.employee.total_pending_approvals
    if (total_pendings && total_pendings > 0) {
        return true
    }

}

// check first if has module
// check if user can read the specified module

function canView(module: string, authUser: AuthUser) {

    if (isAdmin(authUser)) return true

    if (!authUser.user.permissions){
        return false
    }

    // @ts-ignore
    if (!authUser.user.permissions.warehouse[module]) {
        return false
    }

    // @ts-ignore
    if (!!authUser.user.permissions.warehouse[module].read || !!authUser.user.permissions.warehouse[module].search) {
        return true
    }


    return false
}

function canViewVehicle(authUser: AuthUser) {

    if (isAdmin(authUser)) return true

    if (!authUser.user.permissions) return false

    const warehousePermissions = authUser.user.permissions.warehouse


    return (
        (!!warehousePermissions.canManageVehicle && warehousePermissions.canManageVehicle.read) || 
        (!!warehousePermissions.canManageVehicleMaintenance && warehousePermissions.canManageVehicleMaintenance.read) || 
        (!!warehousePermissions.canManageVehicleService && warehousePermissions.canManageVehicleService.read)
    )
}


const closeOffcanvas = () => {
  offCanvassCloseBtn.value?.click()
};


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

</style>