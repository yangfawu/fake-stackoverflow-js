import AbstractTable from "./abstract-table.js"

export default class AnswerTable extends AbstractTable {

    constructor() {
        super("aid")
    }

    generateKey(idx) {
        return `a${idx}`
    }

}
