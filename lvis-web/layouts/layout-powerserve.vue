<template>

    <div id="wrapper">

        <TopBar />


        <nav v-if="authUser" class="navbar sticky-top navbar-expand-lg navbar-dark" style="background-color: #1877F2;">
            <div class="container-fluid">

                <nuxt-link class="navbar-brand d-flex align-items-center ms-5" to="/home">
                    <img style="max-height: 60px;" src="/img/leyeco-logo2.png" alt="Leyeco V - SYSTEM Logo" class="img-fluid">
                    Powerserve
                </nuxt-link>
    
    
                <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                    <span class="navbar-toggler-icon"></span>
                </button>
                
                <div class="collapse navbar-collapse me-5" id="navbarSupportedContent">
                    <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <nuxt-link class="nav-link text-white" to="/home">Home</nuxt-link>
                        </li>
                        <li v-if="canView('canManageTask', authUser)" class="nav-item">
                            <nuxt-link :class="{ active: $route.path.startsWith('/powerserve/dashboard') }" class="nav-link text-white" to="/powerserve/dashboard/oic">OIC Dashboard</nuxt-link>
                        </li>
                        <li v-if="canView('canManageComplaint', authUser)" class="nav-item">
                            <nuxt-link :class="{ active: $route.path.startsWith('/powerserve/complaint') }" class="nav-link text-white" to="/powerserve/complaint">Complaint</nuxt-link>
                        </li>
                        <li v-if="canView('canManageMyTask', authUser)" class="nav-item">
                            <nuxt-link :class="{ active: $route.path.startsWith('/powerserve/my-tasks') }" class="nav-link text-white" to="/powerserve/my-tasks">My Tasks</nuxt-link>
                        </li>
                        <li v-if="canView('canManageMyPerformance', authUser)" class="nav-item">
                            <nuxt-link :class="{ active: $route.path.startsWith('/powerserve/my-performance') }" class="nav-link text-white" to="/powerserve/my-performance">My Performance</nuxt-link>
                        </li>
                        <li v-if="canViewLineman(authUser)" class="nav-item dropdown">
                            <a data-testid="warehouse-dropdown" :class="{ active: isActiveLineman }" class="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown" role="button"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                Lineman
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li v-if="canView('canManageLineman', authUser)"><nuxt-link class="dropdown-item"
                                    to="/powerserve/lineman">Personnels</nuxt-link>
                                </li>
                                <li v-if="canView('canManageLinemanSchedule', authUser)"><nuxt-link class="dropdown-item"
                                    to="/powerserve/lineman/schedule">Schedule</nuxt-link>
                                </li>
                                <li v-if="canView('canManageLinemanEvaluation', authUser)"><nuxt-link class="dropdown-item"
                                    to="/powerserve/lineman/performance-evaluation">Performance Evaluation</nuxt-link>
                                </li>
                            </ul>
                        </li>
                        <li v-if="canViewDataManagement(authUser)" class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                Data Management
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li v-if="canView('canManageArea', authUser)">
                                    <nuxt-link @click="closeOffcanvas" class="dropdown-item"
                                        to="/powerserve/area">Area</nuxt-link>
                                </li>
                                <li v-if="canView('canManageMunicipality', authUser)">
                                    <nuxt-link @click="closeOffcanvas" class="dropdown-item"
                                        to="/powerserve/municipality">Municipality</nuxt-link>
                                </li>
                                <li v-if="canView('canManageBarangay', authUser)">
                                    <nuxt-link @click="closeOffcanvas" class="dropdown-item"
                                        to="/powerserve/barangay">Barangay</nuxt-link>
                                </li>
                                <li v-if="canView('canManageSitio', authUser)">
                                    <nuxt-link @click="closeOffcanvas" class="dropdown-item"
                                        to="/powerserve/sitio">Sitio</nuxt-link>
                                </li>
                            </ul>
                        </li>
                        <li v-if="authUser" class="nav-item dropdown">
                            <a style="color: #FFFF00;" class="nav-link dropdown-toggle" href="#" id="navbarDropdown"
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
                                    <a @click="handleLogOut" class="dropdown-item"> Logout </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>

            </div>

        </nav>

        <div class="main-content mb-5">

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
                    <li v-if="canView('canManageTask', authUser)" class="nav-item">
                        <nuxt-link @click="closeOffcanvas" class="nav-link" to="/powerserve/dashboard/oic">OIC Dashboard</nuxt-link>
                    </li>
                    <li v-if="canView('canManageComplaint', authUser)" class="nav-item">
                        <nuxt-link @click="closeOffcanvas" class="nav-link" to="/powerserve/complaint">Complaint</nuxt-link>
                    </li>
                    <li v-if="canView('canManageMyTask', authUser)" class="nav-item">
                        <nuxt-link @click="closeOffcanvas" class="nav-link" to="/powerserve/my-tasks">My Tasks</nuxt-link>
                    </li>
                    <li v-if="canView('canManageMyPerformance', authUser)" class="nav-item">
                        <nuxt-link @click="closeOffcanvas" class="nav-link" to="/powerserve/my-performance">My Performance</nuxt-link>
                    </li>
                    <li v-if="canViewLineman(authUser)" class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            Lineman
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li v-if="canView('canManageLineman', authUser)"><nuxt-link @click="closeOffcanvas" class="dropdown-item"
                                to="/powerserve/lineman">Personnels</nuxt-link>
                            </li>
                            <li v-if="canView('canManageLinemanSchedule', authUser)"><nuxt-link @click="closeOffcanvas" class="dropdown-item"
                                to="/powerserve/lineman/schedule">Schedule</nuxt-link>
                            </li>
                            <li v-if="canView('canManageLinemanEvaluation', authUser)"><nuxt-link @click="closeOffcanvas" class="dropdown-item"
                                to="/powerserve/lineman/performance-evaluation">Performance Evaluation</nuxt-link>
                            </li>
                        </ul>
                    </li>
                    <li v-if="canViewDataManagement(authUser)" class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            Data Management
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li v-if="canView('canManageArea', authUser)"><nuxt-link @click="closeOffcanvas" class="dropdown-item"
                                to="/powerserve/area">Area</nuxt-link>
                            </li>
                            <li v-if="canView('canManageMunicipality', authUser)"><nuxt-link @click="closeOffcanvas" class="dropdown-item"
                                to="/powerserve/municipality">Municipality</nuxt-link>
                            </li>
                            <li v-if="canView('canManageBarangay', authUser)"><nuxt-link @click="closeOffcanvas" class="dropdown-item"
                                to="/powerserve/barangay">Barangay</nuxt-link>
                            </li>
                            <li v-if="canView('canManageSitio', authUser)"><nuxt-link @click="closeOffcanvas" class="dropdown-item"
                                to="/powerserve/sitio">Sitio</nuxt-link>
                            </li>
                        </ul>
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

