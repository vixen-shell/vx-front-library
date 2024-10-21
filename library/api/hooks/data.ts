import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiRoutes } from '../ApiRoutes'
import { useStream } from './Stream'

interface HandlerInfo {
    name: string
    args?: any[]
}

async function fetchData(handlers: HandlerInfo[], signal: AbortSignal) {
    const urlParams = new URLSearchParams(window.location.search)
    const featureName = urlParams.get('feature')
    const frameId = urlParams.get('frame')

    if (featureName && frameId) {
        const response = await fetch(ApiRoutes.feature_data(featureName), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(handlers),
            signal: signal,
        })

        if (!response.ok) {
            const errorResponse = await response.json()
            throw new Error(errorResponse.message)
        }

        return await response.json()
    }
}

export const useData = () => {
    const { stream, setInterval } = useStream()
    const [data, setData] = useState<Record<string, any>>({})
    const handlers = useRef<Record<string, HandlerInfo>>({})
    const abortControllerRef = useRef<AbortController | null>(null)

    useEffect(() => {
        handlers.current = {}
        abortControllerRef.current = null
    }, [])

    const update = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }

        const controller = new AbortController()
        abortControllerRef.current = controller
        const { signal } = controller

        ;(async () => {
            try {
                setData(
                    await fetchData(Object.values(handlers.current), signal)
                )
            } catch (error: any) {
                if (Object.keys(data).length !== 0) setData({})
                if (Object.keys(handlers.current).length !== 0)
                    handlers.current = {}
                if (error.name !== 'AbortError') console.error(error)
            }
        })()

        return () => controller.abort()
    }, [data])

    const get = useCallback(
        (name: string, args?: any[]) => {
            if (!(name in handlers.current)) {
                handlers.current[name] = { name: name, args: args }

                if (
                    Object.keys(data).length <
                    Object.keys(handlers.current).length
                ) {
                    update()
                }
            }

            return data[name]
        },
        [data, update]
    )

    return { get, stream, setInterval }
}
