import { GlobalStateProvider } from '../state'
import { RouterProvider, RouterRender } from '../router'
import { ThemeProvider } from '../theme'

const FeatureRender: React.FC<{
    initialRoute: string
}> = ({ initialRoute }) => {
    return (
        <GlobalStateProvider>
            <ThemeProvider>
                <RouterProvider initialRoute={initialRoute}>
                    <RouterRender />
                </RouterProvider>
            </ThemeProvider>
        </GlobalStateProvider>
    )
}

export default FeatureRender
