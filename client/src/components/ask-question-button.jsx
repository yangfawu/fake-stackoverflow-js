import { useRouter } from "../providers/router-provider"

export default function AskQuestionButton() {
    const [, navigate] = useRouter()

    const goAskQuestion = () => navigate("new", {
        query: ""
    })

    return (
        <button className="big-button" onClick={goAskQuestion}>
            Ask Question
        </button>
    )
}
