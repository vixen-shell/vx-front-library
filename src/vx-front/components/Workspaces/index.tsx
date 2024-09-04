import { useEffect, useState } from 'react'
import { Feature } from '../../../__library'
import SvgComponent from '../SvgComponent'
import full_square from '../../assets/icons/full_square.svg'
import empty_square from '../../assets/icons/empty_square.svg'

interface WsInfos {
    active_monitor_id: number
    active_workspace_name: string
    workspaces_length: number
    workspace_names: string[]
}

const Workspaces = () => {
    const [wsInfos, setwsInfo] = useState<WsInfos>()
    const wsSocket = Feature.Use.Socket({ name: 'workspaces' })

    useEffect(() => {
        const updateWsInfo = (data: any) => {
            console.log(data)
            setwsInfo(data)
        }

        wsSocket.addEventListener('workspace_count', updateWsInfo)

        return () => {
            wsSocket.removeEventListener('workspace_count', updateWsInfo)
        }
    })

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
            }}
        >
            {wsInfos?.workspace_names.map((name: string, index: number) => (
                <SvgComponent
                    key={`ws_icon-${index}`}
                    src={
                        wsInfos.active_workspace_name === name
                            ? full_square
                            : empty_square
                    }
                    size={20}
                    color="#008080"
                />
            ))}
        </div>
    )
}

export default Workspaces
