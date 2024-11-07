import React, { createContext, useEffect, useReducer } from 'react'
import type { SocketEventData } from '../api'
import { BaseApi } from '../api'

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

export const GlobalStateContext = createContext<
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
        BaseApi.state.eventHandler.addEventListener(
            'UPDATE',
            onUpdateStateEvent
        )
        BaseApi.state.eventHandler.connect()

        return () => {
            BaseApi.state.eventHandler.removeEventListener(
                'UPDATE',
                onUpdateStateEvent
            )
            BaseApi.state.eventHandler.disconnect()
        }
    }, [])

    return (
        <GlobalStateContext.Provider value={{ state, dispatch }}>
            {children}
        </GlobalStateContext.Provider>
    )
}