const authUser = ref<AuthUser>()
const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()
const API_URL = config.public.apiUrl
const WAREHOUSE_API_URL = config.public.warehouseApiUrl
const offCanvassCloseBtn = ref<HTMLButtonElement>()

let updateUserInterval: ReturnType<typeof setInterval>;
const { isInactive } = useUserInactivity(USER_INACTIVITY_MAX_MINS)


onMounted(async() => {


    authUser.value = await getAuthUserAsync()

    await updateTotalNotifications()
    updateUserInterval = setInterval(updateTotalNotifications, UPDATE_TOTAL_NOTIFS_INTERVAL);
})

onUnmounted( () => {
    clearInterval(updateUserInterval);
})

const isActiveLineman = computed(() => 
    route.path.startsWith('/powerserve/lineman/rr') || 
    route.path.startsWith('/powerserve/lineman/schedule') || 
    route.path.startsWith('/powerserve/lineman/performance-evaluation') 
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


function canViewLineman(authUser: AuthUser) {

    if (isAdmin(authUser)) return true

    if (!authUser.user.permissions) return false

    const powerservePermissions = authUser.user.permissions.powerserve


    return (
        (!!powerservePermissions?.canManageLineman && powerservePermissions.canManageLineman.read) || 
        (!!powerservePermissions?.canManageLinemanSchedule && powerservePermissions.canManageLinemanSchedule.manage) || 
        (!!powerservePermissions?.canManageLinemanEvaluation && powerservePermissions.canManageLinemanEvaluation.manage)
    )
}

function canViewDataManagement(authUser: AuthUser) {

    if (isAdmin(authUser)) return true

    if (!authUser.user.permissions) return false

    const powerservePermissions = authUser.user.permissions.powerserve

    return (
        (!!powerservePermissions?.canManageArea && powerservePermissions.canManageArea.read) ||
        (!!powerservePermissions?.canManageMunicipality && powerservePermissions.canManageMunicipality.read) ||
        (!!powerservePermissions?.canManageBarangay && powerservePermissions.canManageBarangay.read) ||
        (!!powerservePermissions?.canManageSitio && powerservePermissions.canManageSitio.read)
    )
}

// check first if has module
// check if user can read the specified module

function canView(module: string, authUser: AuthUser) {

    if (isAdmin(authUser)) return true

    if (!authUser.user.permissions){
        return false
    }

    // @ts-ignore
    if (!authUser.user.permissions.powerserve[module]) {
        return false
    }

    // @ts-ignore
    if (!!authUser.user.permissions.powerserve[module].read || !!authUser.user.permissions.powerserve[module].search || !!authUser.user.permissions.powerserve[module].manage) {
        return true
    }


    return false
}


const closeOffcanvas = () => {
  offCanvassCloseBtn.value?.click()
};

</script>



<style>

/* body {
    background: whitesmoke;
} */

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

.soft-badge {
    border-radius: 12px;
    font-weight: bold;
    padding: 6px 12px;
}

.soft-badge-gray {
    background: #e2e3e5; 
    color: #6c757d;
}

.soft-badge-blue {
    background: #cfe2ff; 
    color: #084298;
}

.soft-badge-yellow {
    background: #fff3cd;
    color: #856404;
}

.soft-badge-orange {
    background: #ffe5d0;
    color: #b45309;
}

.soft-badge-green {
    background: #d1e7dd;
    color: #0f5132;
}

.soft-badge-red {
    background: #f8d7da; 
    color: #842029;
}

.soft-badge-violet {
    background: #e0c3fc; 
    color: #5a189a;
}

.soft-blue {
    color: #cfe2ff;
}

.soft-btn-gray {
    background: #e2e3e5; 
    color: #6c757d;
    border: none;
}

.soft-btn-blue {
    background: #cfe2ff; 
    color: #084298;
    border: none;
}

.soft-btn-yellow {
    background: #fff3cd; 
    color: #856404;
    border: none;
}

.soft-btn-orange {
    background: #ffe5d0;
    color: #b45309;
    border: none;
}

.soft-btn-green {
    background: #d1e7dd;
    color: #0f5132;
    border: none;
}

.soft-btn-red {
    background: #f8d7da; 
    color: #842029;
    border: none;
}

.soft-btn-violet {
    background: #e0c3fc; 
    color: #5a189a;
    border: none;
}

.soft-btn-gray:hover {
    background: #d6d8db;
}

.soft-btn-blue:hover {
    background: #b6d4fe;
}

.soft-btn-yellow:hover {
    background: #ffe8a1;
}

.soft-btn-orange:hover {
    background: #ffdab8;
}

.soft-btn-green:hover {
    background: #bcd9c6;
}

.soft-btn-red:hover {
    background: #f5c6cb;
}

.soft-btn-violet:hover {
    background: #cfb0f9;
}

</style>