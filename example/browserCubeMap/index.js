const mineflayer = require('mineflayer')
const panorama = require('../../index')
const server = require('../../lib/web')

if (process.argv.length < 4 || process.argv.length > 6) {
  console.log('Usage : node screenshot.js <host> <port> [<name>] [<password>]')
  process.exit(1)
}

const bot = mineflayer.createBot({
  host: process.argv[2],
  port: parseInt(process.argv[3]),
  username: process.argv[4] ? process.argv[4] : 'screenshot',
  password: process.argv[5]
})

const web = new server.web(bot, 8080)

bot.on('spawn', async () => {
  console.info('Bot spawned')
  bot.loadPlugin(panorama.image)
  if (!web.READY) {
    await new Promise((resolve) => { web.on('ready', resolve) })
  }
  await bot.waitForChunksToLoad()
  console.info('Ready to use')
})

bot.on('end', (reason) => {
  console.info('Bot disconnected', reason)
})

bot.on('error', (err) => {
  console.error(err)
})
