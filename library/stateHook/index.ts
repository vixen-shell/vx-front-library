import { useContext } from 'react'
import { GlobalStateContext } from '../state'
import { BaseApi } from '../api'

export const useVxState = () => {
    const context = useContext(GlobalStateContext)
    if (!context) throw new Error('The state provider is not available')

    const { state } = context

    const getStateItemCopy = (key: string) => {
        return JSON.parse(JSON.stringify(state[key]))
    }

    const setStateItem = (
        key: string,
        value: any | ((prevValue: any) => any)
    ) => {
        BaseApi.state.eventHandler.send_event({
            id: 'SET',
            data: {
                key,
                value: typeof value === 'function' ? value(state[key]) : value,
            },
        })
    }

    const saveState = () => {
        BaseApi.state.eventHandler.send_event({ id: 'SAVE' })
    }

    const saveStateItems = (keys: string[]) => {
        BaseApi.state.eventHandler.send_event({
            id: 'SAVE_ITEMS',
            data: { keys },
        })
    }

    return {
        state,
        getStateItemCopy,
        setStateItem,
        saveState,
        saveStateItems,
    }
}
