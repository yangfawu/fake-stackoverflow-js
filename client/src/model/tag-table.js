import AbstractTable from "./abstract-table.js"

export default class TagTable extends AbstractTable {

    constructor() {
        super("tid")
        this.nameIndex = new Map()
    }

    _fill(...tuples) {
        super._fill(...tuples)
        for (const t of this.data)
            this.nameIndex.set(t.name.trim().toLowerCase(), t)
    }

    generateKey(idx) {
        return `t${idx}`
    }

    createRef(payload) {
        const ref = super.createRef(payload)
        this.nameIndex.set(ref.name.trim().toLowerCase(), ref)
        return ref
    }

    getRefByName(name) {
        return this.nameIndex.get(name.trim().toLowerCase())
    }

}
