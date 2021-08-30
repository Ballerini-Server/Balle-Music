import Command from "../../structures/Command.js"
import Discord from "discord.js"
import Player from "../../structures/music/player/Player.js"

export default class VaporwaveCommand extends Command {
    constructor(client) {
        super({
            name: "vaporwave",
            description: "Ative/Desative o efeito vaporwave.",
            category: "music",
            aliases: ["vp"],
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
        await player.effects.setVaporwave(!player.effects.vaporwave)

        message.reply({
            embeds: [
                new Discord.MessageEmbed()
                .setColor("#FFF2E7")
                .setDescription(`**Vaporwave ${!player.effects.vaporwave ? "desativado" : "ativado"}.**`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                .setTimestamp()
            ]
        })
    }
}