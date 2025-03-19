<template>
    <div v-if="!isLoadingPage && authUser && areas.length > 0" class="container pt-4">
        <div class="row g-5">
            <div v-for="area in areas" class="col-lg-6 mt-5">
                <PowerserveArea :area="area"/>
            </div>
        </div>
    </div>
    <div v-else>
        <LoaderSpinner />
    </div>
</template>


<script setup lang="ts">
    import type { Area } from '~/composables/powerserve/area/area.types'
    import * as areaApi from '~/composables/powerserve/area/area.api'

    definePageMeta({
        name: ROUTES.AREA_INDEX,
        layout: "layout-powerserve",
        middleware: ['auth']
    })

    const isLoadingPage = ref(true)
    const authUser = ref<AuthUser>({} as AuthUser)

    const areas = ref<Area[]>([])

    onMounted(async () => {

        authUser.value = getAuthUser()
        isLoadingPage.value = false

        areas.value = await areaApi.findAll()

    })

</script>




<style scoped>

    .container {
        max-width: 1600px; 
        margin: 0 auto; 
    }

</style>