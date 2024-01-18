import TimeAgo from "../../components/time-ago"
import HyperlinkView from "../../components/hyperlink-view"

export default function Answer({ text, ans_by, ans_date_time }) {
    return (
        <div className="answer">
            <p>
                <HyperlinkView value={text}/>
            </p>
            <div>
                <p>{ans_by}</p>
                <p>answered <TimeAgo value={ans_date_time}/></p>
            </div>
        </div>
    )
}
