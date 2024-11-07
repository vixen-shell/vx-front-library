import { GlobalStateProvider } from '../state'
import { RouterProvider, RouterRender } from '../router'
import { ThemeProvider } from '../theme'
import { BaseApi } from '../api'
import { PopupFrame } from './PopupFrame'

const FeatureRender: React.FC<{
    initialRoute: string
}> = ({ initialRoute }) => {
    return (
        <GlobalStateProvider>
            <ThemeProvider>
                <RouterProvider initialRoute={initialRoute}>
                    {BaseApi.urlParams.popup ? (
                        <PopupFrame>
                            <RouterRender />
                        </PopupFrame>
                    ) : (
                        <RouterRender />
                    )}
                </RouterProvider>
            </ThemeProvider>
        </GlobalStateProvider>
    )
}

export default FeatureRender
