import { useEffect, useRef, useState } from 'react'
import { Feature } from '../../__library'

export default function Main() {
    const icons = Feature.Use.ImageFiles({
        featureName: 'system',
        fileHandlers: {
            firefox: { name: 'icon', args: ['firefox'] },
            folder: { name: 'icon', args: ['folder', 'blue'] },
        },
    })

    const runAction = Feature.Use.Action({
        featureName: 'system',
        actionHandler: { name: 'run', args: ['rofi', ['-show', 'drun'], true] },
    })

    const testAction = Feature.Use.Action({
        featureName: 'feature_test',
        actionHandler: { name: 'hello' },
    })

    const sysDataStreamer = Feature.Use.DataStreamer({
        featureName: 'system',
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
        console.log(Feature.names)
        testAction.onTerminate((data: any, error: any) => {
            if (error) {
                console.error('Test action ERREUR !!!')
            } else {
                console.log('Test Action réussi !!!')
                console.log(data)
            }
        })

        runAction.onTerminate((data: any, error: any) => {
            if (error) {
                console.error('Run action ERREUR !!!')
            } else {
                console.log('Run Action réussi !!!')
                console.log(data)
            }
        })

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
        <div>
            <p>
                CPU: {sysDataStreamer.data.cpu_usage} | RAM:{' '}
                {sysDataStreamer.data.ram_usage}
            </p>
            <p>{monitorName}</p>
            <p>{activeWindow}</p>
            <h1>Hello {state.getItem('user')} !!</h1>
            <div>
                <label htmlFor="get_key_input">Key: </label>
                <input ref={getKeyInput} id="get_key_input" type="text" />
                <span>Value:</span>
                <span>{value ? value : 'None'}</span>
                <button onClick={handleGetStateItem}>Get state item</button>
            </div>
            <div>
                <label htmlFor="key_input">Key: </label>
                <input ref={setKeyInput} id="key_input" type="text" />
                <label htmlFor="value_input">Value: </label>
                <input ref={setValueInput} id="value_input" type="text" />
                <button onClick={handleSetStateItem}>Set state item</button>
            </div>
            <div>
                <button onClick={state.save}>Save state</button>
                <button onClick={testAction.run}>Test action</button>
                <button onClick={runAction.run}>Explorer</button>
            </div>
            <div>
                <img src={icons.firefox} width={64} />
                <img src={icons.folder} width={64} />
            </div>
        </div>
    )
}
