import { useState, useRef, useCallback } from 'react'
import { ApiRoutes } from '../ApiRoutes'

interface HandlerInfo {
    name: string
    args?: any[]
}

export const useTask = (feature: string, handler: HandlerInfo) => {
    const [isRunning, setIsRunning] = useState<boolean>(false)
    const terminate = useRef<(data: any, error: any) => void>()

    const run = useCallback(() => {
        setIsRunning(true)

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

                if (terminate.current) {
                    terminate.current(await response.json(), null)
                }
            } catch (error: any) {
                console.error(error)
                if (terminate.current) {
                    terminate.current(null, error)
                }
            } finally {
                setIsRunning(false)
            }
        })()

        return () => controller.abort()
    }, [feature, handler])

    const onTerminate = useCallback(
        (callback: (data: any, error: any) => void) => {
            terminate.current = callback
        },
        []
    )

    return { run, isRunning, onTerminate }
}
