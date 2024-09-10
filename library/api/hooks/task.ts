import { useRef, useCallback } from 'react'
import { ApiRoutes } from '../ApiRoutes'

interface HandlerInfo {
    name: string
    args?: any[]
}

export const useTask = (feature: string, handler: HandlerInfo) => {
    const afterRunCallback = useRef<(data: any, error: any) => void>()

    const run = useCallback(
        (args?: any[]) => {
            if (args) {
                handler.args = args
            }

            const controller = new AbortController()
            const { signal } = controller

            ;(async () => {
                try {
                    const response = await fetch(
                        ApiRoutes.feature_action(feature),
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(handler),
                            signal: signal,
                        }
                    )

                    if (!response.ok) {
                        const errorResponse = await response.json()
                        throw new Error(errorResponse.message)
                    }

                    if (afterRunCallback.current) {
                        afterRunCallback.current(await response.json(), null)
                    }
                } catch (error: any) {
                    console.error(error)
                    if (afterRunCallback.current) {
                        afterRunCallback.current(null, error)
                    }
                }
            })()

            return () => controller.abort()
        },
        [feature, handler]
    )

    const afterRun = useCallback(
        (callback: (data: any, error: any) => void) => {
            afterRunCallback.current = callback
        },
        []
    )

    return { run, afterRun }
}
