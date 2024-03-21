import type { RouteItems } from '../router'
import type { GlobalStateType } from '../state'

import { Routes, useRouter, RouterLink } from '../router'
import { GlobalState, useGlobalState } from '../state'
import { Api } from '../api'
import { useLogListener, useLogHistory } from '../api'

import FeatureRender from './FeatureRender'

function $<T>(name: string, reference: T) {
    if (!Feature.isInit) {
        throw new Error(`Cannot use '${name}' before feature initialization`)
    }
    return reference as T
}

export class Feature {
    static isInit: boolean = false

    static init(routes: RouteItems) {
        if (Feature.isInit) {
            throw new Error('Feature is already initialized')
        }

        Routes.define(routes)

        const feature = (
            initialRoute: string,
            initialState: GlobalStateType
        ) => {
            GlobalState.initialState = initialState
            return <FeatureRender initialRoute={initialRoute} />
        }

        Feature.isInit = true
        return feature
    }

    static Use = {
        get Router() {
            return $<typeof useRouter>('Router', useRouter)
        },
        get State() {
            return $<typeof useGlobalState>('State', useGlobalState)
        },
        get LogListener() {
            return $<typeof useLogListener>('LogListener', useLogListener)
        },
        get LogHistory() {
            return $<typeof useLogHistory>('LogHistory', useLogHistory)
        },
    }

    static get Link() {
        return $<typeof RouterLink>('Link', RouterLink)
    }

    static get log() {
        return $<typeof Api.Logger.log>('log', Api.Logger.log)
    }

    // static get Events() {
    //     return $<typeof Api.events>('Events', Api.events)
    // }
}
