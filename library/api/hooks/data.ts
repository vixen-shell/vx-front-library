import { useCallback, useState } from 'react'
import { ApiRoutes } from '../ApiRoutes'
import { useStream } from './Stream'

interface HandlerInfo {
    data_name: string
    handler_name: string
    handler_args?: any[]
}

async function fetchData(handler: HandlerInfo, signal: AbortSignal) {
    const urlParams = new URLSearchParams(window.location.search)
    const featureName = urlParams.get('feature')
    const frameId = urlParams.get('frame')

    if (featureName && frameId) {
        const response = await fetch(ApiRoutes.feature_data(featureName), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(handler),
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

    const updateData = useCallback((handler: HandlerInfo) => {
        const controller = new AbortController()
        const { signal } = controller

        ;(async () => {
            try {
                const newData = await fetchData(handler, signal)
                setData((prevData) => ({ ...prevData, ...newData }))
            } catch (error: any) {
                console.error(error)
            }
        })()
    }, [])

    const get = useCallback(
        (key: string, handler?: { name: string; args?: any[] }) => {
            if (!(key in data)) {
                if (handler) {
                    setData((prevData) => ({ ...prevData, [key]: undefined }))

                    const handlerInfo: HandlerInfo = {
                        data_name: key,
                        handler_name: handler.name,
                        handler_args: handler.args,
                    }

                    updateData(handlerInfo)
                }
            }

            return data[key] || undefined
        },
        [data, updateData]
    )

    return { get, stream, setInterval }
}
