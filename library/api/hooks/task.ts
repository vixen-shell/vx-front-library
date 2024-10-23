import { useRef, useCallback } from 'react'
import { BaseApi } from '../api'
import { ApiRoutes } from '../ApiRoutes'

interface HandlerInfo {
    name: string
    args?: any[]
}

async function fetchTask(handler: HandlerInfo, signal: AbortSignal) {
    const response = await fetch(
        ApiRoutes.feature_action(BaseApi.urlParams.feature),
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

    return await response.json()
}

export const useTask = () => {
    const afterRunCallback = useRef<(data: any, error: any) => void>()

    const run = useCallback((name: string, args?: any[]) => {
        const controller = new AbortController()
        const { signal } = controller

        ;(async () => {
            try {
                await fetchTask({ name: name, args: args }, signal)

                if (afterRunCallback.current) {
                    const callbackData = {
                        name: name,
                        args: args,
                    }

                    afterRunCallback.current(callbackData, null)
                }
            } catch (error: any) {
                console.error(error)
                if (afterRunCallback.current) {
                    afterRunCallback.current(null, error)
                }
            }
        })()

        return () => controller.abort()
    }, [])

    const afterRun = useCallback(
        (callback: (data: any, error: any) => void) => {
            afterRunCallback.current = callback
        },
        []
    )

    return { run, afterRun }
}
