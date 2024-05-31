import { useState, useRef, useEffect, useCallback } from 'react'
import { ApiRoutes } from '../ApiRoutes'
import { SocketEventHandler, SocketEventData } from '../SocketEventHandler'

export interface HandlerInfo {
    name: string
    args?: any[]
}

export const useFeatureDataStreamer = (
    featureName: string,
    dataHandlers: HandlerInfo[],
    interval: number,
    auto: boolean
) => {
    const [data, setData] = useState<Record<string, any> | undefined>(undefined)

    const socket = useRef<SocketEventHandler>(
        new SocketEventHandler(ApiRoutes.feature_data_streamer(featureName))
    )

    useEffect(() => {
        const onUpdate = (data: SocketEventData) => {
            setData(data)
        }

        const onError = (data: SocketEventData) => {
            console.error(data.message)
            setData(undefined)
        }

        socket.current.addEventListener('UPDATE', onUpdate)
        socket.current.addEventListener('ERROR', onError)
        if (auto) start()

        return () => {
            socket.current.removeEventListener('UPDATE', onUpdate)
            socket.current.removeEventListener('ERROR', onError)
            if (auto) socket.current.disconnect()
        }
    }, [auto])

    const start = useCallback(() => {
        socket.current.connect()

        socket.current.send_event({
            id: 'INIT',
            data: { data_handlers: dataHandlers, interval: interval },
        })
    }, [dataHandlers, interval])

    return { data, start, stop: socket.current.disconnect }
}
