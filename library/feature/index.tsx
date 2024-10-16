import type { RouteItems } from '../router'
import type { GlobalStateType } from '../state'

import { Routes, useRouter, Link } from '../router'
import { GlobalState, useGlobalState } from '../state'

import {
    Api,
    useTask,
    useData,
    useStream,
    useSocket,
    useFrames,
    useParams,
    useMenu,
    useTooltip,
    SocketEventHandler,
} from '../api'

import FeatureRender from './FeatureRender'

interface HandlerInfo {
    name: string
    args?: any[]
}

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
                params: Record<string, any>
                setParam: (paramPath: string, value: any) => () => void
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

        Task(handler: HandlerInfo) {
            return $<{
                run: (args?: any[]) => () => void
                afterRun: (callback: (data: any, error: any) => void) => void
            }>('Task', useTask(Feature.featureName!, handler))
        },

        Data(handlers: HandlerInfo[]) {
            return $<{
                update: () => void
                data: Record<string, any>
            }>('Data', useData(Feature.featureName!, handlers))
        },

        Stream(
            handlers: HandlerInfo[],
            interval: number = 1,
            auto: boolean = true
        ) {
            return $<{
                data: Record<string, any>
                start: () => void
                stop: () => void
            }>(
                'Stream',
                useStream(
                    Feature.featureName!,
                    Feature.featureName!,
                    handlers,
                    interval,
                    auto
                )
            )
        },

        Tooltip() {
            return $<{ show: (text: string) => () => void }>(
                'Tooltip',
                useTooltip()
            )
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
