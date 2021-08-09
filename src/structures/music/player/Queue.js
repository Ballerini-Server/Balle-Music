export default class Queue extends Array {
    constructor(...args) {
      super(...args)
      this.previous = null
      this.current = null
      this.next = null
    }

    get duration() {
        let a, b
        const current = (b = (a = this.current) === null || a === void 0 ? void 0 : a.duration) !== null && b !== void 0 ? b : 0
        return this.reduce((acc, cur) => acc + (cur.duration || 0), current)
    }

    get totalSize() {
        return this.length + (this.current ? 1 : 0)
    }
}