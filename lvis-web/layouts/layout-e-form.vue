<template>

    <div id="wrapper">
        <nav class="navbar sticky-top navbar-expand-lg navbar-dark" style="background-color: #1877F2;">
            <div class="container">
                <nuxt-link class="navbar-brand" to="/home">
                    <img style="max-height: 60px;" src="~/assets/img/leyeco-logo2.png" alt="Leyeco V - SYSTEM Logo" class="img-fluid">
                    Leyeco V - Notifications
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
                        <!-- <li class="nav-item">
                            <nuxt-link class="nav-link text-white" to="/e-forms/pendings">Pending Forms</nuxt-link>
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

            <div class="mt-3">
                <!-- <slot /> -->
                <NuxtPage />
            </div>

        </div>

        <br />
        <br />
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
                </ul>
                <div class="mt-auto d-grid">
                    <nuxt-link @click="logout" class="btn btn-outline-danger btn-block" to="/">Logout</nuxt-link>
                </div>
            </div>
        </div>
    </div>




</template>


<script setup lang="ts">

import { logout } from '~/utils/helpers';

const authUser = ref()

onMounted(() => {
    authUser.value = getAuthUser()
})


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