import { useCallback, useEffect, useState } from 'react'
import { BaseApi } from '../api'
import dayjs from 'dayjs'

export const useTime = (
    defaultFormat: string = 'YYYY-MM-DD HH:mm:ss',
    stream: boolean = true
) => {
    const [time, setTime] = useState<string>('')

    useEffect(() => {
        dayjs.locale(BaseApi.locale(true))

        if (!stream) {
            setTime(dayjs().format(defaultFormat))
        } else {
            const i = setInterval(() => {
                setTime(dayjs().format(defaultFormat))
            }, 1000)

            return () => clearInterval(i)
        }
    }, [defaultFormat, stream])

    const now = useCallback(
        (format: string | undefined = undefined) => {
            const now = dayjs().format(format || defaultFormat)
            if (!stream) setTime(now)
            return now
        },
        [defaultFormat, stream]
    )

    return { time, now }
}
