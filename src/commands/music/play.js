import Command from "../../structures/Command.js"
import Discord from "discord.js"
import Player from "../../structures/music/player/Player.js"
import { URL } from "url"
import pretty from "pretty-ms"

export default class PlayCommand extends Command {
    constructor(client) {
        super({
            name: "play",
            description: "Toque uma música",
            category: "music",
            aliases: ["p", "tocar"],
            dirname: global.__dirname(import.meta),
            requires: {
                memberVoiceChannel: true
            }
        }, client)
    }

    /** 
    * @param {Discord.Message} message
    * @param {Array} args
    * @param {Player} player
    */

    async run(message, args, player) {
        if(!player) player = await this.client.music.join({ 
            guild: message.guild.id, 
            channel: message.member.voice.channel.id, 
            node: this.client.music.idealNodes[0].id 
        }, { selfdeaf: true })
        player.text = message.channel

        let search
        try {
            new URL(args.join(' '))
            search = args.join(' ')
        } catch(_) {
            search = `ytsearch:${args.join(' ')}`
        }

        const results = await player.searchSongs(search, message.author)

        if(results.loadType == 'LOAD_FAILED') return message.reply({
            embeds: [
                new Discord.MessageEmbed()
                .setColor("RED")
                .setDescription("**Aconteceu um erro ao carregar a música.**")
            ]
        })
        else if(results.loadType == 'NO_MATCHES') {
            if(player.queue.totalSize == 0) client.music.leave(message.guild.id)
            return message.reply({
                embeds: [
                    new Discord.MessageEmbed()
                    .setColor("RED")
                    .setDescription("**Não consegui achar a música.**")
                ]
            })
        }
        else if(results.loadType == 'PLAYLIST_LOADED') {
            results.tracks.map(t => player.queue.push(t));

            message.reply({
                embeds: [
                    new Discord.MessageEmbed()
                    .setColor("#E0FFFF")
                    .setDescription(`${results.playlistInfo.name} | ${results.tracks.length} Músicas`)
                ]
            })

            if(!player.queue.current) player.play()
        } else {
            player.queue.push(results.tracks[0])

            if(!player.queue.current) player.play()
            else message.reply({
                embeds: [
                    new Discord.MessageEmbed()
                    .setColor("#E0FFFF")
                    .setDescription(`[\`${results.tracks[0].title}\`](${results.tracks[0].url}) - \`${!results.tracks[0].isStream ? pretty(results.tracks[0].duration, {colonNotation: true, secondsDecimalDigits: 0}) : "◉ LIVE"}\``)
                    .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                ]
            })
        }
    }
}