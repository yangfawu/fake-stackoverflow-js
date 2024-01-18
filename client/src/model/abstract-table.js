export default class AbstractTable {

    constructor(primaryKey) {
        this.primaryKey = primaryKey
        this.data = []
        this.index = new Map()
    }

    _fill(...tuples) {
        for (const t of tuples) {
            const key = t[this.primaryKey]
            if (this.index.has(key))
                throw new Error(`Duplicate key error: ${key}`)
            this.data.push(t)
            this.index.set(key, t)
        }
    }

    getCount() {
        return this.data.length
    }

    getAllRefs() {
        return this.data.slice()
    }

    getRefByKey(key) {
        return this.index.get(key)
    }

    createRef(payload) {
        const key = this.generateKey(this.data.length + 1)
        const data = {
            [this.primaryKey]: key,
            ...payload
        }
        this.data.push(data)
        this.index.set(key, data)
        return data
    }

}
