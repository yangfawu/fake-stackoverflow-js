const mongoose = require("mongoose")
const { DB_URI } = require("./config")

async function main() {
    const connection = mongoose.createConnection(DB_URI, {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    })
    await connection.dropDatabase()
    await connection.close()
}
main()
