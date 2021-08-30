import Command from "../../structures/Command.js"
import Discord from "discord.js"
import Player from "../../structures/music/player/Player.js"

export default class NameCommand extends Command {
    constructor(client) {
        super({
            name: "loop",
            description: "Ativa/Desativa o loop da queue.",
            category: "music",
            dirname: global.__dirname(import.meta)
        }, client)
    }

    /** 
    * @param {Discord.Message} message
    * @param {Array} args
    * @param {Player} player
    */

    async run(message, args, player) {
        if(["track", "song"]) {
            player.trackRepeat = !player.trackRepeat
            if(player.queueRepeat) !player.queueRepeat
            return message.reply({
                embeds: [
                    new Discord.MessageEmbed()
                    .setColor("#FFF2E7")
                    .setDescription(`**Loop do track ${!player.trackRepeat ? "desativado" : "ativado"}.**`)
                    .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                ]
            })
        }

        player.queueRepeat = !player.queueRepeat
        if(player.trackRepeat) !player.trackRepeat
            
        return message.reply({
            embeds: [
                new Discord.MessageEmbed()
                .setColor("#FFF2E7")
                .setDescription(`**Loop da queue ${!player.queueRepeat ? "desativado" : "ativado"}.**`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                .setTimestamp()
            ]
        })
    }
}