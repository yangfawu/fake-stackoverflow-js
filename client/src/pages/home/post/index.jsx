import TimeAgo from "../../../components/time-ago"
import { useRouter } from "../../../providers/router-provider"
import { pluralfy } from "../../../util"
import TagButton from "./tag-button"

export default function Post({ _id: qid, title, tags, asked_by, ask_date_time, ans_count, views }) {
    const [, navigate] = useRouter()

    const openQuestion = () => {
        navigate("question", {
            qid,
            query: "",
            entry: "new" // tell the server it needs to increment view count
        })
    }

    return (
        <div className="question-item">
            <div className="stats">
                <p>{pluralfy("answer", ans_count)}</p>
                <p>{pluralfy("view", views)}</p>
            </div>
            <div className="content">
                <h5 onClick={openQuestion}>{title}</h5>
                <div className="tags">
                    {
                        tags.map(name => <TagButton key={name} name={name}/>)
                    }
                </div>
            </div>
            <div className="signature">
                <p>
                    <span>{asked_by}</span> asked <TimeAgo value={ask_date_time}/>
                </p>
            </div>
        </div>
    )
}
