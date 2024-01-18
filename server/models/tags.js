const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name cannot be empty"],
    }
}, {
    virtuals: {
        url: {
            get() {
                return `posts/tag/${this._id}`
            }
        }
    }
})

module.exports = mongoose.model("Tag", schema, "tags")
