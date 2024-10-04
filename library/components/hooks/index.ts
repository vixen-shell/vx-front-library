import { useEffect, useState } from 'react'
import { ApiRoutes } from '../../api/ApiRoutes'

async function fetchImage(filePath: string) {
    const response = await fetch(ApiRoutes.image_file(filePath))

    if (!response.ok) {
        const errorResponse = await response.json()
        throw new Error(errorResponse.message || 'Unhandled error')
    }

    const blob = await response.blob()
    return URL.createObjectURL(blob)
}

export const useImageFile = (filePath: string) => {
    const [error, setError] = useState<boolean>(false)
    const [url, setUrl] = useState<string>('')

    useEffect(() => {
        let newUrl: string | null = null
        ;(async () => {
            setError(false)

            try {
                newUrl = await fetchImage(filePath)
                setUrl(newUrl)
            } catch (error: any) {
                console.error(error)
                setError(true)
            }
        })()

        return () => {
            if (newUrl) {
                URL.revokeObjectURL(newUrl)
                setUrl('')
            }
        }
    }, [filePath])

    return { url, error }
}
