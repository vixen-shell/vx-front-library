import { useState, useRef, useEffect, useCallback } from 'react'
import { ApiRoutes } from '../ApiRoutes'
import { SocketEventHandler, SocketEventData } from '../SocketEventHandler'

interface HandlerInfo {
    name: string
    args?: any[]
}

export const useStream = (
    feature: string,
    target: string,
    handlers: HandlerInfo[],
    interval: number,
    auto: boolean
) => {
    const [data, setData] = useState<Record<string, any>>({})

    const socket = useRef<SocketEventHandler>(
        new SocketEventHandler(ApiRoutes.feature_data_streamer(feature, target))
    )

    useEffect(() => {
        const currentSocket = socket.current

        const onUpdate = (data: SocketEventData) => {
            setData(data)
        }

        const onError = (data: SocketEventData) => {
            console.error(data.message)
            setData({})
        }

        currentSocket.addEventListener('UPDATE', onUpdate)
        currentSocket.addEventListener('ERROR', onError)
        if (auto) start()

        return () => {
            currentSocket.removeEventListener('UPDATE', onUpdate)
            currentSocket.removeEventListener('ERROR', onError)
            if (auto) currentSocket.disconnect()
        }
    }, [auto])

    const start = useCallback(() => {
        socket.current.connect()

        socket.current.send_event({
            id: 'INIT',
            data: { data_handlers: handlers, interval: interval },
        })
    }, [handlers, interval])

    return { data, start, stop: socket.current.disconnect }
}
