<template>
	<footer class="bg-white footer mt-auto pt-3 d-flex justify-content-center align-items-center">
		<div class="text-center text-muted" :style="{fontFamily: 'monospace', color: '#ffd700', fontSize: isMobile ? '11px' : '12px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}">
			<p>
				{{ APP_VERSION }}
				| <span class="brand-text" style="font-size: 1rem;">
					PRISM
				</span>
				Developed by 
				<a class="developer-link" target="_blank" href="https://www.facebook.com/jewell.inclino">
					W.J.I
				</a>
			</p>
		</div>
    </footer>
</template>

<script setup>

	const config = useRuntimeConfig()
	const APP_VERSION = config.public.appVersion

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
	.footer {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
	}

	.developer-link {
		font-weight: bold;
		background: linear-gradient(90deg, #00c6ff, #0072ff);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		text-decoration: none;
		position: relative;
		transition: all 0.3s ease-in-out;
		font-size: 1rem;
	}

	.developer-link:hover {
		text-decoration: underline;
		text-shadow: 0px 2px 8px rgba(0, 114, 255, 0.7);
		animation: shimmer 1s infinite linear;
	}

	@keyframes shimmer {
		0% {
			background-position: -200px 0;
		}
		100% {
			background-position: 200px 0;
		}
	}
</style>