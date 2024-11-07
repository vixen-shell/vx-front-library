import { BaseApi } from '../api'
import { ApiRoutes } from '../ApiRoutes'
import { useVxState } from '../../stateHook'
import { useEffect, useRef } from 'react'

interface PopupInfos {
    route: string
    monitor_id: number
}

interface ShowProps {
    route: string
    monitorId?: number
    position?: { x: number; y: number }
    size?: { width: number; height: number }
    resizable?: boolean
    exitOnMouseLeave?: boolean
}

async function showPopup(popupInfos: PopupInfos) {
    const response = await fetch(
        ApiRoutes.popup_frame_show(BaseApi.urlParams.feature),
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(popupInfos),
        }
    )

    if (!response.ok) {
        const errorResponse = await response.json()
        throw new Error(errorResponse.message)
    }

    return await response.json()
}

async function hidePopup() {
    const response = await fetch(ApiRoutes.popup_frame_hide)

    if (!response.ok) {
        const errorResponse = await response.json()
        throw new Error(errorResponse.message)
    }

    return await response.json()
}

export const usePopupFrame = () => {
    const state = useVxState()

    const onHidingCallback = useRef<
        (
            position: {
                x: number
                y: number
            } | null,
            size: {
                width: number
                height: number
            } | null
        ) => void
    >()

    const show = ({
        route,
        monitorId = undefined,
        position = undefined,
        size = undefined,
        resizable = false,
        exitOnMouseLeave = false,
    }: ShowProps) => {
        if (!state.get.vx_popup_frame) {
            state.set('vx_popup_frame', {
                position: position || null,
                size: size || null,
                resizable: resizable,
                exit_on_leave: exitOnMouseLeave,
            })
            //
            ;(async () => {
                try {
                    const popupInfos: PopupInfos = {
                        route: route,
                        monitor_id: monitorId || 0,
                    }

                    await showPopup(popupInfos)
                } catch (error: any) {
                    console.error(error)
                }
            })()
        }
    }

    const hide = () => {
        if (state.get.vx_popup_frame) {
            ;(async () => {
                try {
                    await hidePopup()
                    state.set('vx_popup_frame', null)
                } catch (error: any) {
                    console.error(error)
                }
            })()
        }
    }

    const onHiding = (
        callback: (
            position: {
                x: number
                y: number
            } | null,
            size: {
                width: number
                height: number
            } | null
        ) => void
    ) => {
        onHidingCallback.current = callback
    }

    useEffect(() => {
        const popupFrameCallbackData = state.get.vx_popup_frame_callback_data

        if (popupFrameCallbackData) {
            if (onHidingCallback.current) {
                onHidingCallback.current(
                    popupFrameCallbackData.position,
                    popupFrameCallbackData.size
                )
            }

            state.set('vx_popup_frame_callback_data', null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.get.vx_popup_frame_callback_data])

    return { show, hide, onHiding }
}
