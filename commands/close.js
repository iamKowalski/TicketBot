const { Command } = require('../utils')
const { RichEmbed } = require('discord.js')

module.exports = class Close extends Command {
    constructor(name, client) {
        super(name, client)

        this.aliases = ['fechar']
    }

    async run(message) {
        const embed = new RichEmbed().setColor('RANDOM')
        const role = message.guild.roles.find(r => r.name === '🎓 Staff')
        const role1 = message.guild.roles.find(r => r.name === '🎓 Superior')
        if (!message.member.roles.some(r => r.name === role.name || r.name === role1.name)) return message.channel.send('Você não possui o cargo necessário para fechar os tickets!')
        if (!message.channel.name.startsWith('ticket-')) return message.channel.send(embed.setDescription(`Este não é um canal de ticket!`))

        message.channel.delete()
    }
}