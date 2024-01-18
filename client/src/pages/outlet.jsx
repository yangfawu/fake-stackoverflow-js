import { useRouter } from "../providers/router-provider"
import Home from "./home"
import Tags from "./tags"
import Question from "./question"
import NewQuestion from "./new-question"
import Comment from "./comment"

export default function Outlet() {
    const [{ path }] = useRouter()

    switch (path) {
        case "home":
            return <Home/>
        case "tags":
            return <Tags/>
        case "question":
            return <Question/>
        case "new":
            return <NewQuestion/>
        case "comment":
            return <Comment/>
        default:
            throw new Error(`Unknown path: ${path}`)
    }
}
