<template>

    <div v-if="authUser" class="container" style="padding-top: 50px;">
        <div class="row justify-content-center align-items-center">

            <div class="col-12 col-sm-6 col-md-4 pb-5">
                <div class="card shadow mx-auto" style="max-width: 13rem;">
                    <img src="/img/settings.png" class="card-img-top img-fluid" alt="Settings Image" style="height: 180px; object-fit: cover;">
                    <div class="card-footer text-center">
                        <button data-test-id="system" @click="goToSystem" class="btn" :class="{'btn-primary': canViewSystem, 'btn-secondary': !canViewSystem}" :disabled="!canViewSystem"> SYSTEM {{ !canViewSystem ? '(Restricted)' : ''  }} </button>
                    </div>
                </div>
            </div>

            <div class="col-12 col-sm-6 col-md-4 pb-5">
                <div class="card shadow mx-auto" style="max-width: 13rem;">
                    <img src="/img/purchasing.png" class="card-img-top img-fluid" alt="Warehouse Image" style="height: 180px; object-fit: cover;">
                    <div class="card-footer text-center">
                        <button data-test-id="purchasing" @click="goToPurchasing" class="btn" :class="{'btn-primary': canViewPurchasing, 'btn-secondary': !canViewPurchasing}" :disabled="!canViewPurchasing"> PURCHASING {{ !canViewPurchasing ? '(Restricted)' : ''  }}</button>
                    </div>
                </div>
            </div>

            <div class="col-12 col-sm-6 col-md-4 pb-5">
                <div class="card shadow mx-auto" style="max-width: 13rem;">
                    <img src="/img/warehouse.png" class="card-img-top img-fluid" alt="Warehouse Image" style="height: 180px; object-fit: cover;">
                    <div class="card-footer text-center">
                        <button data-test-id="warehouse" @click="goToWarehouse" class="btn" :class="{'btn-primary': canViewWarehouse, 'btn-secondary': !canViewWarehouse}" :disabled="!canViewWarehouse"> WAREHOUSE {{ !canViewWarehouse ? '(Restricted)' : ''  }}</button>
                    </div>
                </div>
            </div>

            <div class="col-12 col-sm-6 col-md-4 pb-5">
                <div class="card shadow mx-auto" style="max-width: 13rem;">
                    <img src="/img/motorpool.png" class="card-img-top img-fluid" alt="Warehouse Image" style="height: 180px; object-fit: cover;">
                    <div class="card-footer text-center">
                        <button data-test-id="motorpool" @click="goToMotorpool" class="btn" :class="{'btn-primary': canViewMotorpool, 'btn-secondary': !canViewMotorpool}" :disabled="!canViewMotorpool"> MOTORPOOL {{ !canViewMotorpool ? '(Restricted)' : ''  }}</button>
                    </div>
                </div>
            </div>

            <div class="col-12 col-sm-6 col-md-4 pb-5">
                <div class="card shadow mx-auto" style="max-width: 13rem;">
                    <img src="/img/accounting2.png" class="card-img-top img-fluid" alt="Warehouse Image" style="height: 180px; object-fit: cover;">
                    <div class="card-footer text-center">
                        <button data-test-id="accounting" @click="goToAccounting" class="btn" :class="{'btn-primary': canViewAccounting, 'btn-secondary': !canViewAccounting}" :disabled="!canViewAccounting"> ACCOUNTING {{ !canViewAccounting ? '(Restricted)' : ''  }}</button>
                    </div>
                </div>
            </div>

            <div class="col-12 col-sm-6 col-md-4 pb-5">
                <div class="card shadow mx-auto" style="max-width: 13rem;">
                    <img src="/img/HR.png" class="card-img-top img-fluid" alt="Warehouse Image" style="height: 180px; object-fit: cover;">
                    <div class="card-footer text-center">
                        <button data-test-id="hr" @click="goToHR" class="btn" :class="{'btn-primary': canViewHR, 'btn-secondary': !canViewHR}" :disabled="!canViewHR"> HR {{ !canViewHR ? '(Restricted)' : ''  }}</button>
                    </div>
                </div>
            </div>

            <div v-for="(card, index) in comingSoonCards" :key="index" class="col-12 col-sm-6 col-md-4 pb-5">
                <div class="card shadow mx-auto" style="max-width: 13rem; background-color: #f0f0f0;">
                    <img
                        :src="card.image"
                        class="card-img-top img-fluid"
                        alt="Coming Soon Image"
                        style="height: 180px; object-fit: cover; opacity: 0.5;"
                    />
                    <div class="card-footer text-center">
                        <button class="btn btn-secondary" disabled>{{ card.name }} <br> <small>(Coming Soon)</small></button>
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

    return false

})

const canViewAccounting = computed(() => {

    if (!authUser.value) return false

    if (isAdmin(authUser.value)) return true

    if (!authUser.value.user.permissions) return false

    const systemPermission = authUser.value.user.permissions.system

    const canReadAccount = systemPermission.canManageAccount && systemPermission.canManageAccount.read === true
    const canReadClassification = systemPermission.canManageClassification && systemPermission.canManageClassification.read === true 

    if(canReadAccount || canReadClassification) {
        return true 
    }

    return false 

})

