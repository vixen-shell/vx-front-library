import type { RouteItems } from '../router'

import { Routes, useRouter, Link } from '../router'
import { GlobalState } from '../state'
import { useVxState } from '../stateHook'

import {
    BaseApi,
    useTask,
    useData,
    useSocket,
    useFrames,
    useParams,
    useMenu,
} from '../api'

import { usePopupFrame } from './PopupHooks'

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

        const feature = () => {
            Feature.isInit = true
            GlobalState.initialState = BaseApi.state.initial

            return <FeatureRender initialRoute={BaseApi.urlParams.route} />
        }

        return feature
    }

    static get names() {
        return $<typeof BaseApi.features>('feature names', BaseApi.features)
    }

    static get current() {
        return $<typeof BaseApi.urlParams>('feature names', BaseApi.urlParams)
    }

    static get Link() {
        return $<typeof Link>('Link', Link)
    }

    static Use = {
        get Router() {
            return $<typeof useRouter>('Router', useRouter)
        },

        get State() {
            return $<typeof useVxState>('State', useVxState)
        },

        get Params() {
            return $<typeof useParams>('Params', useParams)
        },

        get Frames() {
            return $<typeof useFrames>('Frames', useFrames)
        },

        get Task() {
            return $<typeof useTask>('Task', useTask)
        },

        get Data() {
            return $<typeof useData>('Data', useData)
        },

        get Menu() {
            return $<typeof useMenu>('Menu', useMenu)
        },

        get PopupFrame() {
            return $<typeof usePopupFrame>('PopupFrame', usePopupFrame)
        },

        get Socket() {
            return $<typeof useSocket>('Socket', useSocket)
        },
    }
}
