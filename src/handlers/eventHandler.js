import { readdirSync } from "fs"
import client from "../bot.js"

/**
 * @param {client} client 
 */
 export default async function(client) {
    client.events = []

    let events = readdirSync(global.__dirname(import.meta) + "/../events").filter(file => file.split(".").pop() == "js");
    for(let event of events) {
        let base = await import(`../events/${event}`)
        event = new base.default(client)
        client.events.push(event)
        client.on(event.type, (...args) => event.run(...args))
    }

    return client.events
}