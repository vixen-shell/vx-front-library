export type SocketEventData = Record<string, any>

export type SocketEvent = {
    id: string
    data?: SocketEventData
}

type SocketEventListener = (data: SocketEventData) => void

export class SocketEventHandler {
    private _websocket: WebSocket
    private _listeners: { [key: string]: SocketEventListener[] } = {}

    constructor(socketRoute: string) {
        this._websocket = new WebSocket(socketRoute)

        this._websocket.onmessage = (e) => {
            const event: SocketEvent = JSON.parse(e.data)
            this._handleInputEvents(event)
        }
    }

    private _handleInputEvents(event: SocketEvent) {
        const listeners = this._listeners[event.id]

        if (listeners) {
            listeners.forEach((listener) => {
                listener(event.data || {})
            })
        }
    }

    addEventListener(eventId: string, listener: SocketEventListener) {
        if (!this._listeners[eventId]) {
            this._listeners[eventId] = []
        }

        this._listeners[eventId].push(listener)
    }

    removeEventListener(eventId: string, listener: SocketEventListener) {
        if (this._listeners[eventId]) {
            this._listeners[eventId] = this._listeners[eventId].filter(
                (this_listener) => this_listener !== listener
            )

            if (this._listeners[eventId].length === 0) {
                delete this._listeners[eventId]
            }
        }
    }

    send_event(event: SocketEvent) {
        this._websocket.send(JSON.stringify(event))
    }
}
