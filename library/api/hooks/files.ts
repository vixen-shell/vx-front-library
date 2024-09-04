import { useCallback, useEffect, useState } from 'react'
import { ApiRoutes } from '../ApiRoutes'

interface HandlerInfo {
    name: string
    args?: any[]
}

const isSupportedFileType = (mimeType: string) => {
    const supportedFileTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/svg+xml',
        'image/webp',
        'image/x-icon',
        'image/bmp',
        'image/tiff',
    ]
    return supportedFileTypes.includes(mimeType)
}

export const useFiles = (
    feature: string,
    handlers: Record<string, HandlerInfo>
) => {
    const [urls, setUrls] = useState<Record<string, string | undefined>>({})

    const fetchImage = useCallback(
        async (fileHandler: HandlerInfo) => {
            try {
                const response = await fetch(ApiRoutes.feature_file(feature), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(fileHandler),
                })

                if (!response.ok) {
                    const errorResponse = await response.json()
                    throw new Error(errorResponse.message || 'Unhandled error')
                }

                const blob = await response.blob()

                if (!isSupportedFileType(blob.type)) {
                    throw new Error('Unsupported file type')
                }

                return URL.createObjectURL(blob)
            } catch (error: any) {
                console.error(error)
            }
        },
        [feature]
    )

    useEffect(() => {
        ;(async () => {
            const newUrls: Record<string, string | undefined> = {}

            Object.entries(handlers).forEach(async ([key, handler]) => {
                newUrls[key] = await fetchImage(handler)
            })

            setUrls(newUrls)
        })()

        return () => {
            Object.values(urls).forEach((url) => {
                if (url) URL.revokeObjectURL(url)
            })
            setUrls({})
        }
    }, [])

    return urls
}
