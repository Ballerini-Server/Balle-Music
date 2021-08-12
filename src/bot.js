import dirnameConfig from "./utils/dirname.js"
dirnameConfig()
import './functions/shorten.js'

import { Client, Intents } from "discord.js"
import config from "./config/config.js"
import commandHandler from "./handlers/commandHandler.js"
import eventHandler from "./handlers/eventHandler.js"
import Manager from "./structures/music/Manager.js"

class BalleMusic extends Client {
    constructor() {
        super({
            intents: 1719
        })

        this.config = config
        this.music = new Manager(this, this.config.lavalink_nodes, {
            user: "874354515330089020"
        })

        this.on("interactionCreate", interaction => {
            if(interaction.isButton() && this.listenerCount("clickButton")) this.emit("clickButton", interaction)
            if(interaction.isSelectMenu() && this.listenerCount("clickMenu")) this.emit("clickMenu", interaction)
        })
    }

    loadCommands() {
        this.commands = []
        return commandHandler(this)
    }

    loadEvents() {
        this.events = []
        return eventHandler(this)
    }

    init() {
        this.loadCommands()
        this.loadEvents()
        this.login(this.config.token)
    }
}

const client = new BalleMusic()
export default client

client.init()