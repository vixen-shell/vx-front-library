import { useCallback, useEffect, useState } from 'react'
import { ApiRoutes } from '../ApiRoutes'

export const useParams = (feature: string, paths: string[]) => {
    const [params, setParams] = useState<Record<string, any>>({})

    const updateParams = useCallback((paramPath: string, value: any) => {
        setParams((prevParams) => ({ ...prevParams, [paramPath]: value }))
    }, [])

    const loadParam = useCallback(
        (paramPath: string) => {
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
        },
        [feature, updateParams]
    )

    const get = useCallback(
        (path: string) => {
            return params[path]
        },
        [params]
    )

    const set = useCallback(
        (path: string, value: any) => {
            if (!(path in params)) {
                throw new Error('Parameter path not found')
            }

            const controller = new AbortController()
            const { signal } = controller

            ;(async () => {
                try {
                    const response = await fetch(
                        ApiRoutes.feature_set_param(feature, path),
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

                    updateParams(path, value)
                } catch (error: any) {
                    console.error(error)
                }
            })()

            return () => controller.abort()
        },
        [feature, params, updateParams]
    )

    const save = useCallback(() => {
        const controller = new AbortController()
        const { signal } = controller

        ;(async () => {
            const response = await fetch(
                ApiRoutes.feature_save_params(feature),
                { signal: signal }
            )

            if (!response.ok) {
                const errorResponse = await response.json()
                console.error(errorResponse.message)
            }
        })()

        return () => controller.abort()
    }, [feature])

    useEffect(() => {
        if (Object.keys(params).length < paths.length) {
            paths.forEach((paramPath) => {
                loadParam(paramPath)
            })
        }
    }, [loadParam, params, paths])

    return { get, set, save }
}
