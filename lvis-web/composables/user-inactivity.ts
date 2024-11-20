import { ref, onMounted, onUnmounted } from 'vue';

export function useUserInactivity(timeoutMinutes: number) {

  const isInactive = ref(false);
  let timeout: ReturnType<typeof setTimeout>;

  const resetTimer = () => {
    clearTimeout(timeout);
    isInactive.value = false;
    timeout = setTimeout(() => {
      isInactive.value = true; // User is inactive
    }, timeoutMinutes * 60 * 1000); // Convert minutes to milliseconds
  };

  const handleUserActivity = () => {
    resetTimer();
  };

  onMounted(() => {
    resetTimer(); // Start timer when component mounts
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
  });

  onUnmounted(() => {
    clearTimeout(timeout); // Clean up timer
    window.removeEventListener('mousemove', handleUserActivity);
    window.removeEventListener('keydown', handleUserActivity);
    window.removeEventListener('scroll', handleUserActivity);
    window.removeEventListener('click', handleUserActivity);
  });

  return { isInactive };
}
