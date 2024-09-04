import type { RouteItems } from '../router'
import type { GlobalStateType } from '../state'

import { Routes, useRouter, RouterLink } from '../router'
import { GlobalState, useGlobalState } from '../state'

import {
    Api,
    useTask,
    useData,
    useStream,
    useFiles,
    useSocket,
    useFrames,
    useParams,
    SocketEventHandler,
} from '../api'

import FeatureRender from './FeatureRender'

interface HandlerInfo {
    name: string
    args?: any[]
}

interface useTaskProps {
    feature?: string
    handler: HandlerInfo
}

interface useDataProps {
    feature?: string
    handlers: HandlerInfo[]
}

interface useStreamProps {
    feature?: string
    handlers: HandlerInfo[]
    interval?: number
    auto?: boolean
}

interface useFilesProps {
    feature?: string
    handlers: Record<string, HandlerInfo>
}

interface useSocketProps {
    feature?: string
    name: string
    auto?: boolean
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
            initialRoute: string,
            initialState: GlobalStateType | null
        ) => {
            Feature.isInit = true
            Feature.featureName = featureName
            if (initialState) GlobalState.initialState = initialState
            return (
                <FeatureRender
                    initialRoute={initialRoute}
                    state={Boolean(initialState)}
                />
            )
        }

        return feature
    }

    static get names() {
        return $<string[] | undefined>('feature names', Api.featureNames)
    }

    static get Link() {
        return $<typeof RouterLink>('Link', RouterLink)
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

        Task({ feature = Feature.featureName!, handler }: useTaskProps) {
            return $<{
                run: () => () => void
                isRunning: boolean
                onTerminate: (callback: (data: any, error: any) => void) => void
            }>('Task', useTask(feature, handler))
        },

        Data({ feature = Feature.featureName!, handlers }: useDataProps) {
            return $<{
                update: () => void
                data: Record<string, any>
            }>('Data', useData(feature, handlers))
        },

        Stream({
            feature = Feature.featureName!,
            handlers,
            interval = 1,
            auto = true,
        }: useStreamProps) {
            return $<{
                data: Record<string, any>
                start: () => void
                stop: () => void
            }>(
                'Stream',
                useStream(
                    Feature.featureName!,
                    feature,
                    handlers,
                    interval,
                    auto
                )
            )
        },

        Files({ feature = Feature.featureName!, handlers }: useFilesProps) {
            return $<Record<string, string | undefined>>(
                'Files',
                useFiles(feature, handlers)
            )
        },

        Socket({
            feature = Feature.featureName!,
            name,
            auto = true,
        }: useSocketProps) {
            return $<SocketEventHandler>(
                'Socket',
                useSocket(Feature.featureName!, feature, name, auto)
            )
        },
    }
}
