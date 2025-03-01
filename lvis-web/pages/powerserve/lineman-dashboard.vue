<template>
    
    <div v-if="authUser" class="mt-5">

        <div class="row justify-content-center">
            <div class="col-10">
                <PowerserveTasksList />
            </div>
        </div>

    </div>


</template>



<script setup lang="ts">


    definePageMeta({
        name: ROUTES.LINEMAN_DASHBOARD,
        layout: "layout-powerserve",
        middleware: ['auth']
    })


    const authUser = ref<AuthUser>()

    onMounted(() => {
        authUser.value = getAuthUser()
    })


</script>


<style scoped>

</style>
