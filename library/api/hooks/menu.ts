import { useCallback } from 'react'
import { ApiRoutes } from '../ApiRoutes'

export const useMenu = () => {
    const popup = useCallback((name: string) => {
        const controller = new AbortController()
        const { signal } = controller

        const urlParams = new URLSearchParams(window.location.search)
        const featureName = urlParams.get('feature')
        const frameId = urlParams.get('frame')

        if (featureName && frameId) {
            ;(async () => {
                try {
                    const response = await fetch(
                        ApiRoutes.feature_menu(featureName),
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                frame_id: frameId,
                                menu_name: name,
                            }),
                            signal: signal,
                        }
                    )

                    if (!response.ok) {
                        const errorResponse = await response.json()
                        throw new Error(errorResponse.message)
                    }
                } catch (error: any) {
                    console.error(error)
                }
            })()
        }

        return () => controller.abort()
    }, [])

    return { popup }
}
