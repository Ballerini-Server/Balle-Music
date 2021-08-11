import Event from "../structures/Event.js"
import Player from "../structures/music/player/Player.js"
import Song from "../structures/music/utils/Song.js"
import Discord from "discord.js"
import playerButtons from "../utils/playerButtons.js"
import ButtonCollector from "../structures/collectors/ButtonCollector.js"

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
        if(player.message) player.message.delete().catch(() => {})
        player.message = await player.text.send({
            embeds: [
                new Discord.MessageEmbed()
                .setColor("#FFF2E7")
                .setDescription(`**${track.title}**`)
                .setFooter(`Adicionada por: ${track.requester.tag}`, track.requester.displayAvatarURL({dynamic: true}))
            ],
            components: [
                playerButtons(player)
            ]
        })

        let collector = new ButtonCollector(player.message, { stopOnCollect: false })
        player.message.collector = collector
        
        collector.on("collect", async button => {
            button.deferUpdate().catch(() => {})
            if(this.client.guilds.cache.get(player.id)?.me.voice.channel?.members.get(button.user.id)) {
                switch (button.customId) {
                    case "player_back":
                        if(!player.queue[player.queueIndex - 1]) return
                        player.back()
                    break;

                    case "player_pause":
                        player.pause(true)
                    break;
                    
                    case "player_resume":
                        player.pause(false)
                    break;

                    case "player_skip": 
                        if(!player.queue[player.queueIndex + 1]) return
                        player.skip()
                    break;

                    default:
                        break;
                }
            }
        })
    }
}