<template>
    
    <div v-if="authUser" class="card">
        
        <div class="card-body">

            <div class="container">
    
                <h1 class="text-warning mt-5"> WELCOME TO WAREHOUSE MANAGEMENT</h1>
    
                <div class="row text-muted mb-5 mt-4">
                    <div class="col-lg-6 col-md-6 col-12">
                        "Welcome to our Warehouse Management! Your hub for seamless purchasing, efficient warehousing, reliable motorpool management, and precise stock inventory control. Let's optimize your operations together!" 
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
    layout: "layout-warehouse"
})


const authUser = ref<AuthUser>()

onMounted(() => {
    authUser.value = getAuthUser()
})



</script>



<style scoped>

/* .background-container {
    height: 100vh;
    overflow: auto;
    padding-top: 40px;
}

.background-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('~/assets/img/warehousebg.png');
    background-size: cover;
    background-position: center;
    z-index: -1;
} */

</style>