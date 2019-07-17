const { Command } = require('../utils')
const { RichEmbed, ReactionCollector } = require('discord.js')
const inChannel = []

module.exports = class Create extends Command {
    constructor(name, client) {
        super(name, client)

        this.aliases = ['ticket']
    }

    async run(message) {
        const embed = new RichEmbed().setColor('RANDOM')
        const role = message.guild.roles.find(r => r.name === '🎓 Staff')
        const role1 = message.guild.roles.find(r => r.name === '🎓 Superior')
        const role2 = message.guild.roles.find(r => r.name === '@everyone')
        if (message.channel.id !== process.env.TICKET_CHANNEL) return message.channel.send(embed.setDescription(`Os tickets só podem ser criados no canal <#${process.env.TICKET_CHANNEL}>`))
        if (inChannel.includes(message.author.id)) return message.channel.send(embed.setDescription(`Você já tem um ticket aberto...\nO uso abusivo deste comando pode resultar em **punições**!`))

        const c = await message.guild.createChannel(`ticket-${message.author.username}`)

        c.overwritePermissions(role, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        c.overwritePermissions(role1, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        c.overwritePermissions(role2, {
            SEND_MESSAGES: false,
            READ_MESSAGES: false
        });
        c.overwritePermissions(message.author, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });

        inChannel.push(message.author.id)

        const reply = await message.reply(embed.setDescription(`Seu canal de ajuda foi criado!\nClique aqui => ${c}`))

        const msg = await c.send(`${message.author}, espere até que algum de nossos ${role} ou um de nossos ${role1} venha até aqui!`, embed.setDescription(`${message.author} criou este canal!`))
        await c.setTopic(`Após acabar, clique na reação :x: ou use o comando **${process.env.PREFIX}close** para fechar o canal!`)
        await msg.react('❌')
        const filter = (r, u) => r.me && message.guild.member(u.id).roles.some(r => r.name === role.name || r.name === role1.name)
        const collector = new ReactionCollector(msg, filter, { maxUsers: 1, maxEmojis: 1 })
        collector.on('collect', async r => {
            collector.stop()
            message.delete()
            c.delete()
            reply.delete()
            inChannel.splice(inChannel.indexOf(message.author.id), 1)
        })
    }
}