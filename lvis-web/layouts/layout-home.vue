<template>
    <div id="wrapper">

        <TopBar />

        <nav v-if="authUser" class="navbar sticky-top navbar-expand-lg navbar-dark" style="background-color: #1877F2;">
            <div class="container">
                <nuxt-link class="navbar-brand d-flex align-items-center" to="/home">
                    <img style="max-height: 50px;" src="/img/leyeco-logo2.png" alt="Leyeco V - SYSTEM Logo" class="img-fluid me-2">
                    <span class="text-white">Home</span>
                </nuxt-link>


                <!-- Offcanvas Toggler -->
                <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
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
                                    <a @click="logout" class="dropdown-item"> Logout </a>
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
                    <a @click="logout" class="btn btn-outline-danger btn-block"> Logout </a>
                </div>
            </div>
        </div>

        <Assistant />
        <AssistantModal />

    </div>
</template>



<script setup lang="ts">

import { useUserInactivity } from '~/composables/user-inactivity';
import { useLogout } from '~/composables/useLogout';


const authUser = ref<AuthUser >()
const config = useRuntimeConfig()
const API_URL = config.public.apiUrl
const { isInactive } = useUserInactivity(USER_INACTIVITY_MAX_MINS)
const { handleLogOut } = useLogout();


onMounted(async() => {
    authUser.value = await getAuthUserAsync()
})

const logout = async () => {
    await handleLogOut({
        authUser: authUser.value,
        apiUrl: API_URL
    });
};

watch(isInactive, async (val) => {
    if (val) {
        console.log('isInactive', val);

        handleUserInactivity(logout);
    }
});

</script>

