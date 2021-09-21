import LavalinkManager from "./LavalinkManager.js";
import client from "../../bot.js"

export default class Manager extends LavalinkManager {
    /**
     * 
     * @param {client} client
     */
    constructor(client, nodes, options) {
        super(nodes, options || {}, client);
        this.client = client;
        this.send = packet => {
            if (this.client.guilds.cache) {
                const guild = this.client.guilds.cache.get(packet.d.guild_id);
                if (guild)
                    return guild.shard.send(packet);
            }
            else {
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (guild)
                    return typeof this.client.ws.send === "function" ? this.client.ws.send(packet) : guild.shard.send(packet);
            }
        };
        client.on("ready", () => {
            this.user = client.user.id;
            this.shards = client.options.shardCount || 1;
        });

        client.on("voiceStateUpdate", async (oldState, newState) => {
            if(oldState.channel) {
                if(oldState.channel.members) {
                    if (!oldState.channel.members.has(client.user.id)) {
                        if(!oldState.guild.me.voice.channel) {
                            const player = this.players.get(oldState.guild.id)
                            if(!player) return
                            player.destroy()
                        }
                    }
                }
            }
        })
        
        if (client.guilds.cache && typeof this.client.ws.send === "undefined") {
            client.ws
                .on("VOICE_SERVER_UPDATE", this.voiceServerUpdate.bind(this))
                .on("VOICE_STATE_UPDATE", this.voiceStateUpdate.bind(this))
                .on("GUILD_CREATE", async (data) => {
                for (const state of data.voice_states)
                    await this.voiceStateUpdate({ ...state, guild_id: data.id });
            });
        }
        else {
            client.on("raw", async (packet) => {
                switch (packet.t) {
                    case "VOICE_SERVER_UPDATE":
                        await this.voiceServerUpdate(packet.d);
                        break;
                    case "VOICE_STATE_UPDATE":
                        await this.voiceStateUpdate(packet.d);
                        break;
                    case "GUILD_CREATE":
                        for (const state of packet.d.voice_states)
                            await this.voiceStateUpdate({ ...state, guild_id: packet.d.id });
                        break;
                }
            });
        }
    }
}