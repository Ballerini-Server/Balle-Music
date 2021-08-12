import CollectorBase from "./BaseCollector.js"
import { ButtonInteraction } from "discord.js"

export default class ButtonCollector extends CollectorBase {

  constructor (message, options = {}) {
    super(message.client)

    this.options = {
      time: options.time ? options.time : null,
      user: options.user ? options.user : null,
      message: options.message ? options.message : message,
      max: options.max ? options.max : 1,
      stopOnCollect: options.stopOnCollect == undefined ? true : !!options.stopOnCollect,
      button: options.buttonID
    }

    if(this.options.time) this.createTimeout(this.options.time)
    this.client.on('clickButton', (button) => {
      this.collect(button)
    })

    this.on("end", () => {
      this.client.removeListener("clickButton", (button) => {
        this.collect(button)
      })
    })
  }

  /**
   * 
   * @param {ButtonInteraction}  button 
   * @returns 
   */

  collect(button) {
    if(this.ended) return
    if(
      button.message.id != this.options.message.id
      ||
      (this.options.user && button.user.id != this.options.user.id)
    ) return

    if(this.options.button && button.customId != this.options.button) return

    this.emit('collect', button)

    this.collectedSize += 1
    this.collected.push({
       message: button.message,
      button: button,
      user: button.user
    })
    if (this.options.stopOnCollect) return this.stopAll()
  }
}