export type SocketEventData = Record<string, any>

export type SocketEvent = {
    id: string
    data?: SocketEventData
}

type SocketEventListener = (data: SocketEventData) => void

export class SocketEventHandler {
    private _uri: string
    private _socket: WebSocket | undefined = undefined
    private _listeners: { [key: string]: SocketEventListener[] } = {}
    private _eventQueue: SocketEvent[] = []

    constructor(uri: string) {
        this._uri = uri
    }

    private _afterConnection(callBack: () => void) {
        ;(async () => {
            if (this._socket) {
                let sleep = true
                let runCallback = true

                while (sleep) {
                    if (this._socket.readyState === WebSocket.OPEN) {
                        sleep = false
                    }
                    if (this._socket.readyState === WebSocket.CLOSED) {
                        sleep = false
                        runCallback = false
                    }
                    await new Promise((resolve) => setTimeout(resolve, 100))
                }

                if (runCallback) callBack()
            }
        })()
    }

    connect() {
        if (!this._socket) {
            this._socket = new WebSocket(this._uri)

            this._socket.addEventListener('open', async () => {
                if (this._eventQueue.length > 0) {
                    this._afterConnection(() => {
                        while (this._eventQueue.length > 0) {
                            this._socket!.send(
                                JSON.stringify(this._eventQueue.shift())
                            )
                        }
                    })
                }
            })

            this._socket.onmessage = (e) => {
                const event: SocketEvent = JSON.parse(e.data)
                const listeners = this._listeners[event.id]

                if (listeners) {
                    listeners.forEach((listener) => {
                        listener(event.data || {})
                    })
                }
            }
        } else {
            console.error(
                `Socket event handler (${this._uri}): Already connected`
            )
        }
    }

    disconnect() {
        if (this._socket) {
            const socket = this._socket

            this._afterConnection(() => {
                socket.close()
            })

            this._socket = undefined
        } else {
            console.error(`Socket event handler (${this._uri}): Not connected`)
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
        if (this._socket) {
            if (this._socket.readyState == WebSocket.OPEN) {
                this._socket.send(JSON.stringify(event))
            } else {
                this._eventQueue.push(event)
            }
        }
    }
}
