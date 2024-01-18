import TextField from "../components/text-field"
import { useState } from "react"
import { useModel } from "../providers/model-provider"
import { useRouter } from "../providers/router-provider"
import { findLinkIssues } from "../util"
import axios from "axios"

export default function NewQuestion() {
    const model = useModel()
    const [, navigate] = useRouter()

    const [title, setTitle] = useState("")
    const [text, setText] = useState("")
    const [tags, setTags] = useState("")
    const [username, setUsername] = useState("")

    const submit = async () => {
        const $title = (title || "").trim()
        const $text = (text || "").trim()
        const $tags = (tags || "").trim()
        const $name = (username || "").trim()
        if (!$name || !$text || !$tags || !$title || $title.length > 100)
            return

        try {
            await axios.post("/question/new", {
                title: $title,
                text: $text,
                tags: $tags,
                name: $name
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        } catch (e) {
            console.error(e)
            return
        }

        navigate("home", {
            query: "",
            mode: "newest"
        })
    }

    return (
        <div className="root form">
            <TextField
                title="Question Title"
                required="A title is required"
                description="Limit title to 100 characters or less"
                validate={[
                    (val) => val.length > 100 && "Must be 100 characters or less"
                ]}
                value={title}
                onChange={setTitle}
            />
            <TextField
                title="Question Text"
                required="Details are required"
                description="Add details"
                useArea
                validate={[
                    (val) => findLinkIssues(val)
                ]}
                value={text}
                onChange={setText}
            />
            <TextField
                title="Tags"
                required="At least 1 tag must be provided"
                description="Add keywords separated by whitespace"
                value={tags}
                onChange={setTags}
            />
            <TextField
                title="Username"
                required="You need to provide an username"
                value={username}
                onChange={setUsername}
            />
            <div>
                <button className="big-button" onClick={submit}>
                    Post Question
                </button>
                <p>* indicates mandatory fields</p>
            </div>
        </div>
    )
}
