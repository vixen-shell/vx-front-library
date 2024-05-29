function uri(scheme: 'http' | 'ws', path: string) {
    const [host, port] = ['localhost', '6481']
    return `${scheme}://${host}:${port}${path}`
}

export class ApiRoutes {
    // ----------------------------------- - - -
    // BASIC ENDPOINTS

    static readonly ping = uri('http', '/ping')
    static readonly shutdown = uri('http', '/shutdown')

    // ----------------------------------- - - -
    // FEATURE ENDPOINTS

    static feature_start(featureName: string) {
        return uri('http', `/feature/${featureName}/start`)
    }
    static feature_stop(featureName: string) {
        return uri('http', `/feature/${featureName}/stop`)
    }
    static feature_state(featureName: string) {
        return uri('http', `/feature/${featureName}/state`)
    }
    static feature_data(featureName: string) {
        return uri('http', `/feature/${featureName}/data`)
    }

    // ----------------------------------- - - -
    // FEATURES ENDPOINTS

    static readonly features_names = uri('http', '/features/names')

    // ----------------------------------- - - -
    // FRAMES ENDPOINTS

    static frames_ids(featureName: string) {
        return uri('http', `/frames/${featureName}/ids`)
    }

    // ----------------------------------- - - -
    // FRAME ENDPOINTS

    static frame_toggle(featureName: string, frameId: string) {
        return uri('http', `/frames/${featureName}/toggle/${frameId}`)
    }
    static frame_open(featureName: string, frameId: string) {
        return uri('http', `/frames/${featureName}/open/${frameId}`)
    }
    static frame_close(featureName: string, frameId: string) {
        return uri('http', `/frames/${featureName}/close/${frameId}`)
    }

    // ----------------------------------- - - -
    // OS ENDPOINTS

    static readonly os_run = uri('http', '/os/run')

    static os_icon(iconName: string) {
        return uri('http', `/os/icon/${iconName}`)
    }

    // ----------------------------------- - - -
    // FEATURE WEBSOCKETS

    static feature_state_socket(featureName: string) {
        return uri('ws', `/feature/${featureName}/state`)
    }

    static feature_data_streamer(featureName: string) {
        return uri('ws', `/feature/${featureName}/data_streamer`)
    }

    static feature_socket(featureName: string, socketName: string) {
        return uri('ws', `/feature/${featureName}/sockets/${socketName}`)
    }
}
