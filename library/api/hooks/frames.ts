import { useCallback, useEffect, useState } from 'react'
import { ApiRoutes } from '../ApiRoutes'

export const useFrames = (feature: string) => {
    const [ids, setIds] = useState<string[]>([])
    const [actives, setActives] = useState<string[]>([])

    useEffect(() => {
        update()
    }, [])

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
    }, [feature])

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
        [feature]
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
        [feature]
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
        [feature]
    )

    return { ids, actives, toggle, open, close }
}