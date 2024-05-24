import type { EventData } from './ApiEvents'
import type { HyprEventId } from './HyprEvents'

import { useEffect, useRef, useState } from 'react'
import { Api } from './api'
import { HyprEvents } from './HyprEvents'

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
            if (logListening) Api.logger.removeListener(handleData.current)
        }
    }, [])

    useEffect(() => {
        if (logListening) {
            Api.logger.addListener(handleData.current)
        } else {
            Api.logger.removeListener(handleData.current)
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
            setLogHistory(await Api.logger.logs())
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

const useHyprEvent = (eventId: HyprEventId): object => {
    const [value, setValue] = useState<object>({})

    const handleEvent = useRef<(data: object) => void>((data: object) => {
        setValue(data)
    })

    useEffect(() => {
        HyprEvents.addEventListener(eventId, handleEvent.current)

        return () => {
            HyprEvents.removeEventListener(eventId, handleEvent.current)
        }
    }, [])

    return value
}

export { useLogListener, useLogHistory, useHyprEvent }
