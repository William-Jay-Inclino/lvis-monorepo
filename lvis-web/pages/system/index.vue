<template>
    
    <div v-if="authUser" class="card">
        
        <div class="card-body">

            <div class="container">
    
                <h1 class="mt-5 text-warning"> WELCOME TO SYSTEM MANAGEMENT</h1>
    
                <div class="row mb-5 mt-4">
                    <div class="col-lg-6 col-md-6 col-12 text-muted">
                        "Welcome to our System Management! Here, you can fine-tune your settings, define system variables, manage user permissions, and oversee data management. Empower your system's capabilities and tailor it to your unique needs."
                        <br />
                        <br />
                        - Admin
                    </div>
                </div>
    
            </div>
            
        </div>


    </div>


</template>



<script setup lang="ts">

definePageMeta({
    layout: "layout-system"
})


const authUser = ref<AuthUser>()

onMounted(() => {
    authUser.value = getAuthUser()
})



</script>



<style scoped>

.background-container {
    /* display: grid;
    place-items: center; */
    height: 100vh;
    overflow: auto;
    padding-top: 40px;
}

/* .background-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('~/assets/img/systembg.png');
    background-size: cover;
    background-position: center;
    z-index: -1;
} */

</style>