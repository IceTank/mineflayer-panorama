const mineflayer = require('mineflayer')
const panorama = require('../../index')
const fs = require('fs')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const Vec3 = require('vec3')

if (process.argv.length < 4 || process.argv.length > 6) {
  console.log('Usage : node screenshot.js <host> <port> [<name>] [<password>]')
  process.exit(1)
}

let panoramaReady = false
let imageCounter = 0

const bot = mineflayer.createBot({
  host: process.argv[2],
  port: parseInt(process.argv[3]),
  username: process.argv[4] ? process.argv[4] : 'screenshot',
  password: process.argv[5]
})

bot.on('spawn', async () => {
  console.info('Bot spawned')
  bot.loadPlugins([panorama.panoramaImage, pathfinder])
  bot.pathfinder.setMovements(new Movements(bot, require('minecraft-data')(bot.version)))
  await bot.waitForChunksToLoad()
  bot.chat('Ready!')
  console.info('Ready to use')
  panoramaReady = true
})

bot.on('chat', async (username, message) => {
  if (username === bot.username) return
  if (message.startsWith('pano')) {
    const cmd = message.split(' ')
    let fileName
    let pos = null
    if (message === 'pano') {
      fileName = 'next'
    } else if (cmd.length === 3) {
      fileName = cmd[1]
      pos = Number(cmd[2])
    } else if (cmd.length === 5) {
      fileName = cmd[1]
      pos = new Vec3(cmd[2], cmd[3], cmd[4])
    } else {
      bot.chat('Usage: pano [<filename> | [<camera Height> | (<x> <y> <z>)]]')
      return
    }
    bot.chat('Taking panorama Image')
    const imageName = await takePanorama(fileName, pos)
    bot.chat('Finished saving ' + imageName)
  } else if (message === 'come') {
    if (!bot.players[username]) {
      bot.chat('I can\'t see you')
      return
    }
    const { x, y, z } = bot.players[username].entity.position
    bot.pathfinder.setGoal(new goals.GoalNear(x, y, z, 2))
  } else if (message === 'stop') {
    bot.pathfinder.setGoal(null)
  } else if (message === 'follow') {
    if (!bot.players[username]) {
      bot.chat('I can\'t see you')
      return
    }
    const target = bot.players[username].entity
    bot.pathfinder.setGoal(new goals.GoalFollow(target, 2), true)
  } else if (message === 'f') {
    bot.chat('F in chat')
    bot.quit()
    process.exit(0)
  }
})

async function takePanorama (fileName, pos) {
  const fileStream = await bot.panoramaImage.takePanoramaPictures(pos)
  if (fileName === 'next') {
    fileName = 'image' + String(imageCounter).padStart(4, '0')
    imageCounter++
  }
  console.info('Checking files')
  let stats
  try {
    stats = await fs.promises.stat('./screenshots')
  } catch (e) {
    if (!stats?.isDirectory()) {
      console.info('Making new folder screenshots')
      await fs.promises.mkdir('./screenshots')
    }
  }
  console.info('Writing file')
  const file = fs.createWriteStream('./screenshots/' + fileName + '.jpeg')
  fileStream.pipe(file)
  fileStream.on('error', (err) => {
    console.error(err)
  })
  return new Promise((resolve) => {
    file.on('finish', () => {
      resolve(fileName)
    })
  })
}

bot.on('end', (reason) => {
  console.info('Bot disconnected', reason)
})

bot.on('error', (err) => {
  console.error(err)
})
