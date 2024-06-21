import styles from './index.module.css'
import { Feature } from '../../__library'
import { useEffect, useState } from 'react'

export default function Main() {
    const [windowTitle, setWindowTitle] = useState<string>('None')
    const sysInfos = Feature.Use.DataStreamer({
        featureName: 'system',
        dataHandlers: [{ name: 'cpu_usage' }, { name: 'ram_usage' }],
    })

    const hyprSocket = Feature.Use.Socket({
        featureName: 'hyprland',
        socketName: 'events',
    })

    useEffect(() => {
        const onActiveWindow = (data: any) => {
            setWindowTitle(data.window_title)
        }

        hyprSocket.addEventListener('activewindow', onActiveWindow)

        return () => {
            hyprSocket.removeEventListener('activewindow', onActiveWindow)
        }
    }, [hyprSocket])

    return (
        <div className={styles.main_wrapper}>
            <div className={styles.panel_wrapper}>
                <div
                    style={{
                        display: 'flex',
                        gap: '4px',
                        color: '#cccccc',
                        fontFamily: 'Fira Code',
                        fontSize: '13px',
                    }}
                >
                    <p style={{ marginLeft: '32px' }}>
                        <b>Window: </b>
                        {windowTitle}
                    </p>
                </div>
                <div></div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <p>
                        <b>CPU:</b> {sysInfos.data.cpu_usage}%
                    </p>
                    <p>
                        <b>RAM:</b> {sysInfos.data.ram_usage}%
                    </p>
                </div>
            </div>
        </div>
    )
}
