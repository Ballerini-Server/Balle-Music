import Command from "../../structures/Command.js"
import Discord from "discord.js"
import Player from "../../structures/music/player/Player.js"
import pretty from "pretty-ms"
import MenuSelectCollector from "../../structures/collectors/MenuSelectCollector.js"
import getSearch from "../../utils/getSearch.js"
let sources = {
    "youtube": "<:YouYube:875040802508783706>",
    "soundcloud": "<:SoundCloud:875040777821102151>",
    "twitch": "<:Twitch:875040836893679627>",
    "jamendo": "<:Jamendo:881968488636350526>"
}

const a = /^(.*?)--(soundcloud|sc|youtube\s?music|ytm|youtube|yt|jamendo|jm)$/gi

export default class SearchCommand extends Command {
    constructor(client) {
        super({
            name: "search",
            description: "Procure uma música",
            category: "music",
            aliases: ["buscar", "sc"],
            dirname: global.__dirname(import.meta),
            requires: {
                memberVoiceChannel: true
            }
        }, client)
    }

    /** 
    * @param {Discord.Message} message
    * @param {String[]} args
    * @param {Player} player
    */

    async run(message, args, player) {
        if(!args[0]) return message.reply({
            embeds: [
                new Discord.MessageEmbed()
                .setColor("RED")
                .setDescription("**Você precisa informar a música para eu procurar.**")
                .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                .setTimestamp()
            ]
        })
        
        if(!player) player = await this.client.music.join({ 
            guild: message.guild.id, 
            channel: message.member.voice.channel.id, 
            node: this.client.music.idealNodes[0].id 
        }, { selfdeaf: true })
        player.text = message.channel

        let search = getSearch(args.join(" "))
        const results = await player.searchSongs(search, message.author)

        if(results.loadType == 'LOAD_FAILED') return message.reply({
            embeds: [
                new Discord.MessageEmbed()
                .setColor("RED")
                .setDescription("**Aconteceu um erro ao carregar a música.**")
                .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                .setTimestamp()
            ]
        }).catch(() => {})
        else if(results.loadType == 'NO_MATCHES') {
            if(player.queue.totalSize == 0) client.music.leave(message.guild.id)
            return message.reply({
                embeds: [
                    new Discord.MessageEmbed()
                    .setColor("RED")
                    .setDescription("**Não consegui achar a música.**")
                    .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                ]
            }).catch(() => {})
        }
        else if(results.loadType == 'PLAYLIST_LOADED') {
            player.queue.push(results.tracks)

            message.reply({
                embeds: [
                    new Discord.MessageEmbed()
                    .setColor("#FFF2E7")
                    .setDescription(`${results.playlistInfo.name} | ${results.tracks.length} Músicas`)
                    .setFooter(`Soliticado por: ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true}))
                ]
            }).catch(() => {})

            if(!player.queue.current) player.play()
        } else {
            let menu = new Discord.MessageSelectMenu()
            .setCustomId("search_menu")
            .setPlaceholder("Escolha a música.")
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions(results.tracks.slice(0, 25).map(function(track, i) {
                let a = ` | ${!track.isStream ? pretty(track.duration, {colonNotation: true, secondsDecimalDigits: 0}) : "◉ LIVE"}`
                return {
                    label: track.title.length > 100 ? track.title.slice(0, 97) + "..." : track.title,
					description: `${track.author.length > (100 - a.length) ? track.author.slice(0, (100 - a.length) - 3) + "..." : track.author}${a}`,
					value: `${i}`
                }
            }))

            let msg = await message.reply({
                content: `${sources[results.tracks[0].source] ? sources[results.tracks[0].source] : "🔎"} Resultados para a busca \`${args.join(" ").replace(a, "$1").length > 300 ? args.join(" ").replace(a, "$1").slice(0, 297) + "..." : args.join(" ").replace(a, "$1")}\`:`,
                components: [
                    new Discord.MessageActionRow()
                    .addComponents([menu])
                ]
            }).catch(() => {})
            
            let coletor = msg.createMessageComponentCollector({
                filter: (i) => i.user.id == message.author.id,
                max: 1,
                time: 1 * 1000 * 60
            })

            coletor.on("collect", async menu => {
                await menu.deferUpdate().catch(() => {})
                const track = results.tracks[menu.values[0]]

                player.queue.push(track)
                if(!player.queue.current) player.play()
                await msg.edit({
                    content: null,
                    embeds: [
                        new Discord.MessageEmbed()
                        .setColor("#FFF2E7")
                        .setDescription(`[\`${track.title}\`](${track.url}) - \`${!track.isStream ? pretty(track.duration, {colonNotation: true, secondsDecimalDigits: 0}) : "◉ LIVE"}\``)
                        .setFooter(`Soliticado por: ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true}))
                    ],
                    components: []
                }).catch(() => {})

            })

            coletor.on("end", async() => {

            })
        }
    }
}
