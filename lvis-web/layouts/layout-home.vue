<template>
    <div id="wrapper">
        <div :class="{'bg-container': !isMobile}">

            <nav v-if="authUser" class="container navbar sticky-top navbar-expand-lg navbar-dark rounded-3 my-4 px-4 floating-navbar">
                <div class="container">
                    <a class="navbar-brand text-dark" href="#">
                        <img style="max-height: 40px;" src="~/assets/img/leyeco-logo2.png" alt="Leyeco V - SYSTEM Logo" class="img-fluid">
                        <!-- Welcome, {{ authUser.user.username }}! -->
                        <!-- <i class="fas fa-smile"></i> -->
                        <span :class="{'d-none': isMobile}">
                            Welcome to LVUMS, <span class="fw-bold">{{ formatUsername(authUser.user.username) }}</span>
                        </span>
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
                                <a class="nav-link dropdown-toggle text-dark" href="#" id="navbarDropdown"
                                    role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="fas fa-user"></i>
                                    <span class="fw-bold fst-italic ms-1">
    
                                        <!-- {{ authUser.user.username }} -->
    
                                    </span>
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><a class="dropdown-item" href="#"><i class="fa fa-user"></i> Profile</a></li>
                                    <li><a class="dropdown-item" href="#"><i class="fa fa-gear"></i> Settings</a></li>
                                    <li><a class="dropdown-item" href="#"><i class="fa fa-clipboard"></i> Activity log</a></li>
                                    <li><nuxt-link @click="logout" class="dropdown-item" to="/"> <i class="fa fa-arrow-left"></i> Logout</nuxt-link></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
    
            <div class="container px-0 main-content">
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
                                <!-- {{ authUser.user.username }} -->
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

const authUser = ref<AuthUser >()

const isMobile = ref(false)

onMounted(async() => {
    const _authUser = await getAuthUserAsync()

    if(!isAdmin(_authUser)) {
        await updateTotalPendingsInLocalStorage(_authUser)
    }

    authUser.value = await getAuthUserAsync()

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

const formatUsername = (username: string) => {
  // Remove string after the period and capitalize the first letter
  const cleanUsername = username.split('.')[0]; // Remove the period and everything after
  return cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1).toLowerCase();
}

</script>


<style scoped>
.bg-container {
  /* background-image: url('~/assets/img/homebg2.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  width: 100%; */

  background: rgb(142,207,255);
  background: linear-gradient(141deg, rgba(142,207,255,1) 0%, rgba(255,255,255,1) 100%);
}

.floating-navbar {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Adds a shadow to make it float */
  border: 1px solid rgba(0, 0, 0, 0.1); /* Optional border for the floating effect */
  background-color: #ecff70;
}
</style>