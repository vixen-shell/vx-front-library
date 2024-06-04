import { GlobalStateProvider } from '../state'
import { RouterProvider, RouterRender } from '../router'

const FeatureRender: React.FC<{ initialRoute: string; state: boolean }> = ({
    initialRoute,
    state,
}) => {
    const Render = () => (
        <RouterProvider initialRoute={initialRoute}>
            <RouterRender />
        </RouterProvider>
    )

    return state ? (
        <GlobalStateProvider>
            <Render />
        </GlobalStateProvider>
    ) : (
        <Render />
    )
}

export default FeatureRender
