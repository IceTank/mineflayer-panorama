/**
 * This example launches a website on port 8080 to display panorama images of the bots current location. 
 * To launch this example run 'node browserView.js <host> [port] [email or name] [password]'.
 */

const mineflayer = require('mineflayer')
const panorama = require('../../index').panoramaImage
const server = require('../../lib/web')

if (process.argv.length < 3 || process.argv.length > 6) {
  console.log('Usage : node browserView.js <host> [port] [email or name] [password]')
  process.exit(1)
}

const bot = mineflayer.createBot({
  host: process.argv[2],
  port: process.argv[3] ? parseInt(process.argv[3]) : 25565,
  username: process.argv[4] ? process.argv[4] : 'screenshot',
  password: process.argv[5]
})

bot.once('spawn', async () => {
  console.info('Bot spawned')
  bot.loadPlugin(panorama)
  new server.web(bot, 8080)
  console.info('Ready to use')
})

bot.on('chat', (_, message) => {
  if (message === 'exit') process.exit(0)
}) 

bot.on('kicked', (reason) => {
  console.info('Kicked for reason', reason)
})

bot.on('end', (reason) => {
  console.info('Bot disconnected', reason)
})

bot.on('error', (err) => {
  console.error(err)
})
