// composables/useNotification.ts

import { type AppNotification } from "~/composables/common.types";

export const useNotification = () => {
    const config = useRuntimeConfig();
    const notifications = ref<AppNotification[]>([]);
    const error = ref<Error | null>(null);
    const eventSource = ref<EventSource | null>(null);
    const isConnected = ref(false);

    const connect = (username: string) => {
        console.log('connect', username);
        try {
            // Close existing connection if any
            if (eventSource.value) {
                eventSource.value.close();
            }

            // Create new SSE connection
            eventSource.value = new EventSource(`${config.public.powerserveApiUrl}/notifications/sse/${encodeURIComponent(username)}`);

            eventSource.value.onopen = () => {
                isConnected.value = true;
                console.log('Notification connection established');
            };

            eventSource.value.onmessage = (event) => {
                const eventData = JSON.parse(event.data);
                console.log('eventData', eventData);
                notifications.value.unshift(eventData.data);
            };

            eventSource.value.onerror = (err) => {
                error.value = new Error('Notification connection error');
                isConnected.value = false;
                console.error('Notification error:', err);
            };

        } catch (err) {
            error.value = err as Error;
            console.error('Failed to connect:', err);
        }
    };

    const disconnect = () => {
        if (eventSource.value) {
            eventSource.value.close();
            eventSource.value = null;
            isConnected.value = false;
        }
    };

    // Auto-disconnect when component unmounts
    onUnmounted(() => {
        disconnect();
    });

    return {
        notifications,
        error,
        isConnected,
        connect,
        disconnect
    };
};