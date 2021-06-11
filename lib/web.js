const express = require('express')
const EventEmitter = require('events').EventEmitter
const path = require('path')

class WebServer extends EventEmitter {
  constructor (bot, PORT) {
    super()
    this.bot = bot
    this.READY = false
    this.PORT = PORT
    this.app = express()
    this.app.use(express.static(path.join(__dirname, '../public')))
    this.app.get('/textures/current.jpeg', async (req, res) => {
      console.info('Got current.jpeg taking panorama')
      const stream = await this.bot.panoramaImage.takePanoramaPictures()
      res.setHeader('content-type', 'image/jpeg')
      stream.pipe(res)
      stream.on('error', (err) => {
        console.error(err)
      })
    })
    this.app.listen(this.PORT, () => {
      console.info(`Webserver running on port ${this.PORT}`)
      this.emit('ready')
      this.READY = true
    })
  }
}

module.exports = {
  web: WebServer
}
