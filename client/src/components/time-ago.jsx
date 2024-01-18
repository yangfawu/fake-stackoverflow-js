import { useCallback, useEffect, useState } from "react"
import { pluralfy } from "../util"

const SINGLE_MIN_MS = 60 * 1000
const SINGLE_HR_MS = 60 * SINGLE_MIN_MS
const SINGLE_DAY_MS = 24 * SINGLE_HR_MS

export default function TimeAgo({ value }) {
    const computeNewStamp = useCallback(() => {
        const dateValue = new Date(value)
        const diff = Date.now() - dateValue.getTime()
        if (diff < 0)
            return dateValue.toJSON()
        if (diff === 0)
            return "just now"
        if (diff < SINGLE_DAY_MS) {
            if (diff < SINGLE_HR_MS) {
                if (diff < SINGLE_MIN_MS)
                    return pluralfy("second", Math.round(diff / 1000)) + " ago"
                return pluralfy("minute", Math.round(diff / SINGLE_MIN_MS)) + " ago"
            }
            return pluralfy("hour", Math.round(diff / SINGLE_HR_MS)) + " ago"
        }
        const year = dateValue.getFullYear()
        const month = dateValue.toLocaleString("en-US", { month: "short" })
        const day = dateValue.getDate()
        const hours = String(dateValue.getHours()).padStart(2, "0")
        const minutes = String(dateValue.getMinutes()).padStart(2, "0")
        return `${month} ${day}, ${year} at ${hours}:${minutes}`
    }, [value])

    const [stamp, setStamp] = useState(computeNewStamp())

    useEffect(() => {
        const intId = window.setInterval(() => {
            setStamp(computeNewStamp())
        }, 1000)
        return () => {
            window.clearInterval(intId)
        }
    }, [computeNewStamp])

    return (
        <>{stamp}</>
    )
}
