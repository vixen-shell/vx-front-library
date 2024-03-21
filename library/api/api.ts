import { ApiRoutes } from './ApiRoutes'
import { ApiEvents, EventData } from './ApiEvents'
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

class Logger {
    private static _logListener: boolean = false

    private static get logListener() {
        return Logger._logListener
    }

    private static set logListener(value: boolean) {
        const setLogListener = async (value: boolean) => {
            const logListenerState = $GET<boolean>(
                Api.routes.FEATURE_LOG_LISTENER,
                'log_listener'
            )
            const toggleLogListener = $GET<boolean>(
                Api.routes.FEATURE_LOG_LISTENER_TOGGLE,
                'log_listener'
            )
            if ((await logListenerState()) !== value) {
                await toggleLogListener()
            }
        }

        setLogListener(value)
        Logger._logListener = value
    }

    static async log(log: EventData.Log) {
        Api.events.send({ id: 'LOG', data: log })
    }

    static get logs() {
        return $GET<EventData.Log[]>(Api.routes.LOGS, 'logs')
    }

    static addListener(callback: (data: EventData.Log) => void) {
        if (!Logger.logListener) Logger.logListener = true
        Api.events.addListener('LOG', callback)
    }

    static removeListener(callback: (data: EventData.Log) => void) {
        Api.events.removeListener('LOG', callback)
        if (!Api.events.hasListeners('LOG') && Logger.logListener) {
            Logger.logListener = false
        }
    }
}

export class Api {
    private static _routes: ApiRoutes | undefined = undefined
    private static _events: ApiEvents | undefined = undefined
    private static _isInit: boolean = false

    static async init(featureName: string, clientId: string) {
        if (!(await Api.ping())) throw new Error('Unable to acces Vixen Api.')
        Api._routes = new ApiRoutes(featureName, clientId)
        Api._events = new ApiEvents(Api._routes.FEATURE_PIPE)
        Api._isInit = true
    }

    static get isInit() {
        return Api._isInit
    }

    static async ping(): Promise<Boolean> {
        try {
            if (!(await fetch(ApiRoutes.PING)).ok) return false
            return true
        } catch (error) {
            return false
        }
    }

    static get events() {
        if (Api._events) return Api._events
        throw new Error('Api not initialized')
    }

    static get routes() {
        if (Api._routes) return Api._routes
        throw new Error('Api not initialized')
    }

    static get featureState() {
        return $GET<GlobalStateType>(Api.routes.FEATURE_STATE, 'state')
    }

    static Logger = Logger
}
