import CollectorBase from "./BaseCollector.js"
import { SelectMenuInteraction } from "discord.js"

export default class MenuSelectCollector extends CollectorBase {

    constructor (message, options = {}) {
        super(message.client)

        this.options = {
            time: options.time ? options.time : null,
            user: options.user ? options.user : null,
            message: options.message ? options.message : message,
            max: options.max ? options.max : 1,
            stopOnCollect: options.stopOnCollect == undefined ? true : !!options.stopOnCollect,
            menu: options.menuID
        }

        if(this.options.time) this.createTimeout(this.options.time)
        this.client.on('clickMenu', (menu) => {
            this.collect(menu)
        })

        this.on("end", () => {
            this.client.removeListener("clickMenu", (menu) => {
                this.collect(menu)
            })
        })
    }

    /**
     * 
     * @param {SelectMenuInteraction} menu 
     * @returns 
     */
    collect(menu) {
        if(this.ended) return
        if(
            menu.message.id != this.options.message.id
            ||
            (this.options.user && menu.user.id != this.options.user.id)
        ) return
    
        if(this.options.menu && menu.customId != this.options.menu) return
    
        this.emit('collect', menu)
    
        this.collectedSize += 1
        this.collected.push({
            message: menu.message,
            menu: menu,
            user: menu.user
        })
        if (this.options.stopOnCollect) return this.stopAll()
    }

}