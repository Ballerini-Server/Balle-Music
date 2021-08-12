String.prototype.shorten = function(length) {
    if (!(this.length > length)) return `${this}`
    return this.slice(0, Number(length) - 3) + '...'
}