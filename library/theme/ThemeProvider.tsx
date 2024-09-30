import '@mantine/core/styles.css'
import './globals.css'

import { createTheme, MantineProvider } from '@mantine/core'
import { createContext, useState } from 'react'

interface ThemeContextProps {
    setThemeColor: (color: string) => void
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(
    undefined
)

interface ThemeProviderProps {
    initialTheme: {
        font_family: string
        font_family_monospace: string
        ui_scale: number
        ui_color: string
    }
    children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
    initialTheme,
    children,
}) => {
    const [theme, setTheme] = useState(
        createTheme({
            fontFamily: initialTheme.font_family,
            fontFamilyMonospace: initialTheme.font_family_monospace,
            primaryColor: initialTheme.ui_color,
        })
    )

    const setThemeColor = (color: string) => {
        setTheme(
            createTheme({
                primaryColor: color,
                fontFamily: initialTheme.font_family,
            })
        )
    }

    return (
        <ThemeContext.Provider value={{ setThemeColor }}>
            <MantineProvider theme={theme} defaultColorScheme="auto">
                {children}
            </MantineProvider>
        </ThemeContext.Provider>
    )
}
