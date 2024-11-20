<template>

    <div id="wrapper">
        <nav v-if="authUser" class="navbar sticky-top navbar-expand-lg navbar-dark" style="background-color: #1877F2;">
            <div class="container">
                <nuxt-link class="navbar-brand" to="/home">
                    <img style="max-height: 60px;" src="~/assets/img/leyeco-logo2.png" alt="Leyeco V - SYSTEM Logo" class="img-fluid">
                    Leyeco V - SYSTEM
                </nuxt-link>
                <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <!-- Notification icon for small screen -->
                <div v-if="isApprover(authUser)" class="d-lg-none ms-auto me-3 position-relative">
                    <nuxt-link class="text-white position-relative" to="/e-forms/pendings">
                        <i class="fas fa-bell"></i>
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {{ totalPendings }}
                        </span>
                    </nuxt-link>
                </div>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <nuxt-link class="nav-link text-white" to="/home">Home</nuxt-link>
                        </li>
                        <li v-if="isApprover(authUser)" class="nav-item">
                            <nuxt-link class="nav-link text-white position-relative" to="/e-forms/pendings">
                                <i class="fas fa-bell"></i>
                                <span
                                    class="position-absolute top-1 start-100 translate-middle badge rounded-pill bg-danger">
                                    {{ totalPendings }}
                                </span>
                            </nuxt-link>
                        </li>
                        <li v-if="isAdmin(authUser)" class="nav-item">
                            <nuxt-link class="nav-link text-white" to="/system/user">Users</nuxt-link>
                        </li>
                        <li v-if="canViewDataManagement(authUser)" class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown"
                                role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Data Management
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li v-if="canView('canManageEmployee', authUser)"><nuxt-link class="dropdown-item"
                                        to="/system/employee">Employee</nuxt-link></li>
                                <li v-if="canView('canManageDepartment', authUser)"><nuxt-link class="dropdown-item"
                                        to="/system/department">Department</nuxt-link></li>
                                <li v-if="canView('canManageDivision', authUser)"><nuxt-link class="dropdown-item"
                                    to="/system/division">Division</nuxt-link></li>
                                <li v-if="canView('canManageAccount', authUser)"><nuxt-link class="dropdown-item"
                                        to="/system/account">Account</nuxt-link></li>
                                <li v-if="canView('canManageClassification', authUser)"><nuxt-link
                                        class="dropdown-item"
                                        to="/system/classification">Classification</nuxt-link></li>
                            </ul>
                        </li>
                        <!-- <li v-if="isAdmin(authUser)" class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown"
                                role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Settings
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><nuxt-link class="dropdown-item"
                                        to="/system/settings/warehouse">Warehouse</nuxt-link></li>
                            </ul>
                        </li> -->
                        <li v-if="authUser" class="nav-item dropdown">
                            <a style="color: #FFFF00;" class="nav-link dropdown-toggle" href="#" id="navbarDropdown"
                                role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fas fa-user-circle"></i>
                                <span class="fw-bold fst-italic ms-1">

                                    {{ authUser.user.username }}

                                </span>
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a class="dropdown-item" href="#">Profile</a></li>
                                <!-- <li><a class="dropdown-item" href="#">Settings</a></li>
                                <li><a class="dropdown-item" href="#">Activity log</a></li> -->
                                <li>
                                    <a @click="handleLogOut" class="dropdown-item"> Logout </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>

            </div>
        </nav>

        <div class="container main-content">

            <div class="mt-3">
                <!-- <slot /> -->
                <NuxtPage />
            </div>

        </div>

        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
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
                        <nuxt-link class="nav-link" to="/home">Home</nuxt-link>
                    </li>
                    <li v-if="isAdmin(authUser)" class="nav-item">
                        <nuxt-link class="nav-link" to="/system/user">Users</nuxt-link>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            Data Management
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><nuxt-link class="dropdown-item" to="/system/employee">Employee</nuxt-link>
                            </li>
                            <li><nuxt-link class="dropdown-item"
                                    to="/system/department">Department</nuxt-link></li>
                            <li><nuxt-link class="dropdown-item"
                                to="/system/division">Division</nuxt-link></li>
                            <li><nuxt-link class="dropdown-item"
                                    to="/system/classification">Classification</nuxt-link></li>
                            <li><nuxt-link class="dropdown-item"
                                    to="/system/account">Account</nuxt-link></li>
                        </ul>
                    </li>
                    <!-- <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            Settings
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><nuxt-link class="dropdown-item"
                                    to="/system/settings/warehouse">Warehouse</nuxt-link></li>
                        </ul>
                    </li> -->
                </ul>
                <div class="mt-auto d-grid">
                    <a @click="handleLogOut" class="btn btn-outline-danger btn-block"> Logout </a>
                </div>
            </div>
        </div>

    </div>

</template>


<script setup lang="ts">

import Swal from 'sweetalert2';
import { logout } from '~/utils/helpers';

const authUser = ref()
const router = useRouter()
const config = useRuntimeConfig()
const API_URL = config.public.apiUrl

const { isInactive } = useUserInactivity(USER_INACTIVITY_MAX_MINS)

onMounted(async() => {
    const _authUser = await getAuthUserAsync()

    if(!isAdmin(_authUser)) {
        await updateUserInLocalStorage(_authUser)
    }

    authUser.value = await getAuthUserAsync()


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

function canViewDataManagement(authUser: AuthUser) {

    if (isAdmin(authUser)) return true

    if (!authUser.user.permissions) return false

    const systemPermissions = authUser.user.permissions.system


    return (
        (!!systemPermissions.canManageAccount && systemPermissions.canManageAccount.read) ||
        (!!systemPermissions.canManageEmployee && systemPermissions.canManageEmployee.read) ||
        (!!systemPermissions.canManageDepartment && systemPermissions.canManageDepartment.read) ||
        (!!systemPermissions.canManageDivision && systemPermissions.canManageDivision.read) ||
        (!!systemPermissions.canManageClassification && systemPermissions.canManageClassification.read)
    )
}

// check first if has module
// check if user can read the specified module

function canView(module: string, authUser: AuthUser) {

    if (isAdmin(authUser)) return true

    if (!authUser.user.permissions) return false

    // @ts-ignore
    if (!authUser.user.permissions.system[module]) return false

    // @ts-ignore
    if (authUser.user.permissions.system[module].read) return true

    return false
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

</style>