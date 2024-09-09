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

        const gtkDarkTheme = await Api.gtkDarkTheme()
        const gtkDefaultFont = await Api.gtkDefaultFont()

        const defaultFontFamily = gtkDefaultFont.font_family || 'sans-serif'
        const defaultFontSize = gtkDefaultFont.font_size || 12
        const defaultColorFont = gtkDarkTheme ? '255, 255, 255' : '0, 0, 0'

        const style = document.createElement('style')

        style.textContent = `
            :root {
                --default-font-family: ${defaultFontFamily};
                --default-font-size: ${defaultFontSize}pt;
                --default-font-color: rgba(${defaultColorFont}, 0.8);

                font-family: var(--default-font-family);
                font-size: var(--default-font-size);
                color: var(--default-font-color);

                user-select: none !important;
                -webkit-user-select: none !important;
            }
            
            * {
                box-sizing: border-box;
                cursor: default;
                margin: 0;
            }
        `

        document.head.appendChild(style)

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
