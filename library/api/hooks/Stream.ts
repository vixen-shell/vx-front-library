import { useState, useRef, useEffect, useCallback } from 'react'
import { BaseApi } from '../api'
import { ApiRoutes } from '../ApiRoutes'
import { SocketEventHandler, SocketEventData } from '../SocketEventHandler'

interface HandlerInfo {
    data_name: string
    handler_name: string
    handler_args?: any[]
}

export const useStream = (connect: boolean = false, interval?: number) => {
    const [data, setData] = useState<Record<string, any>>({})

    const socket = useRef<SocketEventHandler>(
        new SocketEventHandler(
            ApiRoutes.feature_data_streamer_socket(BaseApi.urlParams.feature)
        )
    )

    const stream = useCallback(
        (key: string, handler?: { name: string; args?: any[] }) => {
            if (!(key in data)) {
                if (handler) {
                    setData((prevData) => ({ ...prevData, [key]: undefined }))

                    const handlerInfo: HandlerInfo = {
                        data_name: key,
                        handler_name: handler.name,
                        handler_args: handler.args,
                    }

                    socket.current.send_event({
                        id: 'ADD_HANDLER',
                        data: handlerInfo,
                    })
                }
            }

            return data[key]
        },
        [data]
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

        if (connect) {
            currentSocket.connect()

            if (interval) {
                currentSocket.send_event({
                    id: 'SET_INTERVAL',
                    data: { interval: interval },
                })
            }
        }

        return () => {
            currentSocket.removeEventListener('UPDATE', onUpdate)
            currentSocket.removeEventListener('ERROR', onError)
            if (connect) currentSocket.disconnect()
        }
    }, [connect, interval])

    return { stream }
}
