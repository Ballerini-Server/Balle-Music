import Command from "../../structures/Command.js"
import Discord from "discord.js"
import Player from "../../structures/music/player/Player.js"

export default class _8DCommand extends Command {
    constructor(client) {
        super({
            name: "8d",
            description: "Ative/Desative o efeito 8d.",
            category: "music",
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
        await player.effects.set8D(!player.effects._8d)

        message.reply({
            embeds: [
                new Discord.MessageEmbed()
                .setColor("#FFF2E7")
                .setDescription(`**8D ${!player.effects.nightcore ? "desativado" : "ativado"}.**`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                .setTimestamp()
            ]
        })
    }
}