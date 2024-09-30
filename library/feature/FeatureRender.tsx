import { GlobalStateProvider } from '../state'
import { RouterProvider, RouterRender } from '../router'
import { ThemeProvider } from '../theme'

const FeatureRender: React.FC<{
    initialTheme: {
        font_family: string
        font_family_monospace: string
        ui_scale: number
        ui_color: string
    }
    initialRoute: string
    state: boolean
}> = ({ initialTheme, initialRoute, state }) => {
    const BaseRender = () => (
        <RouterProvider initialRoute={initialRoute}>
            <RouterRender />
        </RouterProvider>
    )

    const Render = state
        ? () => (
              <GlobalStateProvider>
                  <BaseRender />
              </GlobalStateProvider>
          )
        : BaseRender

    return (
        <ThemeProvider initialTheme={initialTheme}>
            <Render />
        </ThemeProvider>
    )
}

export default FeatureRender
