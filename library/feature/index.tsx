import type { RouteItems } from '../router'
import type { GlobalStateType } from '../state'

import { Routes, useRouter, RouterLink } from '../router'
import { GlobalState, useGlobalState } from '../state'
import { Api, useLogListener, useLogHistory, useHyprEvent } from '../api'

import FeatureRender from './FeatureRender'

function $<T>(name: string, reference: T) {
    if (!Feature.isInit) {
        throw new Error(`Cannot use '${name}' before feature initialization`)
    }
    return reference as T
}

export class Feature {
    static isInit: boolean = false
    static hyprEvents: boolean = false

    static init(routes: RouteItems, hyprEvents: boolean = false) {
        if (Feature.isInit) {
            throw new Error('Feature is already initialized')
        }

        Routes.define(routes)

        const feature = (
            initialRoute: string,
            initialState: GlobalStateType
        ) => {
            GlobalState.initialState = initialState
            return (
                <FeatureRender
                    initialRoute={initialRoute}
                    hyprEvents={hyprEvents}
                />
            )
        }

        Feature.hyprEvents = hyprEvents
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
        get HyprEvent() {
            const use = $<typeof useHyprEvent>('HyprEvent', useHyprEvent)

            if (!Feature.hyprEvents) {
                throw new Error(
                    "Cannot use 'HyprEvent'. To use it, please set the hyprEvents option to 'true' when initializing the feature"
                )
            }

            return use
        },
    }

    static get Link() {
        return $<typeof RouterLink>('Link', RouterLink)
    }

    static get log() {
        return $<typeof Api.logger.log>('log', Api.logger.log)
    }

    // static get Events() {
    //     return $<typeof Api.events>('Events', Api.events)
    // }
}
