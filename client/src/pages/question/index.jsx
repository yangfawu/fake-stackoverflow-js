import axios from "axios"
import { useEffect, useState } from "react"
import AskQuestionButton from "../../components/ask-question-button"
import HyperlinkView from "../../components/hyperlink-view"
import TimeAgo from "../../components/time-ago"
import { useRouter } from "../../providers/router-provider"
import { pluralfy } from "../../util"
import Answer from "./answer"

export default function Question() {
    const [{ qid, entry }, navigate] = useRouter()
    const [result, setResults] = useState(null)

    useEffect(() => {
        const controller = new AbortController()
        axios.get(`/question/${qid}`, {
            signal: controller.signal,
            params: {
                entry
            }
        }).then(res => {
            setResults(res.data) 
        }).catch(console.error)
        return () => {
            controller.abort()
        }
    }, [qid, entry])

    if (result == null)
        return <></>

    const { title, answers, text, views, asked_by, ask_date_time, } = result

    const goComment = () => navigate("comment")

    return (
        <div className="root question">
            <div className="title">
                <h5>{pluralfy("answer", answers.length)}</h5>
                <h5>{title}</h5>
                <AskQuestionButton/>
            </div>
            <div className="post">
                <h5>{pluralfy("view", views)}</h5>
                <p>
                    <HyperlinkView value={text}/>
                </p>
                <div>
                    <p>{asked_by}</p>
                    <p>asked <TimeAgo value={ask_date_time}/></p>
                </div>
            </div>
            {
                answers.map(props => <Answer key={props._id} {...props}/>)
            }
            <div className="comment">
                <button className="big-button" onClick={goComment}>
                    Answer Question
                </button>
            </div>
        </div>
    )
}
