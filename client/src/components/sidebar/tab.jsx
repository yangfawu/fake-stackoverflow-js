import { useCallback } from "react"
import { useRouter } from "../../providers/router-provider"

export default function Tab({ name, children }) {
    const [{ path }, navigate] = useRouter()

    const goToTab = useCallback(() => {
        navigate(name, {
            query: "",
            mode: "newest",
        }, true)
    }, [name])

    return (
        <p className={`tab ${path === name ? "active" : ""}`} onClick={goToTab}>
            {children}
        </p>
    )
}
