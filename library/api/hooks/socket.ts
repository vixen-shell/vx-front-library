import { useRef, useEffect } from 'react'
import { ApiRoutes } from '../ApiRoutes'
import { SocketEventHandler, SocketEventData } from '../SocketEventHandler'

export const useSocket = (
    feature: string,
    target: string,
    name: string,
    auto: boolean
) => {
    const socket = useRef<SocketEventHandler>(
        new SocketEventHandler(ApiRoutes.feature_socket(feature, target, name))
    )

    useEffect(() => {
        const currentSocket = socket.current

        const onError = (data: SocketEventData) => {
            console.error(data.message)
        }

        currentSocket.addEventListener('ERROR', onError)
        if (auto) currentSocket.connect()

        return () => {
            currentSocket.removeEventListener('ERROR', onError)
            if (auto) currentSocket.disconnect()
        }
    }, [auto])

    return socket.current as SocketEventHandler
}
