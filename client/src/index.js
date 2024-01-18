import axios from "axios"
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./stylesheets/index.css"

// uncomment when working on local machine
axios.defaults.baseURL = `https://localhost:8000`;
// axios.defaults.withCredentials = true

// uncomment this when working in codespace
// axios.defaults.baseURL = `https://verbose-space-trout-5px6wj7jx6hpg9w-8000.app.github.dev/`;

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
