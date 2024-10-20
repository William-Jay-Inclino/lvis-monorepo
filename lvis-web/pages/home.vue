<template>

<div v-if="authUser">
    <div class="row">
        <div class="col">
            <div class="card custom-cards">
                <div class="card-body p-0">
                    <div class="row m-0" >

                        <div class="col-lg-4 p-4">
                            <div class="card custom-cards-navigation">
                                <div class="card-body p-0">
                                    <img src="~/assets/img/powerserve.png" class="img-fluid p-3" alt="Settings Image">
                                </div>
                                <div class="card-footer navigation-warning text-center">
                                    <button class="btn btn-sm fw-bold"> POWERSERVE </button>
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-4 p-4">
                            <div class="card custom-cards-navigation">
                                <div class="card-body p-0">
                                    <img src="~/assets/img/settings.png" class="img-fluid p-3" alt="Settings Image">
                                </div>
                                <div class="card-footer navigation-warning text-center">
                                    <button @click="goToSystem" class="btn btn-sm fw-bold"> SYSTEM </button>
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-4 p-4">
                            <div class="card custom-cards-navigation">
                                <div class="card-body p-0">
                                    <img src="~/assets/img/eforms.png" class="img-fluid p-3" alt="Settings Image">
                                </div>
                                <div class="card-footer navigation-warning text-center">
                                    <button class="btn btn-sm fw-bold"> e-FORMS </button>
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-4 p-4">
                            <div class="card custom-cards-navigation">
                                <div class="card-body p-0">
                                    <img src="~/assets/img/econnect.png" class="img-fluid p-3" alt="Settings Image">
                                </div>
                                <div class="card-footer navigation-warning text-center">
                                    <button class="btn btn-sm fw-bold"> e-CONNECT </button>
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-4 p-4">
                            <div class="card custom-cards-navigation">
                                <div class="card-body p-0">
                                    <img src="~/assets/img/powerbill.png" class="img-fluid p-3" alt="Settings Image">
                                </div>
                                <div class="card-footer navigation-warning text-center">
                                    <button class="btn btn-sm fw-bold"> BILLING </button>
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-4 p-4">
                            <div class="card custom-cards-navigation">
                                <div class="card-body p-0">
                                    <img src="~/assets/img/lps.png" class="img-fluid p-3" alt="Settings Image">
                                </div>
                                <div class="card-footer navigation-warning text-center">
                                    <button class="btn btn-sm fw-bold"> LPS </button>
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-4 p-4">
                            <div class="card custom-cards-navigation">
                                <div class="card-body p-0">
                                    <img src="~/assets/img/powerhouse.png" class="img-fluid p-3" alt="Settings Image">
                                </div>
                                <div class="card-footer navigation-warning text-center">
                                    <button class="btn btn-sm fw-bold" @click="goToWarehouse"> WAREHOUSE </button>
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-4 p-4">
                            <div class="card custom-cards-navigation">
                                <div class="card-body p-0">
                                    <img src="~/assets/img/accounting.png" class="img-fluid p-3" alt="Settings Image">
                                </div>
                                <div class="card-footer navigation-warning text-center">
                                    <button class="btn btn-sm fw-bold"> ACCOUNTING </button>
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-4 p-4">
                            <div class="card custom-cards-navigation">
                                <div class="card-body p-0">
                                    <img src="~/assets/img/powerpay.png" class="img-fluid p-3" alt="Settings Image">
                                </div>
                                <div class="card-footer navigation-warning text-center">
                                    <button class="btn btn-sm fw-bold"> POWERPAY </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="row">
                <div class="col-lg-12 pb-4">
                    <div class="card custom-cards">
                        <div class="card-body">
                            <div class="row" >
                                <div class="col-lg-12 p-0">
                                    <img src="~/assets/img/rate-chart.png" class="img-fluid" alt="Settings Image">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer fw-bold">
                            POWER RATE
                        </div>
                    </div>
                </div>

                <div class="col-lg-6 pb-4">
                    <div class="card custom-cards">
                        <div class="card-body">
                            <div class="row" >
                                <div class="col-lg-4"><i class="fa fa-phone-volume fa-3x"></i></div>
                                <div class="col-lg-8 text-center fs-2 fw-bold">61</div>
                            </div>
                        </div>
                        <div class="card-footer">
                            <div class="row" >
                                <div class="col-lg-10 fw-bold">COMPLAINTS</div>
                                <div class="col-lg-2"><i class="fa fa-eye"></i></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-6 pb-4">
                    <div class="card custom-cards">
                        <div class="card-body">
                            <div class="row" >
                                <div class="col-lg-4"><i class="fa fa-users fa-3x"></i></div>
                                <div class="col-lg-8 text-center fs-2 fw-bold">182</div>
                            </div>
                        </div>
                        <div class="card-footer">
                            <div class="row" >
                                <div class="col-lg-10 fw-bold">EMPLOYEES</div>
                                <div class="col-lg-2"><i class="fa fa-eye"></i></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- <div class="col-lg-6 pb-4">
                    <div class="card custom-cards">
                        <div class="card-body">
                            <div class="row" >
                                <div class="col-lg-4"><i class="fa fa-credit-card fa-3x"></i></div>
                                <div class="col-lg-8 text-center fs-4 fw-bold">1,052,242.82</div>
                            </div>
                        </div>
                        <div class="card-footer">
                            <div class="row" >
                                <div class="col-lg-10 fw-bold">COLLECTION</div>
                                <div class="col-lg-2"><i class="fa fa-eye"></i></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-6 pb-4">
                    <div class="card custom-cards">
                        <div class="card-body">
                            <div class="row" >
                                <div class="col-lg-4"><i class="fa fa-users fa-3x"></i></div>
                                <div class="col-lg-8 text-center fs-2 fw-bold">182</div>
                            </div>
                        </div>
                        <div class="card-footer">
                            <div class="row" >
                                <div class="col-lg-10 fw-bold">EMPLOYEES</div>
                                <div class="col-lg-2"><i class="fa fa-eye"></i></div>
                            </div>
                        </div>
                    </div>
                </div> -->
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

.custom-cards {
    background-color: rgba(255, 255, 255, 0.6); /* White background with 20% opacity */
    backdrop-filter: blur(10px); /* Apply a blur effect */
    -webkit-backdrop-filter: blur(10px); /* For Safari */
    border-radius: 10px; /* Optional: for rounded corners */
    padding: 20px; /* Optional: for spacing inside the element */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Optional: for a slight shadow */
    /* background: rgb(142,207,255); */
  /* background: linear-gradient(141deg, rgba(142,207,255,1) 0%, rgba(255,255,255,1) 100%); */
}

.custom-cards-navigation {
    background: rgb(142,207,255);
    background: linear-gradient(141deg, rgba(142,207,255,1) 0%, rgba(255,255,255,1) 100%);
}

.navigation-warning{
background-color: #ecff70;
}


/* .card:hover {
    transform: translateY(-20px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
} */

/* button {
    width: 150px;
} */
</style>