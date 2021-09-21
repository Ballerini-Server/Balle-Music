import Command from "../../structures/Command.js"
import Discord from "discord.js"
import Player from "../../structures/music/player/Player.js"
import pretty from "pretty-ms"
import chunk from "../../utils/pagination.js"
import Song from "../../structures/music/utils/Song.js"

export default class QueueCommand extends Command {
    constructor(client) {
        super({
            name: "queue",
            description: "Veja a lista de reprodução do servidor.",
            category: "music",
            aliases: ["q", "fila"],
            dirname: global.__dirname(import.meta),
            requires: {
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
        if(!player.queue.length) return message.reply({
            embeds: [
                new Discord.MessageEmbed()
                .setColor("RED")
                .setDescription("**O servidor não tem uma lista de reprodução.**")
                .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                .setTimestamp()
            ]
        })

        let page = Number(args[0])
        if(!page) page = 1
        page = Math.floor(page)

        let tracks = player.queue.map((track, i) => {
            track.index = Number(i)
            return track
        })

        let chunkTracks = chunk(tracks, 10)
        tracks = chunkTracks[page - 1]
        if(!tracks) return message.reply({
            embeds: [
                new Discord.MessageEmbed()
                .setColor("RED")
                .setDescription("**Página inválida.**")
                .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                .setTimestamp()
            ]
        })

        let des = tracks.map(function(track) {
            let d = !track.isStream ? pretty(track.duration, {colonNotation: true, secondsDecimalDigits: 0}) : "◉ LIVE"
            
            return `**\`${track.index + 1}°\`**. [\`${track.title.shorten(100)}\`](${track.url}) \`[${d}]\``
        })
    
        let embed = new Discord.MessageEmbed()
        .setColor("#FFF2E7")
        .setAuthor(`Lista de reprodução do servidor ${message.guild.name}`)
        .setDescription(`${player.queue[player.queueIndex] ? `**Tocando agora:** \`${player.queueIndex + 1}\`. [\`${player.queue[player.queueIndex].title}\`](${player.queue[player.queueIndex].url}), **${player.queue[player.queueIndex].author}**` : "Nenhuma música tocando no momento"}\n\n${des.join("\n")}`)
        .setFooter(`Pagína: ${page}/${chunkTracks.length} • ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true}))
        .setTimestamp()

        message.reply({
            embeds: [embed]
        })
    }
}
