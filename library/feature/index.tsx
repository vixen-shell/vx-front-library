import type { RouteItems } from '../router'
import type { GlobalStateType } from '../state'
import type { DataHandlerInfo } from '../api'

import { Routes, useRouter, RouterLink } from '../router'
import { GlobalState, useGlobalState } from '../state'

import {
    useFeatureData,
    useFeatureDataStreamer,
    useFeatureSocket,
    SocketEventHandler,
} from '../api'

import FeatureRender from './FeatureRender'

interface useDataProps {
    featureName?: string
    dataHandlers: DataHandlerInfo[]
}

interface useDataStreamerProps {
    featureName?: string
    dataHandlers: DataHandlerInfo[]
    interval?: number
    auto?: boolean
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
            initialState: GlobalStateType
        ) => {
            Feature.isInit = true
            Feature.featureName = featureName
            GlobalState.initialState = initialState
            return <FeatureRender initialRoute={initialRoute} />
        }

        return feature
    }

    static Use = {
        get Router() {
            return $<typeof useRouter>('Router', useRouter)
        },

        get State() {
            return $<typeof useGlobalState>('State', useGlobalState)
        },

        Data({
            featureName = Feature.featureName!,
            dataHandlers,
        }: useDataProps) {
            return $<{
                getData: () => void
                data: Record<string, any> | undefined
            }>('Data', useFeatureData(featureName, dataHandlers))
        },

        DataStreamer({
            featureName = Feature.featureName!,
            dataHandlers,
            interval = 1,
            auto = true,
        }: useDataStreamerProps) {
            return $<{
                data: Record<string, any> | undefined
                start: () => void
                stop: () => void
            }>(
                'DataStreamer',
                useFeatureDataStreamer(
                    featureName,
                    dataHandlers,
                    interval,
                    auto
                )
            )
        },

        Socket({
            featureName = Feature.featureName!,
            socketName,
            auto = true,
        }: useSocketProps) {
            return $<SocketEventHandler>(
                'Socket',
                useFeatureSocket(featureName, socketName, auto)
            )
        },
    }

    static get Link() {
        return $<typeof RouterLink>('Link', RouterLink)
    }
}
