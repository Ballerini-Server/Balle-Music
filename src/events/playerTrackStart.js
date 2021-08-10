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
        
        collector.on("collect", async button => {
            console.log("collect!")
        })
    }
}