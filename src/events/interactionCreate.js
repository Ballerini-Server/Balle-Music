import Event from "../structures/Event.js"
import Discord from "discord.js"

export default class NameEvent extends Event {
    constructor(client) {
        super(client, "interactionCreate", global.__dirname(import.meta))
    }

    /**
     * 
     * @param {Discord.ButtonInteraction} interaction 
     */
    async run(interaction) {
        if(!interaction.isButton()) return;

        interaction.deferUpdate().catch(() => {})
        const player = this.client.music.players.get(interaction.guild.id)
        if(this.client.guilds.cache.get(player.id)?.me.voice.channel?.members.get(interaction.user.id)) {
            switch (interaction.customId) {
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
    }
}