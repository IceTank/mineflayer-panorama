/**
 * This example launches a website on port 8080 to display panorama images of the bots current location. 
 * To launch this example run 'node simpleImage.js <host> [port] [email or name] [password]'.
 */

const mineflayer = require('mineflayer')
const { pathfinder, goals, Movements } = require('mineflayer-pathfinder')
const fs = require('fs')
const { Vec3 } = require('vec3')
const image = require('../../index').image

console.info('Hallo')

if (process.argv.length < 3 || process.argv.length > 6) {
  console.log('Usage : node simplePicture.js <host> [port] [email or name] [password]')
  process.exit(1)
}

const bot = mineflayer.createBot({
  host: process.argv[2],
  port: process.argv[3] ? parseInt(process.argv[3]) : 25565,
  username: process.argv[4] ? process.argv[4] : 'picture',
  password: process.argv[5]
})

imageReady = false
 
bot.once('spawn', async () => {
  console.info('Bot spawned')
  bot.loadPlugins([image, pathfinder])
  bot.pathfinder.setMovements(new Movements(bot, require('minecraft-data')(bot.version)))
  await bot.waitForChunksToLoad()
  bot.chat('Ready!')
  console.info('Ready to use')
  imageReady = true
})

bot.on('chat', async (username, message) => {
  if (username === bot.username) return
  if (!imageReady) return bot.chat('No yet ready')
  
  const target = bot.players[username]

  if (message === 'look') {
    if (!target) return bot.chat('I can\'t see you!')
    let p = target.entity.position
    bot.lookAt(p.offset(0, target.entity.height, 0), true)
  } else if (message.startsWith('image')) {
    let [, name] = message.split(' ')
    if (!name) name = 'image'
    let { pitch, yaw } = bot.entity
    let direction = getViewVector(pitch, yaw)
    await takePicture(name, bot.entity.position.offset(0, bot.entity.height, 0), direction)
    bot.chat('Took picture ' + name + '.jpg')
  } else if (message === 'come') {
    if (!target) return bot.chat('I can\'t see you!')
    let {x, y, z} = target.entity.position
    bot.pathfinder.setGoal(new goals.GoalNear(x, y, z, 2))
  } else if (message === 'follow') {
    if (!target) return bot.chat('I can\'t see you!')
    bot.pathfinder.setGoal(new goals.GoalFollow(target.entity, 2), true)
  } else if (message === 'stop') {
    bot.pathfinder.setGoal(null)
  } else if (message === 'exit') {
    bot.end()
    process.exit(0)
  }
})

async function takePicture (fileName, pos, direction) {
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
  console.info('Taking image')
  const fileStream = await bot.image.takePicture(pos, direction)
  console.info('Writing file')
  const file = fs.createWriteStream('./screenshots/' + fileName + '.jpg')
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

function getViewVector (pitch, yaw) {
  const csPitch = Math.cos(pitch)
  const snPitch = Math.sin(pitch)
  const csYaw = Math.cos(yaw)
  const snYaw = Math.sin(yaw)
  return new Vec3(-snYaw * csPitch, snPitch, -csYaw * csPitch)
}

bot.on('kicked', (reason) => {
  console.info('Kicked for reason', reason)
})

bot.on('end', (reason) => {
  console.info('Bot disconnected', reason)
})

bot.on('error', console.error)
 