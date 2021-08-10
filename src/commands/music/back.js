import Command from "../../structures/Command.js"
import Discord from "discord.js"
import Player from "../../structures/music/player/Player.js"

export default class BackCommand extends Command {
    constructor(client) {
        super({
            name: "back",
            description: "Volte a música anterior",
            category: "music",
            aliases: ["voltar"],
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
        if(!player.queue[player.queueIndex - 1]) return
        await player.back()
        message.react('⏮')
    }
}