import { useCallback, useEffect, useState } from 'react'
import { ApiRoutes } from '../ApiRoutes'

export interface HandlerInfo {
    name: string
    args?: any[]
}

const isSupportedImageType = (mimeType: string) => {
    const supportedImageTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/svg+xml',
        'image/webp',
        'image/x-icon',
        'image/bmp',
        'image/tiff',
    ]
    return supportedImageTypes.includes(mimeType)
}

export const useImageFiles = (
    featureName: string,
    fileHandlers: Record<string, HandlerInfo>
) => {
    const [urls, setUrls] = useState<Record<string, string | undefined>>({})

    const fetchImage = useCallback(
        async (fileHandler: HandlerInfo) => {
            try {
                const response = await fetch(
                    ApiRoutes.feature_file(featureName),
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(fileHandler),
                    }
                )

                if (!response.ok) {
                    const errorResponse = await response.json()
                    throw new Error(errorResponse.message || 'Unhandled error')
                }

                const blob = await response.blob()

                if (!isSupportedImageType(blob.type)) {
                    throw new Error('Unsupported file type')
                }

                return URL.createObjectURL(blob)
            } catch (error: any) {
                console.error(error)
            }
        },
        [featureName]
    )

    useEffect(() => {
        ;(async () => {
            const newUrls: Record<string, string | undefined> = {}

            Object.entries(fileHandlers).forEach(async ([key, handler]) => {
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
