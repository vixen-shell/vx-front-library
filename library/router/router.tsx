import { ErrorFrame } from '../components/ErrorFrame'
import React, { createContext, useState } from 'react'

export type RouteItemsType = { [key: string]: JSX.Element }

export class Routes {
    private static items: RouteItemsType | undefined = undefined

    static define(items: RouteItemsType) {
        if (!Routes.items) {
            Routes.items = items
        } else {
            console.error('Route items are already set')
        }
    }

    static get(key: string) {
        if (Routes.items && Routes.exists(key)) {
            return Routes.items[key]
        } else {
            const message = key
                ? `Route item '${key}' is not defined`
                : "Missing 'route' parameter"
            console.error(message)
            return <ErrorFrame message={message} />
        }
    }

    static exists(key: string) {
        return Routes.items && key in Routes.items
    }
}

export const RouterContext = createContext<
    | { route: string; setRoute: React.Dispatch<React.SetStateAction<string>> }
    | undefined
>(undefined)

export const RouterProvider: React.FC<{
    initialRoute: string
    children: React.ReactNode
}> = ({ initialRoute, children }) => {
    const [route, setRoute] = useState<string>(initialRoute)

    return (
        <RouterContext.Provider value={{ route, setRoute }}>
            {children}
        </RouterContext.Provider>
    )
}
