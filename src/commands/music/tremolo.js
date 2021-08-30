import Command from "../../structures/Command.js"
import Discord from "discord.js"
import Player from "../../structures/music/player/Player.js"

export default class TremoloCommand extends Command {
    constructor(client) {
        super({
            name: "tremolo",
            description: "Ative/Desative o efeito tremolo.",
            category: "music",
            aliases: [],
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
        await player.effects.setTremolo(!player.effects.tremolo)

        message.reply({
            embeds: [
                new Discord.MessageEmbed()
                .setColor("#FFF2E7")
                .setDescription(`**Tremolo ${!player.effects.tremolo ? "desativado" : "ativado"}.**`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                .setTimestamp()
            ]
        })
    }
}