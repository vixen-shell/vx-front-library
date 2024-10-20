import { useEffect, useRef, useState } from 'react'
import { ApiRoutes } from '../api/ApiRoutes'
import { ImageBroken } from './ImageBroken'
import { useGlobalState } from '../state'

interface PhosphorIconProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
    iconName: string
    style?: React.CSSProperties
    iconStyle?: 'bold' | 'duotone' | 'fill' | 'light' | 'regular' | 'thin'
    size?: string | number
    color?: string
}

async function fetchIcon(
    iconName: string,
    iconStyle:
        | 'bold'
        | 'duotone'
        | 'fill'
        | 'light'
        | 'regular'
        | 'thin'
        | undefined = undefined
): Promise<Blob> {
    const response = await fetch(ApiRoutes.phosphor_icons(iconName, iconStyle))

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

    return svgElement
}

function colorizeSvgElement(svgElement: HTMLElement, color: string) {
    svgElement.setAttribute('fill', color)
}

export const PhosphorIcon: React.FC<PhosphorIconProps> = ({
    iconName,
    style = undefined,
    iconStyle = undefined,
    size = 32,
    color = undefined,
    ...props
}) => {
    const { getItem } = useGlobalState()
    const [fetchError, setFetchError] = useState<boolean>(false)
    const [iconBlob, setIconBlob] = useState<Blob | null>(null)
    const [iStyle, setIStyle] = useState<
        'bold' | 'duotone' | 'fill' | 'light' | 'regular' | 'thin' | undefined
    >(getItem('vx_ui_icons'))
    const iconContainer = useRef<HTMLDivElement>(document.createElement('div'))

    useEffect(() => {
        if (!iconStyle) {
            setIStyle(getItem('vx_ui_icons'))
        }
    }, [getItem, iconStyle])

    useEffect(() => {
        ;(async () => {
            setFetchError(false)

            try {
                setIconBlob(await fetchIcon(iconName, iconStyle || iStyle))
            } catch (error: any) {
                console.error(error)
                setFetchError(true)
            }
        })()

        return () => setIconBlob(null)
    }, [iconName, iconStyle, iStyle])

    useEffect(() => {
        const container = iconContainer.current

        if (iconBlob) {
            ;(async () => {
                const content = createSvgElement(await blobToText(iconBlob))
                if (color) colorizeSvgElement(content, color)

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
    }, [iconBlob, size, color])

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
