import { useRef, useEffect } from 'react'
import { ApiRoutes } from '../ApiRoutes'
import { SocketEventHandler, SocketEventData } from '../SocketEventHandler'

export const useFeatureSocket = (
    featureName: string,
    targetFeatureName: string,
    socketName: string,
    auto: boolean
) => {
    const socket = useRef<SocketEventHandler>(
        new SocketEventHandler(
            ApiRoutes.feature_socket(featureName, targetFeatureName, socketName)
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
