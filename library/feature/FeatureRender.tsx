import { GlobalStateProvider } from '../state'
import { RouterProvider, RouterRender } from '../router'
import { ThemeProvider } from '../theme'

const FeatureRender: React.FC<{
    gtkFonts: {
        font_family: string
        font_family_monospace: string
    }
    initialRoute: string
}> = ({ gtkFonts, initialRoute }) => {
    return (
        <GlobalStateProvider>
            <ThemeProvider fonts={gtkFonts}>
                <RouterProvider initialRoute={initialRoute}>
                    <RouterRender />
                </RouterProvider>
            </ThemeProvider>
        </GlobalStateProvider>
    )
}

export default FeatureRender
