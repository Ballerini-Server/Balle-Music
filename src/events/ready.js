import Event from "../structures/Event.js"
import Discord from "discord.js"

export default class ReadyEvent extends Event {
    constructor(client) {
        super(client, "ready", global.__dirname(import.meta))
    }

    
    async run() {
        this.client.music.connect()
        console.log("Client online!")
    }
}