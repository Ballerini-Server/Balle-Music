import Event from "../structures/Event.js"
import Player from "../structures/music/player/Player.js"
import playerButtons from "../utils/playerButtons.js"

export default class PlayerTrackAddEvent extends Event {
    constructor(client) {
        super(client, "playerTrackAdd", global.__dirname(import.meta))
    }

    /**
     * 
     * @param {Player} player
     */
    async run(player) {
        if(player.leaveTimeout) {
            clearTimeout(player.leaveTimeout)
            player.leaveTimeout = null
        }
        
        if(player.message) player.message = await player.message.edit({
            components: [
                playerButtons(player)
            ]
        }).catch(() => {})

    }
}