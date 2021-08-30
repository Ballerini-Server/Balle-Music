import Event from "../structures/Event.js"
import Discord from "discord.js"
import Player from "../structures/music/player/Player.js"


export default class PlayerQueueEndEvent extends Event {
    constructor(client) {
        super(client, "playerQueueEnd", global.__dirname(import.meta))
    }

    /**
     * @param {Player} player
     */
    async run(player) {
        if(player.message) {
            if(player.message.collector) player.message.collector.stopAll()
            player.message.delete().catch(() => {})
        }

        player.message = await player.text.send({
            embeds: [
                new Discord.MessageEmbed()
                .setColor("#FFF2E7")
                .setAuthor("Fila de reprodução acabou.")
                .setDescription(`**A queue acabou, irei sair do canal de voz em 3 minutos se você não adicionar nada na queue.**`)
                .setTimestamp()
            ]
        })
        let timeout = setTimeout(function() {
            if(player.queue.current && player.playing || !player.leaveTimeout) return;
            player.destroy()
            if(player.message) player.message.delete().catch(() => {})
        }, 3 * 1000 * 60)

        player.leaveTimeout = timeout
    }
}