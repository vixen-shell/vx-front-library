import type { EventData } from './ApiEvents'
import { useEffect, useRef, useState } from 'react'
import { Api } from './api'

const useLogListener = (): {
    logListening: boolean
    setLogListening: React.Dispatch<React.SetStateAction<boolean>>
    logData?: EventData.Log
} => {
    const [logListening, setLogListening] = useState<boolean>(false)
    const [logData, setLogData] = useState<EventData.Log | undefined>(undefined)

    const handleData = useRef<(data: EventData.Log) => void>(
        (data: EventData.Log) => setLogData(data)
    )

    useEffect(() => {
        return () => {
            if (logListening) Api.Logger.removeListener(handleData.current)
        }
    }, [])

    useEffect(() => {
        if (logListening) {
            Api.Logger.addListener(handleData.current)
        } else {
            Api.Logger.removeListener(handleData.current)
        }
    }, [logListening])

    return {
        logListening,
        setLogListening,
        logData,
    }
}

const useLogHistory = (): {
    logHistory: EventData.Log[]
    latestLog?: EventData.Log
} => {
    const { setLogListening, logData: latestLog } = useLogListener()
    const [logHistory, setLogHistory] = useState<EventData.Log[]>([])

    useEffect(() => {
        ;(async () => {
            setLogHistory(await Api.Logger.logs())
            setLogListening(true)
        })()
    }, [])

    useEffect(() => {
        if (latestLog) setLogHistory([...logHistory, latestLog])
    }, [latestLog])

    return {
        logHistory,
        latestLog,
    }
}

export { useLogListener as useLogListener, useLogHistory }
