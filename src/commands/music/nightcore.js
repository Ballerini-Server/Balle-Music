import Command from "../../structures/Command.js"
import Discord from "discord.js"
import Player from "../../structures/music/player/Player.js"

export default class NightcoreCommand extends Command {
    constructor(client) {
        super({
            name: "nightcore",
            description: "Ative/Desative o efeito nightcore.",
            category: "music",
            aliases: ["nc"],
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
        await player.effects.setNightcore(!player.effects.nightcore)

        message.reply({
            embeds: [
                new Discord.MessageEmbed()
                .setColor("#FFF2E7")
                .setDescription(`**Nightcore ${!player.effects.nightcore ? "desativado" : "ativado"}.**`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                .setTimestamp()
            ]
        })
    }
}