import AskQuestionButton from "../../components/ask-question-button"
import { pluralfy } from "../../util"
import { useRouter } from "../../providers/router-provider"

const FILTERS = [
    { key: "newest", value: "Newest" },
    { key: "active", value: "Active" },
    { key: "unanswered", value: "Unanswered" },
]

export default function Header({ results, query, mode }) {
    const [, navigate] = useRouter()

    const goToMode = newMode => navigate("home", {
        mode: newMode
    }, true)

    return (
        <div className="question-header">
            <div>
                <h4>{Boolean(query) ? "Search Results" : "All Questions"}</h4>
                <AskQuestionButton/>
            </div>
            <div>
                <h5>{pluralfy("question", results)}</h5>
                <div className="filters">
                    {
                        FILTERS.map(({ key, value }) => (
                            <button key={key}
                                    className={key === mode ? "active" : ""}
                                    onClick={() => goToMode(key)}>
                                {value}
                            </button>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
