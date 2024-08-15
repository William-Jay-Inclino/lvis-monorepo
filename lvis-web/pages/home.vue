<template>

<div v-if="authUser" class="container" style="padding-top: 50px;">
    <div class="row justify-content-center align-items-center">

        <div class="col-12 col-sm-6 col-md-4 pb-5">
            <div class="card shadow mx-auto" style="max-width: 13rem;">
                <img src="~/assets/img/powerserve2.png" class="card-img-top img-fluid" alt="Powerserve Image" style="height: 180px; object-fit: cover;">
                <div class="card-footer text-center">
                    <button class="btn btn-primary"> POWERSERVE </button>
                </div>
            </div>
        </div>

        <div class="col-12 col-sm-6 col-md-4 pb-5">
            <div class="card shadow mx-auto" style="max-width: 13rem;">
                <img src="~/assets/img/settings.png" class="card-img-top img-fluid" alt="Settings Image" style="height: 180px; object-fit: cover;">
                <div class="card-footer text-center">
                    <button @click="goToSystem" class="btn btn-primary"> SYSTEM </button>
                </div>
            </div>
        </div>

        <div class="col-12 col-sm-6 col-md-4 pb-5">
            <div class="card shadow mx-auto" style="max-width: 13rem;">
                <img src="~/assets/img/eforms.png" class="card-img-top img-fluid" alt="e-Forms Image" style="height: 180px; object-fit: cover;">
                <div class="card-footer text-center">
                    <button class="btn btn-primary"> e-FORMS </button>
                </div>
            </div>
        </div>

        <div class="col-12 col-sm-6 col-md-4 pb-5">
            <div class="card shadow mx-auto" style="max-width: 13rem;">
                <img src="~/assets/img/econnect.png" class="card-img-top img-fluid" alt="e-Connect Image" style="height: 180px; object-fit: cover;">
                <div class="card-footer text-center">
                    <button class="btn btn-primary"> e-CONNECT </button>
                </div>
            </div>
        </div>

        <div class="col-12 col-sm-6 col-md-4 pb-5">
            <div class="card shadow mx-auto" style="max-width: 13rem;">
                <img src="~/assets/img/powerbill.png" class="card-img-top img-fluid" alt="Powerbill Image" style="height: 180px; object-fit: cover;">
                <div class="card-footer text-center">
                    <button class="btn btn-primary"> POWERBILL </button>
                </div>
            </div>
        </div>

        <div class="col-12 col-sm-6 col-md-4 pb-5">
            <div class="card shadow mx-auto" style="max-width: 13rem;">
                <img src="~/assets/img/lps.png" class="card-img-top img-fluid" alt="LPS Image" style="height: 180px; object-fit: cover;">
                <div class="card-footer text-center">
                    <button class="btn btn-primary"> LPS </button>
                </div>
            </div>
        </div>

        <div class="col-12 col-sm-6 col-md-4 pb-5">
            <div class="card shadow mx-auto" style="max-width: 13rem;">
                <img src="~/assets/img/warehouse.png" class="card-img-top img-fluid" alt="Warehouse Image" style="height: 180px; object-fit: cover;">
                <div class="card-footer text-center">
                    <button @click="goToWarehouse" class="btn btn-primary"> WAREHOUSE </button>
                </div>
            </div>
        </div>

        <div class="col-12 col-sm-6 col-md-4 pb-5">
            <div class="card shadow mx-auto" style="max-width: 13rem;">
                <img src="~/assets/img/accounting2.png" class="card-img-top img-fluid" alt="Accounting Image" style="height: 180px; object-fit: cover;">
                <div class="card-footer text-center">
                    <button class="btn btn-primary"> ACCOUNTING </button>
                </div>
            </div>
        </div>

        <div class="col-12 col-sm-6 col-md-4 pb-5">
            <div class="card shadow mx-auto" style="max-width: 13rem;">
                <img src="~/assets/img/powerpay.png" class="card-img-top img-fluid" alt="Powerpay Image" style="height: 180px; object-fit: cover;">
                <div class="card-footer text-center">
                    <button class="btn btn-primary"> POWERPAY </button>
                </div>
            </div>
        </div>

    </div>
</div>




        
    <div v-else>
        <LoaderSpinner />
    </div>

</template>

<script setup lang="ts">

definePageMeta({
    layout: "layout-home"
})

const authUser = ref<AuthUser>()
const router = useRouter()

onMounted(() => {
    authUser.value = getAuthUser()
})


const canViewSystem = computed(() => {

    if (!authUser.value) return false

    if (isAdmin(authUser.value)) return true

    if (!authUser.value.user.permissions) return false

    return !!authUser.value.user.permissions.canViewSystem

})


const canViewWarehouse = computed(() => {

    if (!authUser.value) return false

    if (isAdmin(authUser.value)) return true

    if (!authUser.value.user.permissions) return false

    return !!authUser.value.user.permissions.canViewWarehouse

})


const goToSystem = () => {
    if(!canViewSystem.value) return 

    router.push('/system')
}


const goToWarehouse =  () => {
    if(!canViewWarehouse.value) return 

    router.push('/warehouse')
}



</script>



<style scoped>

.card {
    border: none;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
    /* cursor: pointer; */
}

.card:hover {
    transform: translateY(-20px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

button {
    width: 150px;
}
</style>