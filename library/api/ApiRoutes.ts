function uri(scheme: 'http' | 'ws', path: string) {
    const [host, port] = ['localhost', '6481']
    return `${scheme}://${host}:${port}${path}`
}

export class ApiRoutes {
    // ----------------------------------- - - -
    // ENDPOINTS :: BASIC
    static readonly ping = uri('http', '/ping')
    static readonly shutdown = uri('http', '/shutdown')

    // ----------------------------------- - - -
    // ENDPOINTS :: FEATURES
    static readonly features_names = uri('http', '/features/names')

    // ----------------------------------- - - -
    // ENDPOINTS :: FEATURE
    static feature_start(featureName: string) {
        return uri('http', `/feature/${featureName}/start`)
    }
    static feature_stop(featureName: string) {
        return uri('http', `/feature/${featureName}/stop`)
    }
    static feature_state(featureName: string) {
        return uri('http', `/feature/${featureName}/state`)
    }

    // WEBSOCKETS :: FEATURE STATE
    static feature_state_socket(featureName: string) {
        return uri('ws', `/feature/${featureName}/state`)
    }

    // ----------------------------------- - - -
    // ENDPOINTS :: FEATURE CONTENTS
    static feature_action(featureName: string) {
        return uri('http', `/feature/${featureName}/action`)
    }
    static feature_data(featureName: string) {
        return uri('http', `/feature/${featureName}/data`)
    }
    static feature_file(featureName: string) {
        return uri('http', `/feature/${featureName}/file`)
    }

    // WEBSOCKETS :: FEATURE CONTENTS
    static feature_data_streamer(
        featureName: string,
        targetFeatureName: string
    ) {
        return uri(
            'ws',
            `/feature/${featureName}/data_streamer/${targetFeatureName}`
        )
    }

    static feature_socket(
        featureName: string,
        targetFeatureName: string,
        socketName: string
    ) {
        return uri(
            'ws',
            `/feature/${featureName}/sockets/${targetFeatureName}/${socketName}`
        )
    }

    // ----------------------------------- - - -
    // ENDPOINTS :: FRAMES
    static frames_ids(featureName: string) {
        return uri('http', `/frames/${featureName}/ids`)
    }

    // ----------------------------------- - - -
    // ENDPOINTS :: FRAME
    static frame_toggle(featureName: string, frameId: string) {
        return uri('http', `/frame/${featureName}/toggle/${frameId}`)
    }
    static frame_open(featureName: string, frameId: string) {
        return uri('http', `/frame/${featureName}/open/${frameId}`)
    }
    static frame_close(featureName: string, frameId: string) {
        return uri('http', `/frame/${featureName}/close/${frameId}`)
    }
}
