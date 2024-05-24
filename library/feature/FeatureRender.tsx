import { GlobalStateProvider } from '../state'
import { RouterProvider, RouterRender } from '../router'

const FeatureRender: React.FC<{ initialRoute: string }> = ({
    initialRoute,
}) => {
    return (
        <GlobalStateProvider>
            <RouterProvider initialRoute={initialRoute}>
                <RouterRender />
            </RouterProvider>
        </GlobalStateProvider>
    )
}

export default FeatureRender
