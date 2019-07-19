const { Command } = require('../utils')
const { inspect } = require('util')

module.exports = class Eval extends Command {
    constructor(name, client) {
        super(name, client)
        this.adminOnly = true
        this.argsRequired = true
        this.examples = ['this.name']
        this.invalidArgsMessage = 'Bota um código seu folgado, eu já faço tudo, faz algo pelo menos, porra!'
        this.usage = '[code]'
    }

    async run(message, args) {
        let code = args.join(' ').replace(/^```(js|javascript ? \n )?|```$/gi, '')
        const codeBlock = (type, arg) => `\`\`\`${type}\n${arg}\`\`\` `
        try {
            console.log(code)
            let msg = await this.result(eval(code))

            console.debug('\n' + msg)

            if (msg.length > 2000)
                msg = 'Mensagem muito longa, vai no console folgado'

            message.channel.send(codeBlock('js', await this.clean(msg)))
        } catch (error) {
            console.error(error)

            message.channel.send(codeBlock('js', error.message))
                .catch(console.error)
        }
    }

    async clean(text) {
        if (text instanceof Promise || (Boolean(text) && typeof text.then === 'function' && typeof text.catch === 'function'))
            text = await text
        if (typeof text !== 'string')
            text = inspect(text, { depth: 0, showHidden: false })

        text = text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`)
        return text
    }

    async result(temp) {
        if (temp && temp[Symbol.toStringTag] === 'AsyncFunction')
            return this.result(await temp())
        if (temp && temp instanceof Promise)
            return this.result(await temp)

        return temp
    }
}
