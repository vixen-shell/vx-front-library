import { useContext } from 'react'
import { GlobalStateContext } from '../state'
import { BaseApi } from '../api'

export const useVxState = () => {
    const context = useContext(GlobalStateContext)
    if (!context) throw new Error('The state provider is not available')

    const { state } = context

    const getCopy = (key: string) => {
        return JSON.parse(JSON.stringify(state[key]))
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

    const saveItem = (key: string) => {
        BaseApi.state.eventHandler.send_event({
            id: 'SAVE_ITEM',
            data: { key },
        })
    }

    return {
        get get() {
            return state
        },
        getCopy,
        set,
        save,
        saveItem,
    }
}
