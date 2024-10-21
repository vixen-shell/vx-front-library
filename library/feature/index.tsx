import type { RouteItems } from '../router'
import type { GlobalStateType } from '../state'

import { Routes, useRouter, Link } from '../router'
import { GlobalState, useGlobalState } from '../state'

import {
    Api,
    useTask,
    useData,
    useSocket,
    useFrames,
    useParams,
    useMenu,
    SocketEventHandler,
} from '../api'

import FeatureRender from './FeatureRender'

function $<T>(name: string, reference: T) {
    if (!Feature.isInit) {
        throw new Error(`Cannot use '${name}' before feature initialization`)
    }
    return reference as T
}

export class Feature {
    static isInit: boolean = false
    static featureName: string | undefined = undefined

    static init(routes: RouteItems) {
        if (Feature.isInit) {
            throw new Error('Feature is already initialized')
        }

        Routes.define(routes)

        const feature = (
            featureName: string,
            gtkFonts: {
                font_family: string
                font_family_monospace: string
            },
            initialRoute: string,
            initialState: GlobalStateType
        ) => {
            Feature.isInit = true
            Feature.featureName = featureName
            GlobalState.initialState = initialState

            return (
                <FeatureRender
                    gtkFonts={gtkFonts}
                    initialRoute={initialRoute}
                />
            )
        }

        return feature
    }

    static get names() {
        return $<string[] | undefined>('feature names', Api.featureNames)
    }

    static get Link() {
        return $<typeof Link>('Link', Link)
    }

    static Use = {
        get Router() {
            return $<typeof useRouter>('Router', useRouter)
        },

        get State() {
            return $<typeof useGlobalState>('State', useGlobalState)
        },

        Params(paths: string[]) {
            return $<{
                get: (path: string) => any
                set: (path: string, value: any) => () => void
                save: () => () => void
            }>('Params', useParams(Feature.featureName!, paths))
        },

        Frames(feature: string = Feature.featureName!) {
            return $<{
                ids: string[]
                actives: string[]
                toggle: (frameId: string) => () => void
                open: (frameId: string) => () => void
                close: (frameId: string) => () => void
            }>('Frames', useFrames(feature))
        },

        Task() {
            return $<{
                run: (name: string, args?: any[]) => () => void
                afterRun: (callback: (data: any, error: any) => void) => void
            }>('Task', useTask())
        },

        Data() {
            return $<{
                get: (name: string, args?: any[]) => any
                stream: (name: string, args?: any[]) => any
                setInterval: (value: number) => void
            }>('Data', useData())
        },

        Menu() {
            return $<{ popup: (name: string) => () => void }>('Menu', useMenu())
        },

        Socket(name: string, auto: boolean = true) {
            return $<SocketEventHandler>(
                'Socket',
                useSocket(
                    Feature.featureName!,
                    Feature.featureName!,
                    name,
                    auto
                )
            )
        },
    }
}
