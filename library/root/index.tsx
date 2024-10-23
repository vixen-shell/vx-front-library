import '@mantine/core/styles.css'
import ReactDOM from 'react-dom/client'
import { ErrorFrame } from '../components/ErrorFrame'
import { BaseApi } from '../api'

type ImportCallback = (featureName: string | null) => Promise<any>

type FeatureCallback = () => JSX.Element

export function create(container: HTMLElement) {
    const ErrorFeature = (message: string) => {
        return <ErrorFrame message={message} />
    }

    async function getFeature(
        importCallback: ImportCallback
    ): Promise<FeatureCallback> {
        try {
            const feature = (await importCallback(BaseApi.urlParams.feature))
                .default
            if (!feature)
                throw new Error(
                    `Bad initialization of feature '${BaseApi.urlParams.feature}'`
                )
            return feature as FeatureCallback
        } catch (error: any) {
            const errorMessage: string = error.message
            if (errorMessage.startsWith('Unknown variable dynamic import')) {
                throw new Error(
                    `Feature '${BaseApi.urlParams.feature}' not found`
                )
            }
            throw new Error(error.message)
        }
    }

    function insertFeature(feature: JSX.Element) {
        const Feature = () => feature

        ReactDOM.createRoot(container).render(<Feature />)
    }

    async function initFeature(feature: FeatureCallback) {
        await BaseApi.init()
        insertFeature(feature())
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