const canViewHR = computed(() => {

    if (!authUser.value) return false

    if (isAdmin(authUser.value)) return true

    if (!authUser.value.user.permissions) return false

    const systemPermission = authUser.value.user.permissions.system

    const canReadEmployee = systemPermission.canManageEmployee && systemPermission.canManageEmployee.read === true
    const canReadDepartment = systemPermission.canManageDepartment && systemPermission.canManageDepartment.read === true 
    const canReadDivision = systemPermission.canManageDivision && systemPermission.canManageDivision.read === true 

    if(canReadEmployee || canReadDepartment || canReadDivision) {
        return true 
    }

    return false 

})

const canViewPurchasing = computed(() => {

    if (!authUser.value) return false

    if (isAdmin(authUser.value)) return true

    if (!authUser.value.user.permissions) return false

    const warehousePermission = authUser.value.user.permissions.warehouse

    const canReadCanvass = warehousePermission.canManageCanvass && warehousePermission.canManageCanvass.search === true
    const canReadRV = warehousePermission.canManageRV && warehousePermission.canManageRV.search === true
    const canReadSPR = warehousePermission.canManageSPR && warehousePermission.canManageSPR.search === true
    const canReadJO = warehousePermission.canManageJO && warehousePermission.canManageJO.search === true
    const canReadMEQS = warehousePermission.canManageMEQS && warehousePermission.canManageMEQS.search === true
    const canReadPO = warehousePermission.canManagePO && warehousePermission.canManagePO.search === true

    if(
        canReadCanvass || canReadRV || canReadSPR || canReadJO || canReadMEQS || canReadPO
    ) {
        return true
    }


    return false 

})

const canViewWarehouse = computed(() => {

    if (!authUser.value) return false

    if (isAdmin(authUser.value)) return true

    if (!authUser.value.user.permissions) return false

    const warehousePermission = authUser.value.user.permissions.warehouse

    const canReadRR = warehousePermission.canManageRR && warehousePermission.canManageRR.search === true
    const canReadOSRIV = warehousePermission.canManageOSRIV && warehousePermission.canManageOSRIV.search === true
    const canReadSERIV = warehousePermission.canManageSERIV && warehousePermission.canManageSERIV.search === true
    const canReadMRV = warehousePermission.canManageMRV && warehousePermission.canManageMRV.search === true
    const canReadMCT = warehousePermission.canManageMCT && warehousePermission.canManageMCT.search === true
    const canReadMCRT = warehousePermission.canManageMCRT && warehousePermission.canManageMCRT.search === true
    const canReadMST = warehousePermission.canManageMST && warehousePermission.canManageMST.search === true
    const canReadItem = warehousePermission.canManageItem && warehousePermission.canManageItem.search === true
    const canReadSupplier = warehousePermission.canManageSupplier && warehousePermission.canManageSupplier.read === true
    const canReadProject = warehousePermission.canManageProject && warehousePermission.canManageProject.read === true
    const canReadUnit = warehousePermission.canManageUnit && warehousePermission.canManageUnit.read === true

    if(
        canReadRR || canReadOSRIV || canReadSERIV || canReadMRV || canReadMCT || canReadMCRT || 
        canReadMST || canReadItem || canReadSupplier || canReadProject || canReadUnit 
    ) {
        return true
    }


    return false 

})

const canViewMotorpool = computed(() => {

    if (!authUser.value) return false

    if (isAdmin(authUser.value)) return true

    if (!authUser.value.user.permissions) return false

    const warehousePermission = authUser.value.user.permissions.warehouse

    const canReadVehicle = warehousePermission.canManageVehicle && warehousePermission.canManageVehicle.read === true
    const canReadGasSlip = warehousePermission.canManageGasSlip && warehousePermission.canManageGasSlip.search === true
    const canReadTripTicket = warehousePermission.canManageTripTicket && warehousePermission.canManageTripTicket.search === true
    const canViewTripSchedulesInDashboard = warehousePermission.canManageMotorpoolDashboard && warehousePermission.canManageMotorpoolDashboard.viewTrips === true
    const canViewPmsSchedulesInDashboard = warehousePermission.canManageMotorpoolDashboard && warehousePermission.canManageMotorpoolDashboard.viewPMS === true

    if(canReadVehicle || canReadGasSlip || canReadTripTicket || canViewTripSchedulesInDashboard || canViewPmsSchedulesInDashboard) {
        return true
    }

    return false 

})

const comingSoonCards = [
  { name: "POWERSERVE", image: "/img/powerserve2.png" },
//   { name: "e-CONNECT", image: "/img/econnect.png" },
//   { name: "POWERBILL", image: "/img/powerbill.png" },
//   { name: "LPS", image: "/img/lps.png" },
  { name: "HOUSEWIRING", image: "/img/housewiring2.png" },
//   { name: "ACCOUNTING", image: "/img/accounting2.png" },
  { name: "BILLING", image: "/img/powerpay.png" }
];


const goToSystem = () => {
    if(!canViewSystem.value) return 

    router.push('/system')
}

const goToPurchasing =  () => {
    if(!canViewPurchasing.value) return 

    router.push('/purchase')
}

const goToWarehouse =  () => {
    if(!canViewWarehouse.value) return 

    router.push('/warehouse')
}

const goToMotorpool =  () => {
    if(!canViewMotorpool.value) return 

    router.push('/motorpool')
}

const goToAccounting =  () => {
    if(!canViewAccounting.value) return 

    router.push('/accounting')
}

const goToHR =  () => {
    if(!canViewHR.value) return 

    router.push('/hr')
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