import { GlobalStateProvider } from '../state'
import { RouterProvider, RouterRender } from '../router'
import { HyprEvents } from '../api'

import React, { useEffect } from 'react'

const FeatureRender: React.FC<{
    initialRoute: string
    hyprEvents: boolean
}> = ({ initialRoute, hyprEvents }) => {
    useEffect(() => {
        if (hyprEvents) {
            HyprEvents.startListening()
        }

        return () => {
            if (hyprEvents) {
                HyprEvents.stopListening()
            }
        }
    }, [])

    return (
        <GlobalStateProvider>
            <RouterProvider initialRoute={initialRoute}>
                <RouterRender />
            </RouterProvider>
        </GlobalStateProvider>
    )
}

export default FeatureRender
