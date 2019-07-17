module.exports = function onReady() {
    this.user.setPresence({
        game: {
            name: `${process.env.PREFIX}create`
        }
    })
    console.log(`${this.user.tag} online!`)
}