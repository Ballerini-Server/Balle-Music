import Command from "../../structures/Command.js"
import Discord from "discord.js"
import Player from "../../structures/music/player/Player.js"

export default class NameCommand extends Command {
    constructor(client) {
        super({
            name: "help",
            description: "Veja os meus comandos",
            category: "bot",
            aliases: ["ajuda", "comandos", "cmds", "commands"],
            dirname: global.__dirname(import.meta)
        }, client)
    }

    /** 
    * @param {Discord.Message} message
    * @param {String[]} args
    * @param {Player} player
    */

    async run(message, args, player) {
        const embed = new Discord.MessageEmbed()
        .setAuthor("Ajuda " + this.client.user.username, this.client.user.displayAvatarURL())
        .setDescription("**Essas são as categorias e comandos que podem ser usados:**")
        .setColor("#FFF2E7")
        .setThumbnail("https://i.imgur.com/7CGXs55.png")

        this.client.categories.map((x) => {
            embed.addField(this.client.config.categories[x], this.client.commands.filter(c => c.category == x).map(c => `\`${c.name}\``).join("**|**"))
        })

        message.reply({
            embeds: [embed]
        })
    }
}
