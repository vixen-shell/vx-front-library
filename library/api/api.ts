import { ApiRoutes } from './ApiRoutes'
import { SocketEventHandler, SocketEventData } from './SocketEventHandler'
import { dayjsLocaleImporters } from '../theme/locale'

interface DefaultFonts {
    font_family: string
    font_family_monospace: string
}

async function request(route: string) {
    const response = await fetch(route)

    if (!response.ok) {
        const errorResponse = await response.json()
        throw new Error(errorResponse.message || 'Request Error')
    }

    return await response.json()
}

async function fetchLocales() {
    const response = await fetch(
        ApiRoutes.feature_data(BaseApi.urlParams.feature),
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data_name: 'locales',
                handler_name: '__locales__',
            }),
        }
    )

    if (!response.ok) {
        const errorResponse = await response.json()
        throw new Error(errorResponse.message)
    }

    return await response.json()
}

export class BaseApi {
    private static _isInit: boolean = false
    private static _features: string[] | undefined = undefined
    private static _initialState: SocketEventData | undefined = undefined
    private static _stateEventHandler: SocketEventHandler | undefined =
        undefined
    private static _defaultFonts: DefaultFonts | undefined = undefined
    private static _locale: string | undefined = undefined
    private static _locales: { [key: string]: string } | undefined = undefined

    static async init() {
        if (!(await BaseApi.ping())) {
            throw new Error('Unable to acces Vixen Api')
        }

        BaseApi._features = (await request(ApiRoutes.features_names))
            .names as string[]

        BaseApi._initialState = await request(ApiRoutes.vx_state)
        BaseApi._stateEventHandler = new SocketEventHandler(
            ApiRoutes.feature_state_socket(BaseApi.urlParams.feature)
        )
        BaseApi._defaultFonts = await request(ApiRoutes.gtk_fonts)
        BaseApi._locale = await request(ApiRoutes.locale)
        BaseApi._locales = (await fetchLocales()).locales

        BaseApi._isInit = true
    }

    static async ping(): Promise<boolean> {
        try {
            if (!(await fetch(ApiRoutes.ping)).ok) return false
            return true
        } catch {
            return false
        }
    }

    static get isInit() {
        return BaseApi._isInit
    }

    static get features() {
        if (!BaseApi._isInit) {
            throw new Error('Api not initialized')
        }
        return BaseApi._features!
    }

    static get urlParams() {
        const urlParams = new URLSearchParams(window.location.search)
        const feature = urlParams.get('feature')
        const frame = urlParams.get('frame')
        const route = urlParams.get('route')

        if (!feature) throw new Error("Unable to find url parameter 'feature'")
        if (!frame) throw new Error("Unable to find url parameter 'frame'")
        if (!route) throw new Error("Unable to find url parameter 'route'")

        return { feature, frame, route }
    }

    static get state() {
        if (!BaseApi._isInit) {
            throw new Error('Api not initialized')
        }
        return {
            initial: BaseApi._initialState!,
            eventHandler: BaseApi._stateEventHandler!,
        }
    }

    static get defaultFonts() {
        if (!BaseApi._isInit) {
            throw new Error('Api not initialized')
        }
        return BaseApi._defaultFonts!
    }

    static get locales() {
        if (!BaseApi._isInit) {
            throw new Error('Api not initialized')
        }
        return BaseApi._locales!
    }

    static locale(dayjs: boolean = false) {
        if (!BaseApi._isInit) {
            throw new Error('Api not initialized')
        }

        if (!dayjs) return BaseApi._locale!

        const [script, region] = BaseApi._locale!.toLowerCase().split('_')

        return `${script}-${region}` in dayjsLocaleImporters
            ? `${script}-${region}`
            : script in dayjsLocaleImporters
            ? script
            : 'en'
    }
}
