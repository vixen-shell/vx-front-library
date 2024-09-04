import { useCallback, useEffect, useState } from 'react'
import { ApiRoutes } from '../ApiRoutes'

export const useParams = (feature: string, paths: string[]) => {
    const [params, setParams] = useState<Record<string, any>>({})

    useEffect(() => {
        paths.forEach((paramPath) => {
            getParam(paramPath)
        })
    }, [])

    const updateParams = useCallback((paramPath: string, value: any) => {
        setParams((prevParams) => ({ ...prevParams, [paramPath]: value }))
    }, [])

    const getParam = useCallback((paramPath: string) => {
        const controller = new AbortController()
        const { signal } = controller

        ;(async () => {
            try {
                const response = await fetch(
                    ApiRoutes.feature_get_param(feature, paramPath),
                    { signal: signal }
                )

                if (!response.ok) {
                    const errorResponse = await response.json()
                    throw new Error(errorResponse.message)
                }

                updateParams(paramPath, (await response.json())[paramPath])
            } catch (error: any) {
                console.error(error)
            }
        })()

        return () => controller.abort()
    }, [])

    const setParam = useCallback((paramPath: string, value: any) => {
        if (!(paramPath in params)) {
            throw new Error('Parameter path not found')
        }

        const controller = new AbortController()
        const { signal } = controller

        ;(async () => {
            try {
                const response = await fetch(
                    ApiRoutes.feature_set_param(feature, paramPath),
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ value: value }),
                        signal: signal,
                    }
                )

                if (!response.ok) {
                    const errorResponse = await response.json()
                    throw new Error(errorResponse.message)
                }

                updateParams(paramPath, value)
            } catch (error: any) {
                console.error(error)
            }
        })()

        return () => controller.abort()
    }, [])

    return { params, setParam }
}
