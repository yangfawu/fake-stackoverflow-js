import AbstractTable from "./abstract-table.js"

export default class QuestionTable extends AbstractTable {

    constructor() {
        super("qid")
    }

    generateKey(idx) {
        return `q${idx}`
    }

}
