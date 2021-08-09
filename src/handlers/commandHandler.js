import { readdirSync } from "fs"
import client from "../bot.js"

/**
 * @param {client} client 
 */
 export default async function(client) {
    client.commands = []

    let pastas = readdirSync(global.__dirname(import.meta) + "/../commands")
    for(let pasta of pastas) {
        let commands = readdirSync(global.__dirname(import.meta) + "/../commands/" + pasta).filter(file => file.split(".").pop() == "js");
        for (let command of commands) {
            let base = await import(`../commands/${pasta}/${command}`)
            command = new base.default(client)
            client.commands.push(command)
        }
    }

    return client.commands
}