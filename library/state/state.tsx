import React, { createContext, useContext, useEffect, useReducer } from 'react'
import type { SocketEventData } from '../api'
import { Api } from '../api'

export type GlobalStateType = SocketEventData

type ActionType = { type: string; payload: any }
type ActionsType = { [key: string]: string }
type ReducerType = (
    state: GlobalStateType,
    action: ActionType
) => GlobalStateType

export class GlobalState {
    private static _initialState: GlobalStateType | undefined = undefined
    private static _reducer: ReducerType | undefined = undefined

    static set initialState(value: GlobalStateType) {
        if (!GlobalState._initialState) {
            GlobalState._initialState = value

            const actions: ActionsType = {}
            for (const key in GlobalState._initialState) {
                actions[`update_${key}`] = key
            }

            GlobalState._reducer = (
                state: GlobalStateType,
                action: ActionType
            ) => {
                if (action.type in actions) {
                    return { ...state, [actions[action.type]]: action.payload }
                }
                return state
            }
        } else {
            console.error('Initial state is already set.')
        }
    }

    static get initialState(): GlobalStateType {
        if (GlobalState._initialState) return GlobalState._initialState
        throw new Error('State is not defined.')
    }

    static get reducer(): ReducerType {
        if (GlobalState._reducer) return GlobalState._reducer
        throw new Error('State is not defined.')
    }
}

const Context = createContext<
    { state: GlobalStateType; dispatch: React.Dispatch<ActionType> } | undefined
>(undefined)

export const GlobalStateProvider: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {
    const [state, dispatch] = useReducer(
        GlobalState.reducer,
        GlobalState.initialState
    )

    useEffect(() => {
        function onUpdateStateEvent(data: SocketEventData) {
            dispatch({
                type: `update_${data.key}`,
                payload: data.value,
            })
        }
        Api.stateEvents.addEventListener('UPDATE', onUpdateStateEvent)

        return () => {
            Api.stateEvents.removeEventListener('UPDATE', onUpdateStateEvent)
        }
    }, [])

    return (
        <Context.Provider value={{ state, dispatch }}>
            {children}
        </Context.Provider>
    )
}

export const useGlobalState = () => {
    const context = useContext(Context)
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
