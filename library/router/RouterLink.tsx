import { useRouter } from './hook'

export const RouterLink: React.FC<{
    className?: string
    route: string
    children: React.ReactNode
}> = ({ className, route, children }) => {
    const { setRoute } = useRouter()

    return (
        <div
            className={`ui_link ${className}`}
            style={{ cursor: 'pointer' }}
            onClick={() => setRoute(route)}
        >
            {children}
        </div>
    )
}
