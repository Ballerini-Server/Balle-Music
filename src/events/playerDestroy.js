import Event from "../structures/Event.js"
import Discord from "discord.js"
import Player from "../structures/music/player/Player.js"


export default class PlayerDestroyEvent extends Event {
    constructor(client) {
        super(client, "playerDestroy", global.__dirname(import.meta))
    }

    /**
     * @param {Player} player
     */
    async run(player) {
        if(player.message) {
            player.message.delete().catch(() => {})
        }
    }
}