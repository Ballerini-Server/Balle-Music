import Event from "../structures/Event.js"
import Player from "../structures/music/player/Player.js"
import Song from "../structures/music/utils/Song.js"
import Discord from "discord.js"
import playerButtons from "../utils/playerButtons.js"
import ButtonCollector from "../structures/collectors/ButtonCollector.js"
import pretty from "pretty-ms"
let sources = {
    "youtube": {
        name: "YouTube",
        color: "RED",
        emoji: "<:YouYube:875040802508783706>"
    },
    "soundcloud": {
        name: "Soundcloud",
        color: 16742144,
        emoji: "<:SoundCloud:875040777821102151>"
    },
    "twitch": {
        name: "Twitch",
        color: "#8A2BE2",
        emoji: "<:Twitch:875040836893679627>"
    }
}
let playlistTypes = {
    mix: 'Mix',
    album: 'Álbum',
    playlist: 'Playlist'
}

export default class PlayerTrackStartEvent extends Event {
    constructor(client) {
        super(client, "playerTrackStart", global.__dirname(import.meta))
    }

    /**
     * 
     * @param {Player} player 
     * @param {Song} track 
     */
    async run(player, track) {
        let source = sources[track.source] || {name: track.source, emoji: ":cloud:"}
        if(player.message) {
            if(player.message.collector) player.message.collector.stopAll()
            player.message.delete().catch(() => {})
        }
        
        player.message = await player.text.send({
            embeds: [
                new Discord.MessageEmbed()
                .setColor("#FFF2E7")
                .setAuthor("Tocando agora:")
                .setTitle(`${source.emoji} ${track.title}`)
                .setURL(`${track.url}`)
                .setDescription(`>>> :minidisc:**| Autor:** \`${track.author}\`\n:stopwatch:**| Duração:** \`${pretty(track.duration, {colonNotation: true, secondsDecimalDigits: 0})}\`${track.playlist ? `\n:bookmark_tabs:**| ${playlistTypes[track.playlist.type]}:** [\`${track.playlist.name}\`](${track.playlist.url})` : ""}`)
                .setFooter(`Adicionada por: ${track.requester.tag}`, track.requester.displayAvatarURL({dynamic: true}))
                .setThumbnail(`${track.artwork}`)
            ],
            components: [
                playerButtons(player)
            ]
        })
    }
}