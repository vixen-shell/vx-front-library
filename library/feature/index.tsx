import type { RouteItems } from '../router'
import type { GlobalStateType } from '../state'

import { Routes, useRouter, RouterLink } from '../router'
import { GlobalState, useGlobalState } from '../state'

import {
    Api,
    useFeatureAction,
    useFeatureData,
    useFeatureDataStreamer,
    useImageFiles,
    useFeatureSocket,
    useFeatureFrames,
    SocketEventHandler,
} from '../api'

import FeatureRender from './FeatureRender'

export interface HandlerInfo {
    name: string
    args?: any[]
}

interface useActionProps {
    featureName?: string
    actionHandler: HandlerInfo
}

interface useDataProps {
    featureName?: string
    dataHandlers: HandlerInfo[]
}

interface useDataStreamerProps {
    featureName?: string
    dataHandlers: HandlerInfo[]
    interval?: number
    auto?: boolean
}

interface useImageFilesProps {
    featureName?: string
    fileHandlers: Record<string, HandlerInfo>
}

interface useSocketProps {
    featureName?: string
    socketName: string
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

        Frames(featureName: string = Feature.featureName!) {
            return $<{
                ids: string[]
                actives: string[]
                toggle: (frameId: string) => () => void
                open: (frameId: string) => () => void
                close: (frameId: string) => () => void
            }>('Frames', useFeatureFrames(featureName))
        },

        Action({
            featureName = Feature.featureName!,
            actionHandler,
        }: useActionProps) {
            return $<{
                run: () => () => void
                isRunning: boolean
                onTerminate: (callback: (data: any, error: any) => void) => void
            }>('Action', useFeatureAction(featureName, actionHandler))
        },

        Data({
            featureName = Feature.featureName!,
            dataHandlers,
        }: useDataProps) {
            return $<{
                update: () => void
                data: Record<string, any>
            }>('Data', useFeatureData(featureName, dataHandlers))
        },

        DataStreamer({
            featureName = Feature.featureName!,
            dataHandlers,
            interval = 1,
            auto = true,
        }: useDataStreamerProps) {
            return $<{
                data: Record<string, any>
                start: () => void
                stop: () => void
            }>(
                'DataStreamer',
                useFeatureDataStreamer(
                    Feature.featureName!,
                    featureName,
                    dataHandlers,
                    interval,
                    auto
                )
            )
        },

        ImageFiles({
            featureName = Feature.featureName!,
            fileHandlers,
        }: useImageFilesProps) {
            return $<Record<string, string | undefined>>(
                'ImageFile',
                useImageFiles(featureName, fileHandlers)
            )
        },

        Socket({
            featureName = Feature.featureName!,
            socketName,
            auto = true,
        }: useSocketProps) {
            return $<SocketEventHandler>(
                'Socket',
                useFeatureSocket(
                    Feature.featureName!,
                    featureName,
                    socketName,
                    auto
                )
            )
        },
    }
}
