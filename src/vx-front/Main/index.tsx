import { useRef, useState } from 'react'
import { ui } from '../../__library'
import { Feature } from '../../__library'

export default function Main() {
    const { getStateItem, setStateItem, saveState } = Feature.Use.State()
    const [value, setValue] = useState<any>()

    const getKeyInput = useRef<HTMLInputElement>(null)
    const setKeyInput = useRef<HTMLInputElement>(null)
    const setValueInput = useRef<HTMLInputElement>(null)

    const handleGetStateItem = () => {
        const key = getKeyInput.current?.value
        setValue(getStateItem(key || ''))
    }
    const handleSetStateItem = () => {
        const key = setKeyInput.current?.value
        const value = setValueInput.current?.value

        if (key) {
            console.log(`key: ${key}, value: ${value}`)
            setStateItem(key, value)
        } else {
            console.warn('Invalid input !')
        }
    }

    return (
        <ui.Frame gap={16}>
            <h1>Hello {getStateItem('user')} !!</h1>
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
            <button onClick={saveState}>Save state</button>
        </ui.Frame>
    )
}
