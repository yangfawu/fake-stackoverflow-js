import { useEffect, useState } from "react"

export default function TextField({
                                      title,
                                      description,
                                      required="",
                                      type="text",
                                      useArea=false,
                                      value,
                                      onChange,
                                      validate
}) {
    const [touched, setTouched] = useState(false)
    const [errMsg, setErrMsg] = useState("")

    const applyChange = newValue => {
        setTouched(true)
        onChange(newValue)
    }

    useEffect(() => {
        const $ = (value || "").trim()
        if ($) {
            if (validate) {
                for (const check of validate) {
                    const result = check($)
                    if (result) {
                        setErrMsg(result)
                        return
                    }
                }
            }
        } else if (required) {
            setErrMsg(required || "")
            return
        }
        setErrMsg("")
    }, [value, validate, required])

    return (
        <div className="input">
            <h4>{title}{required && "*"}</h4>
            {
                description &&
                <p className="description">{description}</p>
            }
            {
                useArea ?
                    <textarea
                        value={value}
                        onChange={event => applyChange(event.target.value)}
                        required={Boolean(required)}
                    /> :
                    <input
                        type={type}
                        value={value}
                        onChange={event => applyChange(event.target.value)}
                        required={Boolean(required)}
                    />
            }
            {
                touched && errMsg &&
                <p className="error">{errMsg}</p>
            }
        </div>
    )
}
