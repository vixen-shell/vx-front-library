import type { HandlerInfo } from './types'

import { useCallback, useState } from 'react'
import { ApiRoutes } from '../ApiRoutes'

export const useFeatureData = (
    featureName: string,
    dataHandlers: HandlerInfo[]
) => {
    const [data, setData] = useState<Record<string, any> | undefined>(undefined)

    const getData = useCallback(() => {
        const controller = new AbortController()
        const { signal } = controller

        ;(async () => {
            try {
                const response = await fetch(
                    ApiRoutes.feature_data(featureName),
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(dataHandlers),
                        signal: signal,
                    }
                )

                if (!response.ok) {
                    const errorResponse = await response.json()
                    throw new Error(errorResponse.message)
                }

                setData(await response.json())
            } catch (error: any) {
                if (data) setData(undefined)
                console.error(error)
            }
        })()

        return () => controller.abort()
    }, [featureName, dataHandlers])

    return { getData, data }
}
