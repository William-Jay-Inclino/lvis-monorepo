<template>
<footer :class="{'bg-white': !isHomeRoute || isMobile}" class="footer mt-auto pt-3 d-flex justify-content-center align-items-center">
      <div class="text-center text-muted" :style="{fontFamily: 'monospace', color: '#ffd700', fontSize: isMobile ? '11px' : '12px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}">
        <p>
          &copy; 2024 LVUMS 
          <client-only>
            <font-awesome-icon :icon="['fas', 'bolt']" class="text-warning"/>
          </client-only>
          | Developed by <a target="_blank" href="https://www.facebook.com/jewell.inclino">William Jay Inclino</a>
        </p>
      </div>
    </footer>
  </template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

console.log('route.path', route.path);
const isHomeRoute = route.path === '/home'

const isMobile = ref(false)

onMounted(() => {

    isMobile.value = window.innerWidth < MOBILE_WIDTH

    window.addEventListener('resize', checkMobile);
})


function checkMobile() {
    isMobile.value = window.innerWidth < MOBILE_WIDTH
}


</script>


<style scoped>
/* Add any additional styles if needed */
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>