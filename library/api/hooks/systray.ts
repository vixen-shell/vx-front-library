import { useRef, useEffect, useState } from 'react'
import { ApiRoutes } from '../ApiRoutes'
import { BaseApi } from '../api'
import { SocketEventHandler, SocketEventData } from '../SocketEventHandler'

export const useSystray = () => {
    const socket = useRef<SocketEventHandler>(
        new SocketEventHandler(
            ApiRoutes.feature_systray_socket(BaseApi.urlParams.feature)
        )
    )

    const [systray, setSystray] = useState<any[]>([])

    useEffect(() => {
        const currentSocket = socket.current

        const onError = (data: SocketEventData) => {
            console.error(data.message)
        }

        const onUpdate = (data: SocketEventData) => {
            setSystray(data.systray)
        }

        currentSocket.addEventListener('UPDATE', onUpdate)
        currentSocket.addEventListener('ERROR', onError)
        currentSocket.connect()

        currentSocket.send_event({ id: 'UPDATE' })

        return () => {
            currentSocket.removeEventListener('UPDATE', onUpdate)
            currentSocket.removeEventListener('ERROR', onError)
            currentSocket.disconnect()
        }
    }, [])

    return systray
}
