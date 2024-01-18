const Question = require("../models/questions")
const Tag = require("../models/tags")
const Answer = require("../models/answers")

const QUERY_REGEX = /(\[(?<tag>[^[\]]+)]|(?<word>\w+))/g
async function getAllQuestions(req, res) {
    const {
        q: RAW_query,
        m: RAW_mode
    } = req.query

    // compute the tags and search terms we need to look for
    const tags = new Set()
    const terms = new Set()
    const query = (RAW_query || "").trim().toLowerCase()
    for (const { groups: g } of query.matchAll(QUERY_REGEX)) {
        if (!g)
            continue
        const { tag, word } = g
        if (tag)
            tags.add(tag)
        if (word)
            terms.add(word)
    }

    // begin building aggregate
    const aggregate = Question.aggregate([])

    // include text-searching if we have words to look for
    if (terms.size > 0) {
        const r = new RegExp([...terms].join("|"), "i")
        aggregate.match({
            $or: [
                { title: { $regex: r } },
                { text: { $regex: r } }
            ]
        })
    } 

    // populate information about each tag
    aggregate.lookup({
        from: "tags",
        localField: "tags",
        foreignField: "_id",
        as: "tags"
    })

    // include tag-searching if we have tags to look for
    if (tags.size > 0) {
        aggregate.match({
            "tags": {
                $elemMatch: { name: { $in: [...tags] } }
            }
        })
    }

    // add a field to store the number of answers
    aggregate.addFields({
        ans_count: {
            $size: "$answers"
        }
    })
    
    const mode = (RAW_mode || "newest").trim().toLowerCase()
    switch (mode) {
        case "active": {
            // filter out all questions that have NO answers
            aggregate.match({
                ans_count: { $gt: 0 }
            })

            // populate information about each answer and determine the latest reply time
            aggregate.lookup({
                from: "answers",
                localField: "answers",
                foreignField: "_id",
                as: "latest_reply_time",
                pipeline: [
                    {
                        // we group by nothing, but this will tell mongo we want to do an aggregate
                        $group: {
                            _id: null,
                            result: { $max: "$ans_date_time" }
                        }
                    }
                ]
            })

            // the previous aggregate used to get latest reply time comes in the form of an array
            // since this array is always just 1 element, we remove it
            aggregate.unwind("latest_reply_time")

            // sort the latest time in descending order
            aggregate.sort({
                "latest_reply_time.result": -1
            })
            break
        }
        case "unanswered": {
            // filter out all questions that have answers
            aggregate.match({
                ans_count: 0
            })

            // NOTE: a break is purposely not placed here so the default can be applied
            // break
        }
        case "newest":
        default: {
            // sort results by post time in descending order
            aggregate.sort({
                ask_date_time: -1
            })
            break
        }
    }

    const results = await aggregate.project({
        title: 1,
        tags: 1,
        asked_by: 1,
        ask_date_time: 1,
        views: 1,
        tags: {
            $map: {
                input: "$tags",
                as: "item",
                in: "$$item.name"
            }
        },
        ans_count: 1
    }).exec()
    res.send({
        query,
        mode,
        results
    })
}

async function getSpecificQuestion(req, res) {
    const { qid: _id } = req.params
    const { entry } = req.query
    
    const results = await Question.findOneAndUpdate(
        { _id },
        entry === "new" ?
            { $inc: { views: 1 } } :
            {},
        {
            returnDocument: "after",
            projection: {
                tags: 0
            },
            populate: {
                path: "answers",
                options: { 
                    sort: { ans_date_time: 1 } 
                }
            }
        }
    ).exec()
    res.send(results)
}

async function createNewQuestion(req, res) {
    const title = String(req.body.title || "").trim()
    if (title.length > 100)
        return res.status(400).send({ message: "Title cannot be more than 100 characters" })

    const text = String(req.body.text || "").trim()
    if (text.length < 1)
        return res.status(400).send({ message: "Text is required" })

    const tags = new Set(
        String(req.body.tags || "")
            .trim()
            .toLowerCase()
            .split(" ")
    )
    if (tags.size < 1)
        return res.status(400).send({ message: "At least 1 tag is required" })

    const name = String(req.body.name || "").trim()
    if (name.length < 1)
        return res.status(400).send({ message: "An username is required" })

    // convert all tags into IDs
    const tagIds = []
    for (const tagName of tags) {
        // create the tag if it does not already exist
        const { _id: tid } = await Tag.findOneAndUpdate(
            { name: tagName },
            { $set: { name: tagName } },
            { 
                upsert: true,
                returnDocument: "after"
            }
        ).exec()
        tagIds.push(tid) 
    }

    await Question.create({
        title,
        text,
        asked_by: name,
        tags: tagIds
    })
    res.send({ message: "Done" })
}

async function addAnswer(req, res) {
    const { qid: _id } = req.params

    const text = String(req.body.text || "").trim()
    if (text.length < 1)
        return res.status(400).send({ message: "Text is required" })

    const name = String(req.body.name || "").trim()
    if (name.length < 1)
        return res.status(400).send({ message: "An username is required" })

    const answer = await Answer.create({
        text,
        ans_by: name
    })

    await Question.findOneAndUpdate(
        { _id },
        { $push: { answers: answer._id } }
    ).exec()
    res.send({ message: "Done" })
}

exports.default = {
    getAllQuestions,
    getSpecificQuestion,
    createNewQuestion,
    addAnswer
}
