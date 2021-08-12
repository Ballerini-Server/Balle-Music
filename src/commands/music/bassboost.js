import Command from "../../structures/Command.js"
import Discord from "discord.js"
import Player from "../../structures/music/player/Player.js"
import equalizers from "../../config/equalizers.js"

export default class BassboostCommand extends Command {
    constructor(client) {
        super({
            name: "bassboost",
            description: "Ativa o efeito de reforço de graves do player",
            category: "music",
            aliases: ["bboost", "bass", "bb", "grave"],
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
        let level = args[0]?.toLowerCase()

        if(["none", "off", "rerset", "resetar"].includes(level)) level = "none"
        
        if((!level || !equalizers[level])) return message.reply({
            embeds: [
                new Discord.MessageEmbed()
                .setColor("RED")
                .setDescription(`**Você precisa informar o nível para o reforço de graves.**`)
                .addField("Níveis:", Object.keys(equalizers).map(x => `\`${x}\``).join("**|**"))
                .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                .setTimestamp()
            ]
        })

        player.effects.setEqualizer(equalizers[level])
        await message.reply({
            embeds: [
                new Discord.MessageEmbed()
                .setColor("#FFF2E7")
                .setDescription(level == "none" ? `**Bassboost desativado.**` : `**Bassboost alterado para \`${level}\`.**`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                .setTimestamp()
            ]
        })
    }
}