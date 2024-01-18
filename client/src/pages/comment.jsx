import axios from "axios"
import { useState } from "react"
import TextField from "../components/text-field"
import { useRouter } from "../providers/router-provider"
import { findLinkIssues } from "../util"

export default function Comment() {
    const [{ qid }, navigate] = useRouter()

    const [username, setUsername] = useState("")
    const [text, setText] = useState("")

    const submit = async () => {
        const $name = (username || "").trim()
        const $text = (text || "").trim()
        if (!$name || !$text)
            return

        try {
            await axios.post(`/question/${qid}/answer`, {
                text: $text,
                name: $name,
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        } catch (e) {
            console.error(e)
            return
        }

        navigate("question", {
            entry: "" // tell the server we are not entering a new question
        })
    }

    return (
        <div className="root form">
            <TextField
                title="Username"
                required="You need to provide an username"
                value={username}
                onChange={setUsername}
            />
            <TextField
                title="Answer Text"
                required="An answer is required"
                useArea
                validate={[
                    (val) => findLinkIssues(val)
                ]}
                value={text}
                onChange={setText}
            />
            <div>
                <button className="big-button" onClick={submit}>
                    Post Answer
                </button>
                <p>* indicates mandatory fields</p>
            </div>
        </div>
    )
}
