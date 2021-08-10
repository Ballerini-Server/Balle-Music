import Discord from "discord.js"
import Player from "../structures/music/player/Player.js"

/**
 * 
 * @param {Player} player 
 */
export default function playerButtons(player) {
    let buttonBack = new Discord.MessageButton()
    .setCustomId(`player_back`)
    .setEmoji("874732388662513694")
    .setStyle(2)
    .setDisabled(player.queue[Number(player.queueIndex) - 1] ? false : true)

    let buttonResume = new Discord.MessageButton()
    .setCustomId(`player_resume`)
    .setEmoji("874732462138335293")
    .setStyle(2)

    let buttonPause = new Discord.MessageButton()
    .setCustomId(`player_pause`)
    .setEmoji("874732236061175859")
    .setStyle(2)

    let buttonNext = new Discord.MessageButton()
    .setCustomId(`player_next`)
    .setEmoji("874732301710397450")
    .setStyle(2)
    .setDisabled(player.queue[Number(player.queueIndex) + 1] ? false : true)

    return new Discord.MessageActionRow()
    .addComponents([
        buttonBack,
        player.paused ? buttonResume : buttonPause,
        buttonNext
    ])
}