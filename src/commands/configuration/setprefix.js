import Command from "../../structures/Command.js"
import Discord from "discord.js"
import Sydb from "sydb"
const db = new Sydb("src/database/guilds")

export default class SetPrefixCommand extends Command {
    constructor(client) {
        super({
            name: "setprefix",
            description: "Defina/desative o prefixo personalizado do servidor.",
            category: "configuration",
            aliases: ["prefix", "prefixset"],
            dirname: global.__dirname(import.meta)
        }, client)
    }

    /** 
    * @param {Discord.Message} message
    * @param {String[]} args
    */

    async run(message, args) {
        if(!message.author.hasPermission('MANAGE_CHANNELS')){
            return message.reply({
                embeds: [
                    new Discord.MessageEmbed()
                    .setColor("RED")
                    .setDescription("**Você precisa de permissão para setar o novo prefixo para o servidor.**")
                    .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                ]
            })   
        }
        if(!args[0]) return message.reply({
            embeds: [
                new Discord.MessageEmbed()
                .setColor("RED")
                .setDescription("**Você precisa informar o novo prefixo para o servidor.**")
                .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                .setTimestamp()
            ]
        })

        if(["reset", "resetar", "off", this.client.config.prefix].includes(args.join(" ").toLowerCase())) {
            db.ref(`guilds/${message.guild.id}/prefix`).delete()
            return message.reply({
                embeds: [
                    new Discord.MessageEmbed()
                    .setColor("#FFF2E7")
                    .setDescription(`**Prefixo do servidor foi resetado para \`${this.client.config.prefix}\`**`)
                    .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                ]
            })
        }

        const prefix = args.join(" ")
        if(prefix.length > 5) return message.reply({
            embeds: [
                new Discord.MessageEmbed()
                .setColor("RED")
                .setDescription(`**O prefixo deve ter no máximo 5 caracteres.**`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                .setTimestamp()
            ]
        }) 

        db.ref(`guilds/${message.guild.id}/prefix`).set(prefix.toLowerCase())
        message.reply({
            embeds: [
                new Discord.MessageEmbed()
                .setColor("#FFF2E7")
                .setDescription(`**Prefixo do servidor foi alterado para \`${prefix}\`**`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                .setTimestamp()
            ]
        })
    }
}
