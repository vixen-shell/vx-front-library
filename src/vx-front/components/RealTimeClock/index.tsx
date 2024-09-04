import React, { useState, useEffect } from 'react'

function getCurrentDateTime(): string {
    const now = new Date()

    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')

    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const RealTimeClock: React.FC = () => {
    const [dateTime, setDateTime] = useState<string>(getCurrentDateTime())

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDateTime(getCurrentDateTime())
        }, 1000)

        return () => clearInterval(intervalId)
    }, [])

    return <p>{dateTime}</p>
}

export default RealTimeClock
