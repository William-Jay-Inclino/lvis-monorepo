// ~/composables/useSSEConnection.ts
export const useSSEConnection = () => {
    const { notifications, connect, disconnect } = useNotifications();
    const authUser = ref();

    onMounted(async () => {
        authUser.value = await getAuthUserAsync();
        if (authUser.value?.user?.username) {
            connect(authUser.value.user.username);
        }
    });

    onBeforeUnmount(() => {
        disconnect();
    });

    return {
        notifications
    };
};