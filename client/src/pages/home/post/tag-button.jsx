import { useRouter } from "../../../providers/router-provider"

export default function TagButton({ name }) {
    const [, navigate] = useRouter()

    const exploreTag = () => navigate("home", {
        query: `[${name}]`,
        mode: "newest"
    }, true)

    return (
        <button onClick={exploreTag}>
            {name}
        </button>
    )
}
