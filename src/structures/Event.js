import client from "../bot.js"

export default class Event {
    /**
     * 
     * @param {client} client 
     * @param {String} type 
     * @param {String} dirname 
     */
    constructor(client, type = null, dirname = null) {
        this.client = client
        this.type = type
        this.dirname = dirname
    }
}