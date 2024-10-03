<template>
    <div id="wrapper">
        <div :class="{'bg-container': !isMobile}">

            <nav v-if="authUser" class="navbar sticky-top navbar-expand-lg navbar-dark" style="background-color: #1877F2;">
                <div class="container">
                    <a class="navbar-brand" href="#">
                        <img style="max-height: 60px;" src="~/assets/img/leyeco-logo2.png" alt="Leyeco V - SYSTEM Logo" class="img-fluid">
                        Welcome, {{ authUser.user.username }}! <span v-if="!isMobile"> Have a productive day </span> 
                        <i class="fas fa-smile"></i>
                    </a>
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
                            <li v-if="isApprover(authUser)" class="nav-item">
                                <nuxt-link class="nav-link me-3 text-white position-relative" to="/e-forms/pendings">
                                    <i class="fas fa-bell"></i>
                                    <span
                                        class="position-absolute top-1 start-100 translate-middle badge rounded-pill bg-danger">
                                        {{ totalPendings }}
                                    </span>
                                </nuxt-link>
                            </li>
                            <li class="nav-item dropdown">
                                <a style="color: #FFFF00;" class="nav-link dropdown-toggle" href="#" id="navbarDropdown"
                                    role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="fas fa-user-circle"></i>
                                    <span class="fw-bold fst-italic ms-1">
    
                                        {{ authUser.user.username }}
    
                                    </span>
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><a class="dropdown-item" href="#">Profile</a></li>
                                    <li><a class="dropdown-item" href="#">Settings</a></li>
                                    <li><a class="dropdown-item" href="#">Activity log</a></li>
                                    <li><nuxt-link @click="logout" class="dropdown-item" to="/">Logout</nuxt-link></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
    
            <div class="container main-content">
                <!-- <slot /> -->
                <NuxtPage />
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
                    </ul>
                    <div class="mt-auto d-grid">
                        <nuxt-link @click="logout" class="btn btn-outline-danger btn-block" to="/">Logout</nuxt-link>
                    </div>
                </div>
            </div>

            
        </div>
    </div>
</template>



<script setup lang="ts">

import { logout } from '~/utils/helpers';

const authUser = ref<AuthUser>()

const isMobile = ref(false)

onMounted(() => {
    authUser.value = getAuthUser()

    isMobile.value = window.innerWidth < MOBILE_WIDTH

    window.addEventListener('resize', checkMobile);
})

const totalPendings = computed(() => {
    if (!authUser.value) return
    if (authUser.value.user.user_employee?.employee.total_pending_approvals) {
        return authUser.value.user.user_employee?.employee.total_pending_approvals
    }
    return 0
})

const isApprover = (authUser: AuthUser) => {

    const total_pendings = authUser.user.user_employee?.employee.total_pending_approvals
    if (total_pendings && total_pendings > 0) {
        return true
    }

}



function checkMobile() {
    isMobile.value = window.innerWidth < MOBILE_WIDTH
}

</script>


<style scoped>
.bg-container {
  background-image: url('~/assets/img/homebg2.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  width: 100%;
}
</style>