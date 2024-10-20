import { useEffect, useRef } from 'react'
import { useSystray, useDbusMenu } from '../api'
import { SystemIcon } from './SystemIcon'

interface SysTrayProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'title'> {
    style?: React.CSSProperties
    direction?: 'row' | 'column'
    iconSize?: string | number
    gap?: string | number
    tooltip?: boolean
}

const SysTrayItem: React.FC<{
    item: {
        service_name: string
        icon_name: string
        tooltip: string
        status: string
    }
    iconSize: string | number
    tooltip?: boolean
}> = ({ item, iconSize, tooltip = false }) => {
    const menu = useDbusMenu(item.service_name)
    const divRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!divRef.current) return

        let interval: NodeJS.Timeout | null = null
        const div = divRef.current

        if (item.status === 'needsattention') {
            let visible = true

            interval = setInterval(() => {
                if (visible) {
                    div.style.opacity = '50%'
                } else {
                    div.style.opacity = '100%'
                }
                visible = !visible
            }, 1000)
        }

        return () => {
            if (interval) clearInterval(interval)
            div.style.opacity = '100%'
        }
    }, [divRef, item.status])

    return item.status !== 'passive' ? (
        <div
            ref={divRef}
            onClick={() => menu.popup()}
            title={tooltip ? item.tooltip : undefined}
        >
            <SystemIcon iconName={item.icon_name} size={iconSize} />
        </div>
    ) : (
        <></>
    )
}

export const SysTray: React.FC<SysTrayProps> = ({
    style = undefined,
    direction = undefined,
    iconSize = 16,
    gap = undefined,
    tooltip = false,
    ...props
}) => {
    const systray = useSystray()

    return (
        <div
            {...props}
            style={{
                ...style,
                display: 'flex',
                flexDirection: direction,
                gap: gap,
            }}
        >
            {systray.map((item) => (
                <SysTrayItem
                    key={item.service_name}
                    item={{
                        service_name: item.service_name,
                        icon_name: item.icon_name,
                        tooltip: item.tooltip,
                        status: item.status,
                    }}
                    iconSize={iconSize}
                    tooltip={tooltip}
                />
            ))}
        </div>
    )
}
