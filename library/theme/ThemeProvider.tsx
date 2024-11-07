import '@mantine/core/styles.css'

import { createTheme, MantineProvider } from '@mantine/core'
import { useEffect } from 'react'
import { BaseApi } from '../api'
import { useVxState } from '../stateHook'

export const ThemeProvider: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {
    const state = useVxState()

    useEffect(() => {
        document.documentElement.style.zoom = String(state.get.vx_ui_scale)
    }, [state.get.vx_ui_scale])

    return (
        <MantineProvider
            theme={createTheme({
                fontFamily:
                    state.get.vx_ui_font_family ||
                    BaseApi.defaultFonts.font_family,
                fontFamilyMonospace:
                    state.get.vx_ui_font_family_monospace ||
                    BaseApi.defaultFonts.font_family_monospace,
                primaryColor: state.get.vx_ui_color,
            })}
            defaultColorScheme={state.get.vx_ui_color_scheme || 'auto'}
        >
            {children}
        </MantineProvider>
    )
}
