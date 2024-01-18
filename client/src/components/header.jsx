import { useEffect, useState } from "react"
import { useRouter } from "../providers/router-provider"

export default function Header() {
    const [{ query }, navigate] = useRouter()
    const [value, setValue] = useState(query)

    const submit = (event) => {
        if (event.code !== "Enter")
            return
        navigate("home", {
            query: value || "",
            mode: "newest"
        })
    }

    const goHome = () => navigate("home", {
        query: "",
        mode: "newest"
    }, true)

    useEffect(() => {
        setValue(query)
    }, [query])

    return (
        <div id="header" className="header">
            <h3 onClick={goHome}>Fake Stack Overflow</h3>
            <input
                type="text"
                placeholder="Search..."
                value={value}
                onChange={event => setValue(event.target.value)}
                onKeyUp={submit}
            />
        </div>
    )
}
