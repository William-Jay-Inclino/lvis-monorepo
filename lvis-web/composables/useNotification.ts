
interface Notification {
    message: string
    timestamp: string
    // Add other fields as needed
}

export const useNotifications = () => {
    const notifications = ref<Notification[]>([])
    let eventSource: EventSource | null = null

    const connect = (userId?: string) => {
        disconnect() // Clean up existing connection
        
        const config = useRuntimeConfig()
        let url = `${config.public.powerserveApiUrl}/notifications/stream`
        
        if (userId) {
            url += `?userId=${encodeURIComponent(userId)}`
        }

        eventSource = new EventSource(url, {
            withCredentials: true
        })

        eventSource.onmessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data) as Notification
            notifications.value.unshift(data)
        }

        eventSource.onerror = () => {
            setTimeout(() => connect(userId), 3000)
        }
    }

    const disconnect = () => {
        if (eventSource) {
            eventSource.close()
            eventSource = null
        }
    }

    onBeforeUnmount(() => {
        disconnect()
    })

    return {
        notifications,
        connect,
        disconnect
    }
}