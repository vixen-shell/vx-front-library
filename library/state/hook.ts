import { useContext } from 'react'
import { GlobalStateContext } from './state'
import { Api } from '../api'

export const useGlobalState = () => {
    const context = useContext(GlobalStateContext)
    if (!context) throw new Error('The state provider is not available')

    const { state } = context

    const getItem = (key: string) => {
        return state[key]
    }

    const setItem = (key: string, value: unknown) => {
        Api.stateEvents.send_event({ id: 'SET', data: { key, value } })
    }

    const save = () => {
        Api.stateEvents.send_event({ id: 'SAVE' })
    }

    return { getItem, setItem, save }
}
