const cors = require("cors")
const express = require("express")
const mongoose = require("mongoose")
const { DB_URI, PORT } = require("./config")

// register schemas before usage
require("./models/tags")
require("./models/answers")
require("./models/questions")

// add project middlewares
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// register routers
app.use("/question", require("./routes/question"))
app.use("/tag", require("./routes/tag"))

// entry method
async function main() {
    try {
        await mongoose.connect(DB_URI, {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        })
    } catch (e) {
        console.error(`Error connecting to ${DB_URI}`, e)
        throw e
    }
    
    const server = app.listen(PORT, () => {
        console.log(`Server running at port ${PORT}!`)
    })

    process.on("SIGINT", async () => {
        await mongoose.disconnect()
        server.close(() => {
            console.log("Server closed. Database instance disconnected")
        })
    })
}
main()
