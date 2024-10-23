import { useRef, useEffect } from 'react'
import { ApiRoutes } from '../ApiRoutes'
import { SocketEventHandler, SocketEventData } from '../SocketEventHandler'

function getSocketEventHandler(socketName: string) {
    const urlParams = new URLSearchParams(window.location.search)
    const featureName = urlParams.get('feature')

    if (featureName) {
        return new SocketEventHandler(
            ApiRoutes.feature_socket(featureName, featureName, socketName)
        )
    } else {
        throw new Error('Unable to get feature url parameter')
    }
}

export const useSocket = (name: string) => {
    const socket = useRef<SocketEventHandler>(getSocketEventHandler(name))

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
