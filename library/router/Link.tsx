import { useRouter } from './hook'

export const Link: React.FC<{
    route: string
    children: React.ReactNode
}> = ({ route, children }) => {
    const { setRoute } = useRouter()

    return (
        <div
            style={{ cursor: 'pointer !important' }}
            onClick={() => setRoute(route)}
        >
            {children}
        </div>
    )
}
