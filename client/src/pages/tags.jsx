import axios from "axios"
import { useEffect, useState } from "react"
import AskQuestionButton from "../components/ask-question-button"
import { useRouter } from "../providers/router-provider"
import { pluralfy } from "../util"

export default function Tags() {
    const [, navigate] = useRouter()
    const [results, setResults] = useState([])

    useEffect(() => {
        const controller = new AbortController()
        axios.get("/tag/all", {
            signal: controller.signal
        }).then(res => {
            setResults(res.data) 
        }).catch(console.error)
        return () => {
            controller.abort()
        }
    }, [])

    const exploreTag = (tagName) => navigate("home", {
        query: `[${tagName}]`,
        mode: "newest"
    })

    return (
        <div className="root tags">
            <div className="header">
                <h5>{pluralfy("Tag", results.length)}</h5>
                <h5>All Tags</h5>
                <AskQuestionButton/>
            </div>
            <div className="content">
                {
                    results.map(({ name, count }) => (
                        <div key={name} className="tag">
                            <p onClick={() => exploreTag(name)}>{name}</p>
                            <p>{pluralfy("question", count)}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
