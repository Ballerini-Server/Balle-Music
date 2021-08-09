import Event from "../structures/Event.js"
import Discord from "discord.js"

export default class MessageCreateEvent extends Event {
    constructor(client) {
        super(client, "messageCreate", global.__dirname(import.meta))
    }

    /**
     * 
     * @param {Discord.Message} message 
     */
    async run(message) {
        if(message.author.bot || message.channel.type == "dm" || message.webhookID) return;

        const perms = message.channel.permissionsFor(this.client.user.id);
        if(!perms.has("SEND_MESSAGES")) return;

        if(!perms.has("EMBED_LINKS")) return message.quote(`> Eu preciso de permissão de \`Enviar Links\``)
        if(!perms.has("USE_EXTERNAL_EMOJIS")) return message.quote(`> Eu preciso de permissão de \`Usar Emojis Externos\``)
        if(!perms.has("ADD_REACTIONS")) return message.quote(`> Eu preciso de permissão de \`Adicionar Reações\``)
        if(!perms.has("ATTACH_FILES")) return message.quote(`> Eu preciso de permissão de \`Anexar arquivos\``)

        let prefixo
        let prefixs = [`<@${this.client.user.id}>`, `<@!${this.client.user.id}>`, this.client.config.prefix]
        for (let i of prefixs) {
            if(message.content.startsWith(i.toLowerCase())) {
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

        try {
            command.run(message, args);
        } catch (e) {
            messgae.reply({
                embeds: [
                    new MessageEmbed()
                    .setColor("#FF0000")
                    .setDescription("Aconteceu um erro ao executar o comando, que tal reportar ele para a minha equipe?\nVocê pode relatar ele no meu [servidor de suporte](https://discord.gg/8K6Zry9Crx).")
                    .addField("Erro:", `\`\`\`js\n${`${e}`.shorten(1990)}\`\`\``)
                    .setFooter("Desculpa pelo transtorno.")
                ]
            })
        };
    }
}