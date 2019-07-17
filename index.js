require('dotenv').config()

const TicketBot = require('./TicketBot.js')
const client = new TicketBot({ fetchAllMembers: true, disableEveryone: true })
client.login(process.env.TOKEN)