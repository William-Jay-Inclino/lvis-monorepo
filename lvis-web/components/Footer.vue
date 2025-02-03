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
					{{ isMobile ? 'W.J.I' : 'William Jay Inclino' }}
					<client-only>
						<font-awesome-icon :icon="['fas', 'bolt']" class="text-warning"/>
					</client-only>
				</a>
			</p>
		</div>
    </footer>
</template>

<script setup>

	const config = useRuntimeConfig()
	const APP_VERSION = config.public.appVersion

	const screenWidth = ref(0);

	const isMobile = computed(() => screenWidth.value <= MOBILE_WIDTH);


	onMounted(() => {
		screenWidth.value = window.innerWidth;

		window.addEventListener('resize', () => {
			screenWidth.value = window.innerWidth;
		});

	})



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