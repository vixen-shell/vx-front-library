import { useCallback, useEffect, useState } from 'react'
import { ApiRoutes } from '../ApiRoutes'

export const useFeatureFrames = (featureName: string) => {
    const [ids, setIds] = useState<string[]>([])
    const [actives, setActives] = useState<string[]>([])

    useEffect(() => {
        update()
    }, [])

    const request = useCallback(async (route: string, signal: AbortSignal) => {
        try {
            const response = await fetch(route, { signal: signal })

            if (!response.ok) {
                const errorResponse = await response.json()
                throw new Error(errorResponse.message)
            }

            return await response.json()
        } catch (error: any) {
            throw error
        }
    }, [])

    const update = useCallback(() => {
        const controller = new AbortController()
        const { signal } = controller

        ;(async () => {
            try {
                const data = await request(
                    ApiRoutes.frames_ids(featureName),
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
    }, [featureName])

    const toggle = useCallback(
        (frameId: string) => {
            const controller = new AbortController()
            const { signal } = controller

            ;(async () => {
                try {
                    await request(
                        ApiRoutes.frame_toggle(featureName, frameId),
                        signal
                    )

                    update()
                } catch (error: any) {
                    console.error(error)
                }
            })()

            return () => controller.abort()
        },
        [featureName]
    )

    const open = useCallback(
        (frameId: string) => {
            const controller = new AbortController()
            const { signal } = controller

            ;(async () => {
                try {
                    await request(
                        ApiRoutes.frame_open(featureName, frameId),
                        signal
                    )

                    update()
                } catch (error: any) {
                    console.error(error)
                }
            })()

            return () => controller.abort()
        },
        [featureName]
    )

    const close = useCallback(
        (frameId: string) => {
            const controller = new AbortController()
            const { signal } = controller

            ;(async () => {
                try {
                    await request(
                        ApiRoutes.frame_close(featureName, frameId),
                        signal
                    )

                    update()
                } catch (error: any) {
                    console.error(error)
                }
            })()

            return () => controller.abort()
        },
        [featureName]
    )

    return { ids, actives, toggle, open, close }
}
