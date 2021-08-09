import Command from "../../structures/Command.js"
import Discord from "discord.js"
let coderegex = /^```(?:js)?\s(.+[^\\])```$/is;
import { exec } from "child_process"
import Util from "util"

export default class NameCommand extends Command {
    constructor(client) {
        super({
            name: "eval",
            description: "Execute um código JavaScript.",
            category: "R2D2",
            aliases: ["evl", "e"],
            dirname: global.__dirname(import.meta)
        }, client)
    }

    /** 
    * @param {Discord.Message} message
    * @param {Array} args
    */

    async run(message, args) {
        if(!this.client.config.devs.includes(message.author.id)) return message.reply({
            embeds: [
                new Discord.MessageEmbed()
                .setColor("RED")
                .setDescription("**Apenas meus desenvolvedores podem usar este comando!**")
                .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                .setTimestamp()
            ]
        })
        if(!args[0]) return message.reply({
            embeds: [
                new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription('**Você precisa fornecer um código para executar o eval!**')
                .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                .setTimestamp()
            ]
        })

        let evalAsync = false
        let evalBash = false
        
        if(args[0].toLowerCase() == "--async") {
            evalAsync = true
            args.shift()
        }
        if(args[0].toLowerCase() == "--terminal") {
            evalBash = true
            args.shift()
        }
        
        let conteudo = args.join(" ")
        if(coderegex.test(conteudo)) conteudo = conteudo.replace(coderegex, "$1")

        const start = Date.now()
        try {
            let result;
            if(evalBash == true) result = consoleRun(conteudo)
            else if(evalAsync == true) result = await eval(`(async() => { ${conteudo} })()`)
            else result = await eval(conteudo)

            if (result instanceof Promise) {
                result = await result
            }

            if (typeof result !== 'string') result = await Util.inspect(result, { depth: 0 })
            else result = `"${result}"`
            let end = (Date.now() - start)

            resultado(this.client, message, result)
        } catch (e) {
            resultado(this.client, message, e)
        }
    }
}

async function resultado(client, message, result) {
    message.reply({
        content: "```js\n" + `${result}`.replace(client.token, "🙃").slice(0, 1990) + "```"
    })
}

function consoleRun(command) {
    return new Promise((resolve, reject) => {
        exec(command, (err, stout, sterr) => err || sterr ? reject(err || sterr) : resolve(stout.replace(/\\r|\\n/g, '')))
    })
}