import styles from './index.module.css'
import { useEffect, useState } from 'react'
import { Feature } from '../../__library'
import RealTimeClock from '../components/RealTimeClock'
import Workspaces from '../components/Workspaces'

export default function Main() {
    const [windowTitle, setWindowTitle] = useState<string>('')

    const sysInfos = Feature.Use.Stream({
        handlers: [{ name: 'cpu_usage' }, { name: 'ram_usage' }],
        interval: 2.5,
    })

    const hyprSocket = Feature.Use.Socket({
        name: 'activewindow',
    })

    useEffect(() => {
        const onActiveWindow = (data: any) => {
            setWindowTitle(data.window_title)
        }

        hyprSocket.addEventListener('activewindow', onActiveWindow)

        return () => {
            hyprSocket.removeEventListener('activewindow', onActiveWindow)
        }
    }, [])

    return (
        <div className={styles.main_wrapper}>
            <div className={styles.panel_wrapper}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                    }}
                >
                    <Workspaces />
                    <p style={{ marginLeft: '32px' }}>{windowTitle}</p>
                </div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                    }}
                >
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <p>CPU: {sysInfos.data.cpu_usage}%</p>
                        <p>RAM: {sysInfos.data.ram_usage}%</p>
                    </div>
                    <RealTimeClock />
                </div>
            </div>
        </div>
    )
}
