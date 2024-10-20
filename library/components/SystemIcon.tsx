import { useEffect, useRef, useState } from 'react'
import { ApiRoutes } from '../api/ApiRoutes'
import { ImageBroken } from './ImageBroken'

interface SystemIconProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
    iconName: string
    style?: React.CSSProperties
    size?: string | number
}

async function fetchIcon(iconName: string): Promise<Blob> {
    const response = await fetch(ApiRoutes.system_icons(iconName))

    if (!response.ok) {
        const errorResponse = await response.json()
        throw new Error(errorResponse.message || 'Unhandled error')
    }

    const blob = await response.blob()

    if (blob.type !== 'image/svg+xml') {
        throw new Error('Unsupported file type')
    }

    return blob
}

async function blobToText(blob: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = () => {
            resolve(reader.result as string)
        }

        reader.onerror = () => {
            reject(new Error('Error reading blob'))
        }

        reader.readAsText(blob)
    })
}

function createSvgElement(data: string) {
    const parser = new DOMParser()
    const svgElement = parser.parseFromString(
        data,
        'image/svg+xml'
    ).documentElement

    const boxWidth = svgElement.getAttribute('width')
    const boxHeight = svgElement.getAttribute('height')

    svgElement.setAttribute('viewBox', `0 0 ${boxWidth} ${boxHeight}`)

    return svgElement
}

export const SystemIcon: React.FC<SystemIconProps> = ({
    iconName,
    style = undefined,
    size = 32,
    ...props
}) => {
    const [fetchError, setFetchError] = useState<boolean>(false)
    const [iconBlob, setIconBlob] = useState<Blob | null>(null)
    const iconContainer = useRef<HTMLDivElement>(document.createElement('div'))

    useEffect(() => {
        ;(async () => {
            setFetchError(false)

            try {
                setIconBlob(await fetchIcon(iconName))
            } catch (error: any) {
                console.error(error)
                setFetchError(true)
            }
        })()

        return () => setIconBlob(null)
    }, [iconName])

    useEffect(() => {
        const container = iconContainer.current

        if (iconBlob) {
            ;(async () => {
                const content = createSvgElement(await blobToText(iconBlob))

                if (size) {
                    content.style.width = String(size)
                    content.style.height = String(size)
                }

                container.appendChild(content.cloneNode(true))
            })()
        }

        return () => {
            container.innerHTML = ''
        }
    }, [iconBlob, size])

    return fetchError ? (
        <ImageBroken size={size} color="grey" />
    ) : (
        <div
            {...props}
            style={{ ...style, width: size, height: size }}
            ref={iconContainer}
        ></div>
    )
}
