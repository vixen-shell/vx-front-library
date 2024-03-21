export namespace EventData {
    export type StateItem = {
        key: string
        value: null | string | number | boolean
    }

    export type Log = {
        level: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'
        purpose: string
        data?: {
            type: 'TEXT' | 'DATA'
            content: string | { [key: string]: string | number | boolean }
            asset?: string
        }
    }
}

export namespace Output {
    export type Ids = 'GET_STATE' | 'SET_STATE' | 'SAVE_STATE' | 'LOG'
    export type Data = EventData.StateItem | EventData.Log

    export type Event = {
        id: Ids
        data?: Data
    }
}

export namespace Input {
    export type Ids = 'UPDATE_STATE' | 'LOG'
    export type Data = EventData.StateItem | EventData.Log

    export type Event = {
        id: Ids
        data?: Data
    }
}

export type EventListenerCallback = (data: any) => void

export type EventListeners = {
    [key in Input.Ids]: EventListenerCallback[]
}

export class ApiEvents {
    private _webSocket: WebSocket
    private _listeners: EventListeners = {
        LOG: [],
        UPDATE_STATE: [],
    }

    constructor(pipeRoute: string) {
        this._webSocket = new WebSocket(pipeRoute)

        this._webSocket.onmessage = (e) => {
            const event: Input.Event = JSON.parse(e.data)
            this._handleInputs(event)
        }
    }

    private _handleInputs(event: Input.Event) {
        if (event.id in this._listeners) {
            if (event.data) {
                this._listeners[event.id].forEach((listener) => {
                    listener(event.data)
                })
            }
        }
    }

    hasListeners(eventId: Input.Ids) {
        return this._listeners[eventId].length !== 0
    }

    addListener(eventId: Input.Ids, callback: EventListenerCallback) {
        this._listeners[eventId].push(callback)
    }

    removeListener(eventId: Input.Ids, callback: EventListenerCallback) {
        this._listeners[eventId] = this._listeners[eventId].filter(
            (listener) => listener !== callback
        )
    }

    send(event: Output.Event) {
        this._webSocket.send(JSON.stringify(event))
    }
}
