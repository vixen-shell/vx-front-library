import { ApiRoutes } from './ApiRoutes'
import { SocketEventHandler } from './SocketEventHandler'
import { GlobalStateType } from '../state'

function $GET<T>(route: string, dataKey: string): () => Promise<T> {
    if (Api.isInit) {
        return async (): Promise<T> => {
            const response = await fetch(route)

            if (!response.ok) {
                try {
                    const data = await response.json()
                    throw new Error(data.message)
                } catch (error: any) {
                    throw new Error(error.message)
                }
            }

            const data: any = await response.json()

            if (dataKey in data) {
                return data[dataKey] as T
            } else {
                throw new Error(`Unable to acces ${dataKey}`)
            }
        }
    }
    throw new Error('Api not initialized')
}

export class Api {
    static currentFeatureName: string | undefined = undefined
    private static _stateEvents: SocketEventHandler | undefined = undefined
    private static _isInit: boolean = false

    static async init(featureName: string) {
        if (!(await Api.ping())) throw new Error('Unable to acces Vixen Api.')

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

    static async ping(): Promise<Boolean> {
        try {
            if (!(await fetch(ApiRoutes.ping)).ok) return false
            return true
        } catch (error) {
            return false
        }
    }

    static get stateEvents() {
        if (Api._stateEvents) return Api._stateEvents
        throw new Error('Api not initialized')
    }

    static get featureState() {
        return $GET<GlobalStateType>(
            ApiRoutes.feature_state(Api.currentFeatureName!),
            'state'
        )
    }
}
