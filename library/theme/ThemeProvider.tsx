import '@mantine/core/styles.css'
import './globals.css'

import { createTheme, MantineProvider } from '@mantine/core'
import { useGlobalState } from '../state'
import { useEffect } from 'react'

interface ThemeProviderProps {
    fonts: {
        font_family: string
        font_family_monospace: string
    }
    children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
    fonts,
    children,
}) => {
    const { getItem } = useGlobalState()

    useEffect(() => {
        document.documentElement.style.zoom = String(getItem('vx_ui_scale'))
    }, [getItem])

    return (
        <MantineProvider
            theme={createTheme({
                fontFamily: fonts.font_family,
                fontFamilyMonospace: fonts.font_family_monospace,
                primaryColor: getItem('vx_ui_color'),
            })}
            defaultColorScheme="auto"
        >
            {children}
        </MantineProvider>
    )
}
