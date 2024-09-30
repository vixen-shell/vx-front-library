import { ApiRoutes } from './ApiRoutes'
import { SocketEventHandler } from './SocketEventHandler'
import { GlobalStateType } from '../state'

async function request(route: string, force: boolean = false) {
    if (!force && !Api.isInit) throw new Error('Api not initialized')

    const response = await fetch(route)

    if (!response.ok) {
        const errorResponse = await response.json()
        throw new Error(errorResponse.message || 'Request Error')
    }

    return await response.json()
}

export class Api {
    static featureNames: string[] | undefined = undefined
    static currentFeatureName: string | undefined = undefined
    private static _stateEvents: SocketEventHandler | undefined = undefined
    private static _isInit: boolean = false

    static async init(featureName: string) {
        if (!(await Api.ping())) throw new Error('Unable to acces Vixen Api.')

        Api.featureNames = (await request(ApiRoutes.features_names, true))
            .names as string[]

        Api.currentFeatureName = featureName

        Api._stateEvents = new SocketEventHandler(
            ApiRoutes.feature_state_socket(Api.currentFeatureName)
        )
        Api._stateEvents.connect()

        Api._isInit = true
    }

    static get isInit() {
        return Api._isInit
    }

    static async ping(): Promise<boolean> {
        try {
            if (!(await fetch(ApiRoutes.ping)).ok) return false
            return true
        } catch {
            return false
        }
    }

    static get stateEvents() {
        if (Api._stateEvents) return Api._stateEvents
        throw new Error('Api not initialized')
    }

    static async getInitialState(): Promise<GlobalStateType | null> {
        const initialState = (
            await request(ApiRoutes.feature_state(Api.currentFeatureName!))
        ).state

        return (initialState as GlobalStateType) || null
    }

    static async getInitialTheme(): Promise<{
        font_family: string
        font_family_monospace: string
        ui_scale: number
        ui_color: string
    }> {
        return await request(ApiRoutes.vx_theme)
    }
}
