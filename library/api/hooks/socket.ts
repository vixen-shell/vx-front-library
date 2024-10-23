import { useRef, useEffect } from 'react'
import { BaseApi } from '../api'
import { ApiRoutes } from '../ApiRoutes'
import { SocketEventHandler, SocketEventData } from '../SocketEventHandler'

export const useSocket = (name: string) => {
    const socket = useRef<SocketEventHandler>(
        new SocketEventHandler(
            ApiRoutes.feature_socket(BaseApi.urlParams.feature, name)
        )
    )

    useEffect(() => {
        const currentSocket = socket.current

        const onError = (data: SocketEventData) => {
            console.error(data.message)
        }

        currentSocket.addEventListener('ERROR', onError)
        currentSocket.connect()

        return () => {
            currentSocket.removeEventListener('ERROR', onError)
            currentSocket.disconnect()
        }
    }, [])

    return socket.current as SocketEventHandler
}
