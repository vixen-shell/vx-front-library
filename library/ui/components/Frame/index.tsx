import csstype from 'csstype'

type Direction = 'row' | 'column'
type Dimension = number | { ratio: number }

function getDirection(direction: Direction, reverse: boolean) {
    return `${direction}${
        reverse ? '-reverse' : ''
    }` as csstype.Property.FlexDirection
}

function getDimension(dimension: Dimension | undefined) {
    if (typeof dimension === 'number') {
        return `${dimension}px`
    } else if (typeof dimension === 'object') {
        if ('ratio' in dimension) return `${dimension.ratio}%`
    }
    return '100%'
}

interface Props {
    children: React.ReactNode
    className?: string
    direction?: Direction
    reverse?: boolean
    justifyContent?: csstype.Property.JustifyContent
    alignItems?: csstype.Property.AlignItems
    width?: Dimension
    height?: Dimension
    padding?: number
    gap?: number
    overflow?: boolean
}

export default function Frame({
    children,
    className,
    direction = 'column',
    reverse = false,
    justifyContent = 'center',
    alignItems = 'center',
    width,
    height,
    padding = 0,
    gap = 0,
    overflow = false,
}: Props) {
    return (
        <div
            className={`ui_frame ${className}`}
            style={{
                display: 'flex',
                flexDirection: getDirection(direction, reverse),
                width: getDimension(width),
                height: getDimension(height),
                justifyContent: justifyContent,
                alignItems: alignItems,
                padding: `${padding}px`,
                gap: `${gap}px`,
                overflow: overflow ? 'auto' : 'hidden',
            }}
        >
            {children}
        </div>
    )
}
