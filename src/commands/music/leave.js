import Command from "../../structures/Command.js"
import Discord from "discord.js"
import Player from "../../structures/music/player/Player.js"

export default class SkipCommand extends Command {
    constructor(client) {
        super({
            name: "leave",
            description: "Faça eu sair do canal de voz",
            category: "music",
            aliases: ["sair", "disconnect", "dc"],
            dirname: global.__dirname(import.meta),
            requires: {
                memberVoiceChannel: true,
                player: true
            }
        }, client)
    }

    /** 
    * @param {Discord.Message} message
    * @param {String[]} args
    * @param {Player} player
    */

    async run(message, args, player) {
        await player.destroy()
        message.react('👋')
    }
}
