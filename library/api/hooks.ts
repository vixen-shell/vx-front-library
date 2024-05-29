import { useState, useRef, useEffect } from 'react'
import { ApiRoutes } from './ApiRoutes'
import { SocketEventHandler, SocketEventData } from './SocketEventHandler'

export type DataHandlerInfo = {
    name: string
    args?: any[]
}

export const useFeatureData = (
    featureName: string,
    dataHandlers: DataHandlerInfo[]
) => {
    const [data, setData] = useState<Record<string, any> | undefined>(undefined)

    const getData = () => {
        const postDataHandlers = async () => {
            try {
                const response = await fetch(
                    ApiRoutes.feature_data(featureName),
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(dataHandlers),
                    }
                )

                if (!response.ok) {
                    throw new Error((await response.json()).message)
                }

                setData(await response.json())
            } catch (error: any) {
                if (data) setData(undefined)
                console.error(error)
            }
        }

        postDataHandlers()
    }

    return { getData, data }
}

export const useFeatureDataStreamer = (
    featureName: string,
    dataHandlers: DataHandlerInfo[],
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

    const start = () => {
        socket.current.connect()

        socket.current.send_event({
            id: 'INIT',
            data: { data_handlers: dataHandlers, interval: interval },
        })
    }

    return { data, start, stop: socket.current.disconnect }
}

export const useFeatureSocket = (
    featureName: string,
    socketName: string,
    auto: boolean
) => {
    const socket = useRef<SocketEventHandler>(
        new SocketEventHandler(
            ApiRoutes.feature_socket(featureName, socketName)
        )
    )

    useEffect(() => {
        const onError = (data: SocketEventData) => {
            console.error(data.message)
        }

        socket.current.addEventListener('ERROR', onError)
        if (auto) socket.current.connect()

        return () => {
            socket.current.removeEventListener('ERROR', onError)
            if (auto) socket.current.disconnect()
        }
    }, [auto])

    return socket.current as SocketEventHandler
}
