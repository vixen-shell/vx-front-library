import { BaseApi } from '../api'
import { ApiRoutes } from '../api/ApiRoutes'
import { useVxState } from '../stateHook'
import { useEffect, useRef } from 'react'

interface PopupInfos {
    route: string
    monitor_id: number
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

export const useHidePopupFrame = () => {
    const { state, setStateItem } = useVxState()

    const hide = () => {
        if (state.vx_popup_frame) {
            ;(async () => {
                try {
                    await hidePopup()
                    setStateItem('vx_popup_frame', null)
                } catch (error: any) {
                    console.error(error)
                }
            })()
        }
    }

    return { hide }
}

export const usePopupFrame = () => {
    const { state, setStateItem } = useVxState()

    const onClosingCallback = useRef<
        (
            lastPosition: {
                x: number
                y: number
            } | null,
            lastSize: {
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
    }: {
        route: string
        monitorId?: number
        position?: { x: number; y: number }
        size?: { width: number; height: number }
        resizable?: boolean
        exitOnMouseLeave?: boolean
    }) => {
        if (!state.vx_popup_frame) {
            setStateItem('vx_popup_frame', {
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

    const onClosing = (
        callback: (
            lastPosition: {
                x: number
                y: number
            } | null,
            lastSize: {
                width: number
                height: number
            } | null
        ) => void
    ) => {
        onClosingCallback.current = callback
    }

    useEffect(() => {
        const popupFrameCallbackData = state.vx_popup_frame_callback_data

        if (popupFrameCallbackData) {
            if (onClosingCallback.current) {
                onClosingCallback.current(
                    popupFrameCallbackData.position,
                    popupFrameCallbackData.size
                )
            }

            setStateItem('vx_popup_frame_callback_data', null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.vx_popup_frame_callback_data])

    return { show, onClosing }
}
