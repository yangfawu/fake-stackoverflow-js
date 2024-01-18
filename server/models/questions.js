const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "title cannot be empty"],
        max: [100, "Title cannot be more than 100 characters"]
    },
    text: {
        type: String,
        required: [true, "text cannot be empty"],
    },
    tags: {
        type: [{ 
            type: mongoose.SchemaTypes.ObjectId, 
            ref: "Tag" 
        }],
        required: [true, "tags cannot be empty"]
    },
    answers: [{ 
        type: mongoose.SchemaTypes.ObjectId, 
        ref: "Answer" 
    }],
    asked_by: {
        type: String,
        default: () => "Anonymous"
    },
    ask_date_time: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    views: {
        type: Number,
        default: () => 0
    }
}, {
    virtuals: {
        url: {
            get() {
                return `posts/question/${this._id}`
            }
        }
    }
})

module.exports = mongoose.model("Question", schema, "questions")
