import ReactDOM from 'react-dom/client'
import { ErrorFrame } from '../ui'
import { GlobalStateType } from '../state'
import { Api } from '../api'

type ImportCallback = (featureName: string | null) => Promise<any>

type FeatureCallback = (
    featureName: string,
    initialRoute: string,
    initialState: GlobalStateType | null
) => JSX.Element

function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search)

    return {
        featureName: urlParams.get('feature'),
        initialRoute: urlParams.get('route'),
    }
}

export function create(container: HTMLElement) {
    const urlParams = getUrlParams()

    const ErrorFeature = (message: string) => {
        return <ErrorFrame message={message} />
    }

    async function getFeature(
        importCallback: ImportCallback
    ): Promise<FeatureCallback> {
        const featureName = urlParams.featureName

        if (!featureName) {
            throw new Error("Missing 'feature' parameter")
        }

        try {
            const feature = (await importCallback(featureName)).default
            if (!feature)
                throw new Error(
                    `Bad initialization of feature '${urlParams.featureName}'`
                )
            return feature as FeatureCallback
        } catch (error: any) {
            const errorMessage: string = error.message
            if (errorMessage.startsWith('Unknown variable dynamic import')) {
                throw new Error(`Feature '${urlParams.featureName}' not found`)
            }
            throw new Error(error.message)
        }
    }

    function insertFeature(feature: JSX.Element) {
        const Feature = () => feature

        ReactDOM.createRoot(container).render(<Feature />)
    }

    async function initFeature(feature: FeatureCallback) {
        await Api.init(urlParams.featureName!)
        const prefer_dark_theme = await Api.prefer_dark_theme()

        document.styleSheets[0].insertRule(
            `#root { color: ${prefer_dark_theme ? '#EEEEEE' : '#111111'}; }`,
            0
        )

        insertFeature(
            feature(
                urlParams.featureName!,
                urlParams.initialRoute!,
                await Api.getInitialState()
            )
        )
    }

    async function render(importCallback: ImportCallback) {
        try {
            const feature = await getFeature(importCallback)
            await initFeature(feature)
        } catch (error: any) {
            console.error(error)
            insertFeature(ErrorFeature(error.message))
        }
    }

    return { render }
}
