import { useEffect, useRef, useState } from 'react'
import { ui } from '../../__library'
import { Feature } from '../../__library'

export default function Main() {
    const sysDataStreamer = Feature.Use.DataStreamer({
        featureName: 'welcome',
        dataHandlers: [{ name: 'cpu_usage' }, { name: 'ram_usage' }],
        interval: 2,
    })

    const hyprSocket = Feature.Use.Socket({
        featureName: 'hyprland',
        socketName: 'events',
    })

    const state = Feature.Use.State()
    const [value, setValue] = useState<any>()
    const [monitorName, setMonitorName] = useState<string>('None')
    const [activeWindow, setActiveWindow] = useState<string>('None')

    const getKeyInput = useRef<HTMLInputElement>(null)
    const setKeyInput = useRef<HTMLInputElement>(null)
    const setValueInput = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const focusedMonitor = (data: any) => {
            setMonitorName(data.monitor_name)
        }

        const activeWindow = (data: any) => {
            setActiveWindow(data.window_title)
        }

        hyprSocket.addEventListener('focusedmon', focusedMonitor)
        hyprSocket.addEventListener('activewindow', activeWindow)

        return () => {
            hyprSocket.removeEventListener('focusedmon', focusedMonitor)
            hyprSocket.removeEventListener('activewindow', activeWindow)
        }
    }, [])

    const handleGetStateItem = () => {
        const key = getKeyInput.current?.value
        setValue(state.getItem(key || ''))
    }
    const handleSetStateItem = () => {
        const key = setKeyInput.current?.value
        const value = setValueInput.current?.value

        if (key) {
            console.log(`key: ${key}, value: ${value}`)
            state.setItem(key, value)
        } else {
            console.warn('Invalid input !')
        }
    }

    return (
        <ui.Frame gap={16}>
            <p>
                {sysDataStreamer.data
                    ? sysDataStreamer.data.cpu_usage + ' %'
                    : 'None'}
            </p>
            <p>{monitorName}</p>
            <p>{activeWindow}</p>
            <h1>Hello {state.getItem('user')} !!</h1>
            <ui.Frame gap={16} direction="row" height={32}>
                <label htmlFor="get_key_input">Key: </label>
                <input ref={getKeyInput} id="get_key_input" type="text" />
                <span>Value:</span>
                <span>{value ? value : 'None'}</span>
                <button onClick={handleGetStateItem}>Get state item</button>
            </ui.Frame>
            <ui.Frame gap={16} direction="row" height={32}>
                <label htmlFor="key_input">Key: </label>
                <input ref={setKeyInput} id="key_input" type="text" />
                <label htmlFor="value_input">Value: </label>
                <input ref={setValueInput} id="value_input" type="text" />
                <button onClick={handleSetStateItem}>Set state item</button>
            </ui.Frame>
            <button onClick={state.save}>Save state</button>
        </ui.Frame>
    )
}
