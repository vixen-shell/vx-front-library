import { useContext } from 'react'
import { GlobalStateContext } from '../../state'
import { BaseApi } from '../api'

export const useVxState = () => {
    const context = useContext(GlobalStateContext)
    if (!context) throw new Error('The state provider is not available')

    const { state } = context

    const get = (key: string) => {
        return state[key]
    }

    const set = (key: string, value: unknown) => {
        BaseApi.state.eventHandler.send_event({
            id: 'SET',
            data: { key, value },
        })
    }

    const save = () => {
        BaseApi.state.eventHandler.send_event({ id: 'SAVE' })
    }

    return { get, set, save }
}
