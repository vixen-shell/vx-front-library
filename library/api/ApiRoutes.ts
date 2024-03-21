function uri(scheme: 'http' | 'ws', path: string) {
    const [host, port] = ['localhost', '6481']
    return `${scheme}://${host}:${port}${path}`
}

export class ApiRoutes {
    private _featureName: string
    private _clientId: string

    constructor(featureName: string, clientId: string) {
        this._featureName = featureName
        this._clientId = clientId
    }

    static readonly PING = uri('http', '/ping')
    readonly LOGS = uri('http', '/logs')
    readonly LOG = uri('http', '/log')

    readonly FEATURE_NAME = uri('http', '/features/names')

    get FEATURE_START() {
        return uri('http', `/feature/${this._featureName}/start`)
    }

    get FEATURE_STOP() {
        return uri('http', `/feature/${this._featureName}/stop`)
    }

    get FEATURE_STATE() {
        return uri('http', `/feature/${this._featureName}/state`)
    }

    get FEATURE_LOG_LISTENER() {
        return uri('http', `/feature/${this._featureName}/log_listener`)
    }

    get FEATURE_LOG_LISTENER_TOGGLE() {
        return uri('http', `/feature/${this._featureName}/log_listener/toggle`)
    }

    get FEATURE_PIPE() {
        return uri('ws', `/feature/${this._featureName}/pipe/${this._clientId}`)
    }

    get FRAME_IDS() {
        return uri('http', `/frames/${this._featureName}/ids`)
    }

    FRAME_TOGGLE(frameId: string) {
        return uri('http', `/frame/${this._featureName}/toggle/${frameId}`)
    }

    FRAME_OPEN(frameId: string) {
        return uri('http', `/frame/${this._featureName}/open/${frameId}`)
    }

    FRAME_CLOSE(frameId: string) {
        return uri('http', `/frame/${this._featureName}/close/${frameId}`)
    }
}
