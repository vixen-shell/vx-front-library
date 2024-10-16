import { useCallback } from 'react'
import { ApiRoutes } from '../ApiRoutes'

export const useDbusMenu = (serviceName: string) => {
    const popup = useCallback(() => {
        const controller = new AbortController()
        const { signal } = controller

        const urlParams = new URLSearchParams(window.location.search)
        const featureName = urlParams.get('feature')
        const frameId = urlParams.get('frame')

        if (featureName && frameId) {
            ;(async () => {
                try {
                    const response = await fetch(
                        ApiRoutes.feature_dbus_menu(featureName),
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                frame_id: frameId,
                                service_name: serviceName,
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
    }, [serviceName])

    return { popup }
}
