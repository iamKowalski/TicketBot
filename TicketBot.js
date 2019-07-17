const { Client, Collection } = require('discord.js')
const Fs = require('fs')

module.exports = class TicketBot extends Client {
    constructor(options = {}) {
        super(options)

        this.commands = new Collection()

        this.initCommands()
        this.initListeners()
    }

    initCommands(path = './commands') {
        Fs.readdirSync(path)
            .forEach(file => {
                try {
                    let filePath = path + '/' + file
                    if (file.endsWith('.js')) {
                        const Command = require(filePath)
                        const commandName = file.replace(/.js/g, '').toLowerCase()
                        const command = new Command(commandName, this)
                        return this.commands.set(commandName, command)
                    } else if (Fs.lstatSync(filePath).isDirectory()) {
                        this.initCommands(filePath)
                    }
                } catch (error) {
                    console.error(error)
                }
            })
    }

    initListeners(path = './listeners') {
        Fs.readdirSync(path)
            .forEach(file => {
                try {
                    let filePath = path + '/' + file
                    if (file.endsWith('.js')) {
                        let Listener = require(filePath)
                        this.on(file.replace(/.js/g, ''), Listener)
                    }

                    let stats = Fs.lstatSync(filePath)
                    if (stats.isDirectory()) {
                        this.initListeners(filePath)
                    }
                } catch (error) {
                    console.error(error)
                }
            })
    }

}