import Command from "../../structures/Command.js"
import Discord from "discord.js"

export default class PingCommand extends Command {
    constructor(client) {
        super({
            name: "ping",
            description: "Veja o meu ping.",
            category: "bot",
            dirname: global.__dirname(import.meta)
        }, client)
    }

    /** 
    * @param {Discord.Message} message
    * @param {Array} args
    */

    async run(message, args) {
        message.reply({
            content: `:ping_pong: \`${this.client.ws.ping}ms\``
        })
    }
}