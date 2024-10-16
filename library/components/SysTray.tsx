import { useEffect, useRef } from 'react'
import { useSystray, useDbusMenu } from '../api'
import { SystemIcon } from './SystemIcon'

const SysTrayItem: React.FC<{
    item: {
        service_name: string
        icon_name: string
        tooltip: string
        status: string
    }
    iconSize: number
}> = ({ item, iconSize }) => {
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
        <div ref={divRef} onClick={() => menu.popup()}>
            <SystemIcon iconName={item.icon_name} size={iconSize} />
        </div>
    ) : (
        <></>
    )
}

export const SysTray: React.FC<{
    direction?: 'row' | 'column'
    iconSize?: number
    gap?: number
}> = ({ direction = 'row', iconSize = 16, gap = 8 }) => {
    const systray = useSystray()

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: direction,
                gap: `${gap}px`,
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
                />
            ))}
        </div>
    )
}
