const HyprEventIds = [
    'workspace',
    'focusedmon',
    'activewindow',
    'activewindowv2',
    'fullscreen',
    'monitorremoved',
    'monitoradded',
    'createworkspace',
    'destroyworkspace',
    'moveworkspace',
    'activelayout',
    'openwindow',
    'closewindow',
    'movewindow',
    'openlayer',
    'closelayer',
    'submap',
    'changefloatingmode',
    'urgent',
    'minimize',
    'screencast',
    'windowtitle',
] as const

type HyprEventId = (typeof HyprEventIds)[number]

class HyprEvents {
    private static _webSocket: WebSocket | null = null
    private static _listeners: Map<string, Array<(data: object) => any>> =
        new Map()

    static addEventListener(
        eventId: HyprEventId,
        listener: (data: object) => any
    ) {
        const eventListeners = HyprEvents._listeners.get(eventId)

        if (!eventListeners) {
            HyprEvents._listeners.set(eventId, [listener])
        } else {
            const isExist = eventListeners.includes(listener)

            if (isExist) {
                return console.error(
                    'HyprEvents: Listener has been attached already!'
                )
            }

            eventListeners.push(listener)
        }
    }

    static removeEventListener(
        eventId: HyprEventId,
        listener: (data: object) => any
    ) {
        const eventListeners = HyprEvents._listeners.get(eventId)

        if (!eventListeners) {
            return console.error(
                `HyprEvents: No listeners for the event '${eventId}'!`
            )
        }

        const index = eventListeners.indexOf(listener)

        if (index === -1) {
            return console.error('HyprEvents: Nonexistent listener!')
        }

        eventListeners.splice(index, 1)

        if (eventListeners.length === 0) {
            HyprEvents._listeners.delete(eventId)
        }
    }

    static startListening() {
        if (!HyprEvents._webSocket) {
            HyprEvents._webSocket = new WebSocket(
                'ws://127.0.0.1:6481/hypr/events'
            )

            HyprEvents._webSocket.onmessage = (e) => {
                const data = JSON.parse(e.data)

                if (HyprEvents._listeners.has(data.id)) {
                    const listeners = HyprEvents._listeners.get(data.id)

                    if (listeners) {
                        listeners.forEach((listener) => {
                            listener(data.data)
                        })
                    }
                }
            }
        }
    }

    static stopListening() {
        if (HyprEvents._webSocket) {
            HyprEvents._webSocket.close()
            HyprEvents._webSocket = null
        }
    }
}

export { HyprEvents, HyprEventIds }
export type { HyprEventId }
