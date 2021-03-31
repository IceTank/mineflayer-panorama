const mineflayer = require('mineflayer')
const panorama = require('../../index')
// const Vec3 = require('vec3')

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

bot.on('spawn', async () => {
  bot.loadPlugin(panorama.image)
  await bot.waitForChunksToLoad()
  bot.on('camera_ready', async () => {
    await bot.panoramaImage.takePanoramaPictures('NewTest')
  })
})

bot.on('error', (err) => {
  console.error(err)
})
