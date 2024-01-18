const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, "text cannot be empty"],
    },
    ans_by: {
        type: String,
        required: [true, "ans_by cannot be empty"],
    },
    ans_date_time: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    }
}, {
    virtuals: {
        url: {
            get() {
                return `posts/answer/${this._id}`
            }
        }
    }
})

module.exports = mongoose.model("Answer", schema, "answers")
