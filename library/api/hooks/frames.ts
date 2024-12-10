import { useRef, useEffect, useState, useCallback } from 'react'
import { ApiRoutes } from '../ApiRoutes'
import { BaseApi } from '../api'
import { SocketEventHandler, SocketEventData } from '../SocketEventHandler'

export const useFrames = (feature: string = BaseApi.urlParams.feature) => {
    const socket = useRef<SocketEventHandler>(
        new SocketEventHandler(ApiRoutes.feature_frames_socket(feature))
    )

    const [ids, setIds] = useState<string[]>([])
    const [actives, setActives] = useState<string[]>([])

    useEffect(() => {
        const currentSocket = socket.current

        const onError = (data: SocketEventData) => {
            console.error(data.message)
        }
        const onFrameIds = (data: SocketEventData) => {
            setIds(data.frame_ids)
            setActives(data.active_frame_ids)
        }
        const onOpenFrame = (data: SocketEventData) => {
            setActives(data.active_frame_ids)
        }
        const onCloseFrame = (data: SocketEventData) => {
            setActives(data.active_frame_ids)
        }
        const onNewFromTemplate = (data: SocketEventData) => {
            setIds(data.frame_ids)
        }
        const onRemoveFromTemplate = (data: SocketEventData) => {
            setIds(data.frame_ids)
        }

        currentSocket.addEventListener('ERROR', onError)
        currentSocket.addEventListener('FRAME_IDS', onFrameIds)
        currentSocket.addEventListener('OPEN', onOpenFrame)
        currentSocket.addEventListener('CLOSE', onCloseFrame)
        currentSocket.addEventListener('NEW_FROM_TEMPLATE', onNewFromTemplate)
        currentSocket.addEventListener(
            'REMOVE_FROM_TEMPLATE',
            onRemoveFromTemplate
        )
        currentSocket.connect()

        currentSocket.send_event({ id: 'UPDATE' })

        return () => {
            currentSocket.removeEventListener('ERROR', onError)
            currentSocket.removeEventListener('OPEN_SOCKET', onFrameIds)
            currentSocket.removeEventListener('OPEN', onOpenFrame)
            currentSocket.removeEventListener('CLOSE', onCloseFrame)
            currentSocket.removeEventListener(
                'NEW_FROM_TEMPLATE',
                onNewFromTemplate
            )
            currentSocket.removeEventListener(
                'REMOVE_FROM_TEMPLATE',
                onRemoveFromTemplate
            )
            currentSocket.disconnect()
        }
    }, [])

    const toggle = useCallback((frameId: string) => {
        socket.current.send_event({
            id: 'TOGGLE',
            data: { frame_id: frameId },
        })
    }, [])

    const open = useCallback((frameId: string) => {
        socket.current.send_event({
            id: 'OPEN',
            data: { frame_id: frameId },
        })
    }, [])

    const close = useCallback((frameId: string) => {
        socket.current.send_event({
            id: 'CLOSE',
            data: { frame_id: frameId },
        })
    }, [])

    return { ids, actives, toggle, open, close }
}
