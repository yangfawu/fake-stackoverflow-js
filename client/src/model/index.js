import AnswerTable from "./answer-table.js"
import QuestionTable from "./question-table.js"
import TagTable from "./tag-table.js"

const QUERY_REGEX = /(\[(?<tag>[^[\]]+)]|(?<word>\w+))/g

export default class Model {
    questions = new QuestionTable()
    tags = new TagTable()
    answers = new AnswerTable()
    update = new EventTarget()

    constructor() {
        this.questions._fill({
            qid: "q1",
            title: "Programmatically navigate using React router",
            text: "the alert shows the proper index for the li clicked, and when I alert the variable within the last function I'm calling, moveToNextImage(stepClicked), the same value shows but the animation isn't happening. This works many other ways, but I'm trying to pass the index value of the list item clicked to use for the math to calculate.",
            tagIds: ["t1", "t2"],
            askedBy: "JoJi John",
            // askDate: new Date('December 17, 2020 03:24:00'),
            askDate: new Date("September 11, 2023 19:11:00"),
            ansIds: ["a1", "a2"],
            views: 10,
        }, {
            qid: "q2",
            title: "android studio save string shared preference, start activity and load the saved string",
            text: "I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.",
            tagIds: ["t3", "t4", "t2"],
            askedBy: "saltyPeter",
            askDate: new Date("January 01, 2022 21:06:12"),
            ansIds: ["a3", "a4", "a5"],
            views: 121,
        })
        this.tags._fill({
            tid: "t1",
            name: "react",
        }, {
            tid: "t2",
            name: "javascript",
        }, {
            tid: "t3",
            name: "android-studio",
        }, {
            tid: "t4",
            name: "shared-preferences",
        })
        this.answers._fill({
            aid: "a1",
            text: "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.",
            ansBy: "hamkalo",
            ansDate: new Date("March 02, 2022 15:30:00"),
        }, {
            aid: "a2",
            text: "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.",
            ansBy: "azad",
            ansDate: new Date("January 31, 2022 15:30:00"),
        }, {
            aid: "a3",
            text: "Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.",
            ansBy: "abaya",
            ansDate: new Date("April 21, 2022 15:25:22"),
        }, {
            aid: "a4",
            text: "YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);",
            ansBy: "alia",
            ansDate: new Date("December 02, 2022 02:20:59"),
        }, {
            aid: "a5",
            text: "I just found all the above examples just too confusing, so I wrote my own. ",
            ansBy: "sana",
            ansDate: new Date("December 31, 2022 20:20:59"),
        })
    }

    getTagById(id) {
        const out = this.tags.getRefByKey(id)
        if (!out)
            throw new Error(`No tag with [key=${id}] found`)
        return out
    }

    getTagByName(name) {
        const out = this.tags.getRefByName(name)
        if (!out)
            throw new Error(`No tag with [name=${name}] found`)
        return out
    }

    getAnswerById(id) {
        const out = this.answers.getRefByKey(id)
        if (!out)
            throw new Error(`No answer with [key=${id}] found`)
        return out
    }

    searchQuestions(query, mode) {
        let pool
        const trimmedQuery = query.toLowerCase().trim()
        if (trimmedQuery.length > 0) {
            const tags = new Set()
            const terms = new Set()
            // extract tags and terms from query string
            for (const { groups: g } of trimmedQuery.matchAll(QUERY_REGEX)) {
                if (!g)
                    continue
                const { tag, word } = g
                if (tag)
                    tags.add(tag)
                if (word)
                    terms.add(word)
            }
            const targetTagIds = new Set()
            // find the tag IDs we need to look for
            for (const tagName of tags) {
                try {
                    const res = this.getTagByName(tagName)
                    targetTagIds.add(res.tid)
                } catch (e) {
                }
            }
            pool = this.questions.getAllRefs().filter(({ tagIds, title, text }) => {
                for (const id of tagIds)
                    if (targetTagIds.has(id))
                        return true
                const src = `${title} ${text}`.toLowerCase().split(/\s+/)
                for (const w of terms)
                    if (src.includes(w))
                        return true
                return false
            })
        } else {
            pool = this.questions.getAllRefs()
        }
        const $mode = mode || "newest"
        switch ($mode) {
            case "newest": {
                pool.sort(({ askDate: a }, { askDate: b }) => {
                    const at = a.getTime()
                    const bt = b.getTime()
                    return bt - at
                })
                break
            }
            case "active": {
                const $pool = pool.map(q => {
                    let latestReplyTime = 0
                    for (const aid of q.ansIds) {
                        latestReplyTime = Math.max(latestReplyTime, this.getAnswerById(aid).ansDate.getTime())
                    }
                    return { q, latestReplyTime }
                })
                $pool.sort(({ latestReplyTime: a }, { latestReplyTime: b }) => b - a)
                pool = $pool.map(({ q }) => q)
                break
            }
            default: {
                pool = pool.filter(({ ansIds }) => ansIds.length < 1)
                break
            }
        }
        return {
            results: pool,
            query: trimmedQuery,
            mode: $mode
        }
    }

    getTags() {
        return this.tags.getAllRefs()
    }

    getQuestionById(id) {
        const out = this.questions.getRefByKey(id)
        if (!out)
            throw new Error(`No question with [key=${id}] found`)
        return out
    }

    createAnswer({ qid, text, ansBy }) {
        const out = this.answers.createRef({
            ansDate: new Date(),
            text,
            ansBy
        })
        this.update.dispatchEvent(new Event("answer:new"))
        this.getQuestionById(qid).ansIds.push(out.aid)
        this.update.dispatchEvent(new Event(`question:${qid}`))
        return out
    }

    createTagIfNotExist({ name }) {
        const onRecord = this.tags.getRefByName(name)
        if (onRecord)
            return onRecord
        const out = this.tags.createRef({
            name: name.toLowerCase().trim()
        })
        this.update.dispatchEvent(new Event("tag:new"))
        return out
    }

    createQuestion({ title, text, tagIds, askedBy }) {
        const out = this.questions.createRef({
            title,
            text,
            tagIds,
            askedBy,
            askDate: new Date(),
            views: 0,
            ansIds: []
        })
        this.update.dispatchEvent(new Event("question:new"))
        return out
    }

    computeTagTally() {
        const questions = this.questions.getAllRefs()
        const tags = this.tags.getAllRefs()
        const tally = {}
        for (const { tid } of tags)
            tally[tid] = 0
        for (const { tagIds } of questions)
            for (const tid of tagIds)
                tally[tid]++
        return tags.map(t => ({
            ...t,
            count: tally[t.tid]
        }))
    }
}
