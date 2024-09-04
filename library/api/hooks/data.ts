import { useCallback, useEffect, useState } from 'react'
import { ApiRoutes } from '../ApiRoutes'

interface HandlerInfo {
    name: string
    args?: any[]
}

export const useData = (feature: string, handlers: HandlerInfo[]) => {
    const [data, setData] = useState<Record<string, any>>({})

    useEffect(() => {
        update()
    }, [])

    const update = useCallback(() => {
        const controller = new AbortController()
        const { signal } = controller

        ;(async () => {
            try {
                const response = await fetch(ApiRoutes.feature_data(feature), {
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

                setData(await response.json())
            } catch (error: any) {
                if (data) setData({})
                console.error(error)
            }
        })()

        return () => controller.abort()
    }, [feature, handlers])

    return { update, data }
}
