import { type Notification } from '~/composables/common.types'

export const useNotifications = () => {
    const notifications = ref<Notification[]>([])
    let eventSource: EventSource | null = null
    let reconnectTimeout: NodeJS.Timeout | null = null

    const connect = (username: string) => {
        if (eventSource) {
            return // Already connected
        }

        const config = useRuntimeConfig()
        const url = `${config.public.powerserveApiUrl}/notifications/sse/${username}`

        eventSource = new EventSource(url, {
            withCredentials: true
        })

        eventSource.onmessage = (event: MessageEvent) => {
            try {
                const payload = JSON.parse(event.data)

                switch (payload.type) {
                    case 'INIT':
                        notifications.value = payload.data // replace with initial batch
                        break
                    case 'NEW_NOTIFICATION':
                        notifications.value.unshift(payload.data)
                        break
                    default:
                        console.warn('Unknown SSE event type:', payload)
                }
            } catch (error) {
                console.error('Failed to parse SSE data:', event.data, error)
            }
        }

        eventSource.onerror = () => {
            console.warn('SSE connection error, reconnecting...')
            disconnect()
            reconnectTimeout = setTimeout(() => connect(username), 3000)
        }
    }

    const disconnect = () => {
        if (eventSource) {
            eventSource.close()
            eventSource = null
        }

        if (reconnectTimeout) {
            clearTimeout(reconnectTimeout)
            reconnectTimeout = null
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
