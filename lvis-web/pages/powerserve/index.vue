<template>
    
    <div class="container" v-if="authUser">
        
        <div class="card">
            <div class="card-body">
                <div class="container">
                    <h1 class="text-warning mt-5"> WELCOME TO POWERSERVE</h1>
                    <div class="row text-muted mb-5 mt-4">
                        <div class="col-lg-6 col-md-6 col-12">
                            "Streamline your procurement processes with ease. Manage canvassing, requisitions, purchase orders, and more, all in one centralized system."
                            <br />
                            <br />
                            - Admin
                            <client-only>
                                <font-awesome-icon :icon="['fas', 'smile']" />
                            </client-only>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- New Section for Dashboard Analytics Announcement outside the card -->
        <div class="container">
            <div class="row">
                <div class="col-12 text-center">
                    <div class="faded-text">
                        <h2 style="font-size: 4rem;">More features coming soon...</h2>
                    </div>
                </div>
            </div>
        </div>

    </div>


</template>



<script setup lang="ts">

definePageMeta({
    layout: "layout-powerserve"
})


const authUser = ref<AuthUser>()


onMounted(() => {
    authUser.value = getAuthUser()
})


</script>


<style scoped>
    .faded-text {
        font-weight: bold;
        color: rgba(24, 119, 242, 0.3); /* More faded vibrant blue with reduced opacity */
        animation: fadeIn 2s ease-in-out;
        opacity: 0;
        animation-fill-mode: forwards;
        margin-top: 100px; /* Add some space above the text */
        transform: rotate(-15deg); /* Slant the text */
        text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3); /* Lighter shadow for a more faded look */
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>
