import Event from "../structures/Event.js"
import Discord from "discord.js"
import Node from "../structures/music/Node.js"

export default class NodeDisconectEvent extends Event {
    constructor(client) {
        super(client, "nodeDisconect", global.__dirname(import.meta))
    }

    /**
     * 
     * @param {Node} node 
     */
    async run(node) {
        console.log(`[LAVALINK]: ${node.id} foi desconectado.`)

        const newNode = this.client.music.idealNodes
        let players = [...this.client.music.players.values()].filter(x => x.node.id == node.id)
        if(!newNode) return;
        players.forEach(player => this.client.music.switch(player, newNode[0]))
        console.log(`O players do node ${node.id} foram mudados para o ${newNode[0].id}`)
    }
}