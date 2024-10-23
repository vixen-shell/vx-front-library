import { useCallback, useEffect, useState } from 'react'
import { BaseApi } from '../api'
import { ApiRoutes } from '../ApiRoutes'

export const useFrames = (feature: string = BaseApi.urlParams.feature) => {
    const [ids, setIds] = useState<string[]>([])
    const [actives, setActives] = useState<string[]>([])

    const request = useCallback(async (route: string, signal: AbortSignal) => {
        const response = await fetch(route, { signal: signal })

        if (!response.ok) {
            const errorResponse = await response.json()
            throw new Error(errorResponse.message)
        }

        return await response.json()
    }, [])

    const update = useCallback(() => {
        const controller = new AbortController()
        const { signal } = controller

        ;(async () => {
            try {
                const data = await request(
                    ApiRoutes.frames_ids(feature),
                    signal
                )

                setIds(data.ids)
                setActives(data.actives)
            } catch (error: any) {
                setIds([])
                setActives([])
                console.error(error)
            }
        })()

        return () => controller.abort()
    }, [feature, request])

    const toggle = useCallback(
        (frameId: string) => {
            const controller = new AbortController()
            const { signal } = controller

            ;(async () => {
                try {
                    await request(
                        ApiRoutes.frame_toggle(feature, frameId),
                        signal
                    )

                    update()
                } catch (error: any) {
                    console.error(error)
                }
            })()

            return () => controller.abort()
        },
        [feature, request, update]
    )

    const open = useCallback(
        (frameId: string) => {
            const controller = new AbortController()
            const { signal } = controller

            ;(async () => {
                try {
                    await request(
                        ApiRoutes.frame_open(feature, frameId),
                        signal
                    )

                    update()
                } catch (error: any) {
                    console.error(error)
                }
            })()

            return () => controller.abort()
        },
        [feature, request, update]
    )

    const close = useCallback(
        (frameId: string) => {
            const controller = new AbortController()
            const { signal } = controller

            ;(async () => {
                try {
                    await request(
                        ApiRoutes.frame_close(feature, frameId),
                        signal
                    )

                    update()
                } catch (error: any) {
                    console.error(error)
                }
            })()

            return () => controller.abort()
        },
        [feature, request, update]
    )

    useEffect(() => {
        update()
    }, [update])

    return { ids, actives, toggle, open, close }
}
