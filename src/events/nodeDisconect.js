import Event from "../structures/Event.js"
import Discord from "discord.js"
import Node from "../structures/music/Node.js"
import Player from "../structures/music/player/Player.js"

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
    
        /**
         * @type {Player[]}
         */
        const players = [...this.client.music.players.values()].filter(x => x.node.id == node.id)
        const newNode = this.client.music.idealNodes
        if(!newNode.length || !players.length) return players.forEach(player => {
            player.text.send({
                embeds: [
                    new Discord.MessageEmbed()
                    .setColor("RED")
                    .setDescription(`**Perdi conexão com o Node **\`${node.name}\`** e não posso continuar a tocar.**`)
                    .setTimestamp()
                ]
            })
            player.destroy()
        });

        players.forEach(player => {
            this.client.music.switch(player, newNode[0])
            player.text.send({
                embeds: [
                    new Discord.MessageEmbed()
                    .setColor("#FFF2E7")
                    .setDescription(`**Troqui o Node **\`${node.name}\`** para o node **\`${newNode[0].name}\`**.**`)
                    .setTimestamp()
                ]
            })
        })
        console.log(`O players do node ${node.id} foram mudados para o ${newNode[0].id}`)
    }
}