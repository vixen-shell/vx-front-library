import '@mantine/core/styles.css'
import './globals.css'

import { createTheme, MantineProvider } from '@mantine/core'
import { useEffect } from 'react'
import { BaseApi, useVxState } from '../api'

export const ThemeProvider: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {
    const state = useVxState()

    useEffect(() => {
        document.documentElement.style.zoom = String(state.get('vx_ui_scale'))
    }, [state])

    return (
        <MantineProvider
            theme={createTheme({
                fontFamily: BaseApi.defaultFonts.font_family,
                fontFamilyMonospace: BaseApi.defaultFonts.font_family_monospace,
                primaryColor: state.get('vx_ui_color'),
            })}
            defaultColorScheme="auto"
        >
            {children}
        </MantineProvider>
    )
}
