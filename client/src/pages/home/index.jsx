import axios from 'axios'
import { useEffect, useState } from "react"
import { useRouter } from "../../providers/router-provider"
import Header from "./header"
import NoQuestions from "./no-questions"
import Post from "./post"

export default function Home() {
    const [{ query: $q, mode: $m }] = useRouter()
    const [{ results, query, mode }, setResults] = useState({
        results: [],
        query: "",
        mode: "newest"
    })

    useEffect(() => {
        const controller = new AbortController()
        axios.get("/question/all", {
            signal: controller.signal,
            params: {
                q: $q,
                m: $m
            }
        }).then(res => {
            setResults(res.data) 
        }).catch(console.error)
        return () => {
            controller.abort()
        }
    }, [$q, $m])

    return (
        <div className="root home">
            <Header results={results.length} query={query.length} mode={mode}/>
            {
                results.map(props => <Post key={props._id} {...props}/>)
            }
            {
                results.length < 1 &&
                <NoQuestions/>
            }
        </div>
    )
}
