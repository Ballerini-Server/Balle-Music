import Command from "../../structures/Command.js"
import Discord from "discord.js"
import Player from "../../structures/music/player/Player.js"

export default class SkipCommand extends Command {
    constructor(client) {
        super({
            name: "skip",
            description: "Pule a música que está sendo tocada",
            category: "music",
            aliases: ["s", "pular"],
            dirname: global.__dirname(import.meta),
            requires: {
                memberVoiceChannel: true,
                player: true
            }
        }, client)
    }

    /** 
    * @param {Discord.Message} message
    * @param {Array} args
    * @param {Player} player
    */

    async run(message, args, player) {
        await player.skip()
        message.react('⏭')
    }
}