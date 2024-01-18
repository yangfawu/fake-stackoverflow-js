const Question = require("../models/questions")

async function getAllTags(req, res) {
    const results = await Question.aggregate([
        {
            // each Question document has a tags set
            // unwinding the set will give us a document for every combination of Question and its singular tag 
            $unwind: "$tags"
        },
        {
            // we now group the questions by their individual tags
            // we also retain a question count of each tag
            $group: {
                _id: "$tags",
                count: { $sum: 1 }
            }
        },
        {
            // we now perform a lookup for each tag to populate in its information
            $lookup: {
                from: "tags",
                localField: "_id",
                foreignField: "_id",
                as: "tag"
            }
        },
        {
            // the lookup's result is stored at a single-element array "tag" field
            // we unwind it to get rid of the unnecessary []
            $unwind: "$tag"
        },
        {
            // we keep this projection of the results to send them out to the client
            $project: {
                count: 1,
                name: "$tag.name",
                _id: 0
            }
        },
        {
            // for consistent search results, we sort by tag name
            $sort: {
                name: 1
            }
        },
    ]).exec()
    res.send(results)
}

exports.default = {
    getAllTags
}
