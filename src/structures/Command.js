import client from "../bot.js"

export default class Command {
    /**
    * @param {client} client
    * @param {String} name
    * @param {String} description
    * @param {Array} aliases
    * @param {String} category
    * @param {String} dirname
    */

    constructor({
        name = null,
        description = null,
        aliases = [],
        category = null,
        dirname = null
    }, client) {
        this.client = client
        this.name = name
        this.description = description
        this.aliases = aliases
        this.category = category
        this.dirname = dirname
    }
}