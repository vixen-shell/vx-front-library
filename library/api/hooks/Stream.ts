import { useState, useRef, useEffect, useCallback } from 'react'
import { ApiRoutes } from '../ApiRoutes'
import { SocketEventHandler, SocketEventData } from '../SocketEventHandler'

function getSocketEventHandler() {
    const urlParams = new URLSearchParams(window.location.search)
    const featureName = urlParams.get('feature')

    if (featureName) {
        return new SocketEventHandler(
            ApiRoutes.feature_data_streamer(featureName)
        )
    } else {
        throw new Error('Unable to get feature url parameter')
    }
}

export const useStream = () => {
    const [data, setData] = useState<Record<string, any>>({})

    const socket = useRef<SocketEventHandler>(getSocketEventHandler())

    const stream = useCallback(
        (name: string, args?: any[]) => {
            socket.current.send_event({
                id: 'ADD_HANDLER',
                data: { name: name, args: args },
            })

            return data[name]
        },
        [data]
    )

    const setInterval = useCallback((value: number) => {
        socket.current.send_event({
            id: 'SET_INTERVAL',
            data: { interval: value },
        })
    }, [])

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
        currentSocket.connect()

        return () => {
            currentSocket.removeEventListener('UPDATE', onUpdate)
            currentSocket.removeEventListener('ERROR', onError)
            currentSocket.disconnect()
        }
    }, [])

    return { stream, setInterval }
}
