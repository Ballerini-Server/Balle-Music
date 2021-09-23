import Event from "../structures/Event.js"
import Discord from "discord.js"
import Sydb from "sydb"
const db = new Sydb("src/database/guilds")

export default class MessageCreateEvent extends Event {
    constructor(client) {
        super(client, "messageCreate", global.__dirname(import.meta))
    }

    /**
     * 
     * @param {Discord.Message} message 
     */
    async run(message) {
        if(message.author.bot || message.channel.type == "dm" || message.webhookID || message.channel.id !== '789901824181665853') return;

        const perms = message.channel.permissionsFor(this.client.user.id);
        if(!perms.has("SEND_MESSAGES")) return;

        if(!perms.has("EMBED_LINKS")) return message.reply(`> Eu preciso de permissão de \`Enviar Links\``)
        if(!perms.has("USE_EXTERNAL_EMOJIS")) return message.reply(`> Eu preciso de permissão de \`Usar Emojis Externos\``)
        if(!perms.has("ADD_REACTIONS")) return message.reply(`> Eu preciso de permissão de \`Adicionar Reações\``)
        if(!perms.has("ATTACH_FILES")) return message.reply(`> Eu preciso de permissão de \`Anexar arquivos\``)
        
        const _prefix = db.ref(`guilds/${message.guild.id}/prefix`).val() || this.client.config.prefix
        if(new RegExp(`^<@!?${this.client.user.id}>$`, 'i').test(message.content)) return message.reply({
            content: `Olá ${message.author.toString()}, meu prefixo nesse servidor é \`${_prefix}\`, mas você também pode me mencionar(\`@${this.client.user.username}\`) para usar algum comando.`
        })
        let prefixo
        let prefixs = [`<@${this.client.user.id}>`, `<@!${this.client.user.id}>`, _prefix]
        for (let i of prefixs) {
            if(message.content.startsWith(i.toLowerCase() + " ")) {
                prefixo = i + " "
                break;
            } else if(message.content.startsWith(i.toLowerCase())) {
                prefixo = i
                break;
            }
        }
        if(!prefixo) return;
        if(!message.content.startsWith(prefixo.toLowerCase())) return;

        const args = message.content.trim().slice(prefixo.length).split(/ +/g);
        let command = args.shift().toLowerCase();
        if(!command) return;
        command = this.client.commands.find(c => c.name == command || (c.aliases && c.aliases.includes(command)))
        if(!command) return;

        let player = this.client.music.players.get(message.guild.id)

        if(command.requires?.player && !player) return message.reply({
            embeds: [
                new Discord.MessageEmbed()
                .setColor("RED")
                .setDescription("**Eu não tenho um player nesse servidor!**")
                .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                .setTimestamp().setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                .setTimestamp()
            ]
        }) 
        
        if(command.requires?.memberVoiceChannel) {
            if(!this.client.music.idealNodes[0]) return message.reply({
                embeds: [
                    new Discord.MessageEmbed()
                    .setColor("RED")
                    .setDescription("**Estou sem conexão com meus nodes! Tente novamente depois.**")
                    .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                ]
            })
            const channel = message.member.voice.channel
            if(!channel) return message.reply({
                embeds: [
                    new Discord.MessageEmbed()
                    .setColor("RED")
                    .setDescription("**Você precisa estar em um canal de voz!**")
                    .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                ]
            })
            if(channel.id !== '789901847963631657') return message.reply({
                embeds: [
                    new Discord.MessageEmbed()
                    .setColor("RED")
                    .setDescription("**Você precisa estar no canal de voz de música!**")
                    .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                ]
            })
            if(player && message.guild.me.voice.channel && message.guild.me.voice.channel.id !== channel.id) return message.reply({
                embeds: [
                    new Discord.MessageEmbed()
                    .setColor("RED")
                    .setDescription("**Você precisa estar no mesmo canal de voz que o meu!**")
                    .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                ]
            })
            if(!channel.permissionsFor(this.client.user.id).has(1048576n)) return message.reply({
                embeds: [
                    new Discord.MessageEmbed()
                    .setColor("RED")
                    .setDescription("**Eu não tenho permissão para conectar no seu canal de voz!**")
                    .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                ]
            })
            if(!channel.permissionsFor(this.client.user.id).has(2097152n)) return message.reply({
                embeds: [
                    new Discord.MessageEmbed()
                    .setColor("RED")
                    .setDescription("**Eu não tenho permissão para falar no seu canal de voz!**")
                    .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                ]
            })
        }

        try {
            await command.run(message, args, player);
        } catch (e) {
            console.log(e)
            message.reply({
                embeds: [
                    new Discord.MessageEmbed()
                    .setColor("#FF0000")
                    .setDescription("Aconteceu um erro ao executar o comando.")
                    .addField("Erro:", `\`\`\`js\n${`${e}`.slice(0, 1990)}\`\`\``)
                    .setFooter("Desculpa pelo transtorno.")
                ]
            })
        };
    }
}
