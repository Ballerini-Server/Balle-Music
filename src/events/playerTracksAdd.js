import Event from "../structures/Event.js"
import Player from "../structures/music/player/Player.js"
import playerButtons from "../utils/playerButtons.js"

export default class PlayerTracksAddEvent extends Event {
    constructor(client) {
        super(client, "playerTracksAdd", global.__dirname(import.meta))
    }

    /**
     * 
     * @param {Player} player
     */
    async run(player) {
        if(player.message) player.message = await player.message.edit({
            components: [
                playerButtons(player)
            ]
        }).catch(() => {})

        if(player.leaveTimeout) clearTimeout(player.leaveTimeout) && delete player.leaveTimeout
    }
}