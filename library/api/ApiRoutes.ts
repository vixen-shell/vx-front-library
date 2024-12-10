function uri(scheme: 'http' | 'ws', path: string) {
    const [host, port] = ['localhost', '6481']
    return `${scheme}://${host}:${port}${path}`
}

export class ApiRoutes {
    // ----------------------------------- - - -
    // ENDPOINTS :: BASIC
    static readonly ping = uri('http', '/ping')
    static readonly shutdown = uri('http', '/shutdown')
    static readonly gtk_fonts = uri('http', '/gtk_fonts')
    static readonly locale = uri('http', '/locale')
    static readonly vx_state = uri('http', '/vx_state')

    static system_icons(iconName: string) {
        return uri('http', `/system_icons/${iconName}`)
    }

    static phosphor_icons(
        iconName: string,
        iconStyle:
            | 'bold'
            | 'duotone'
            | 'fill'
            | 'light'
            | 'regular'
            | 'thin'
            | undefined = undefined
    ) {
        const params = iconStyle ? `?icon_style=${iconStyle}` : ''
        return uri('http', `/phosphor_icons/${iconName}/${params}`)
    }

    static image_file(filePath: string) {
        return uri('http', `/image_file/?filepath=${filePath}`)
    }

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
    static feature_get_param(featureName: string, paramPath: string) {
        return uri('http', `/feature/${featureName}/get_param/${paramPath}`)
    }
    static feature_set_param(featureName: string, paramPath: string) {
        return uri('http', `/feature/${featureName}/set_param/${paramPath}`)
    }
    static feature_save_params(featureName: string) {
        return uri('http', `/feature/${featureName}/save_params`)
    }

    // ----------------------------------- - - -
    // ENDPOINTS :: FEATURE CONTENTS
    static feature_action(featureName: string) {
        return uri('http', `/feature/${featureName}/action`)
    }
    static feature_data(featureName: string) {
        return uri('http', `/feature/${featureName}/data`)
    }
    static feature_menu(featureName: string) {
        return uri('http', `/feature/${featureName}/menu`)
    }
    static feature_dbus_menu(featureName: string) {
        return uri('http', `/feature/${featureName}/dbus_menu`)
    }

    // WEBSOCKETS :: FEATURE CONTENTS
    static feature_state_socket(featureName: string) {
        return uri('ws', `/feature/${featureName}/state`)
    }
    static feature_systray_socket(featureName: string) {
        return uri('ws', `/feature/${featureName}/systray`)
    }
    static feature_frames_socket(featureName: string) {
        return uri('ws', `/feature/${featureName}/frames`)
    }
    static feature_data_streamer_socket(featureName: string) {
        return uri('ws', `/feature/${featureName}/data_streamer`)
    }
    static feature_socket(featureName: string, socketName: string) {
        return uri('ws', `/feature/${featureName}/sockets/${socketName}`)
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
    static popup_frame_show(featureName: string) {
        return uri('http', `/popup_frame/${featureName}/show`)
    }
    static readonly popup_frame_hide = uri('http', '/popup_frame/hide')
}
