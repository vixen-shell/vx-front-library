import { GlobalStateProvider } from '../state'
import { RouterProvider, RouterRender } from '../router'

import React, { useEffect } from 'react'
import initFeature from './initFeature'

const FeatureRender: React.FC<{ initialRoute: string }> = ({
    initialRoute,
}) => {
    useEffect(initFeature, [])

    return (
        <GlobalStateProvider>
            <RouterProvider initialRoute={initialRoute}>
                <RouterRender />
            </RouterProvider>
        </GlobalStateProvider>
    )
}

export default FeatureRender
