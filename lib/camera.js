const { Viewer, WorldView, getBufferFromStream } = require('prismarine-viewer').viewer
global.Worker = require('worker_threads').Worker
const THREE = require('three')
const { createCanvas } = require('node-canvas-webgl/lib')
const fs = require('fs').promises
const Vec3 = require('vec3').Vec3
const EventEmitter = require('events').EventEmitter

class Camera extends EventEmitter {
  constructor (bot) {
    super()
    this.bot = bot
    this.viewDistance = 4
    this.width = 512
    this.height = 512
    this.canvas = createCanvas(this.width, this.height)
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas })
    this.viewer = new Viewer(this.renderer)
    this._init().then(() => {
      bot.emit('camera_ready')
    })
  }

  async _init () {
    const botPos = this.bot.entity.position
    const center = new Vec3(botPos.x, botPos.y + 10, botPos.z)
    this.viewer.setVersion(this.bot.version)

    // Load world
    const worldView = new WorldView(this.bot.world, this.viewDistance, center)
    this.viewer.listen(worldView)

    this.viewer.camera.position.set(center.x, center.y, center.z)

    await worldView.init(center)
    await new Promise(resolve => setTimeout(resolve, 5000))
  }

  async takePanoramaPictures (name) {
    this.viewer.camera.fov = 90
    this.viewer.camera.updateProjectionMatrix()
    const directions = [
      new Vec3(1, 0, 0), new Vec3(-1, 0, 0), new Vec3(0, 1, 0),
      new Vec3(0, -1, 0), new Vec3(0, 0, -1), new Vec3(0, 0, 1)
    ]
    const locations = [
      { x: 0, y: 0 }, { x: this.width, y: 0 }, { x: this.width * 2, y: 0 },
      { x: 0, y: this.height }, { x: this.width, y: this.height }, { x: this.width * 2, y: this.height }
    ]
    const panoCanvis = createCanvas(this.width * 3, this.height * 2)
    const ctx = panoCanvis.getContext('2d')
    for (const i in directions) {
      const cameraPos = new Vec3(this.viewer.camera.position.x, this.viewer.camera.position.y, this.viewer.camera.position.z)
      const point = cameraPos.add(directions[i])
      this.viewer.camera.lookAt(point.x, point.y, point.z)
      this.renderer.render(this.viewer.scene, this.viewer.camera)

      const loc = locations[i]
      ctx.drawImage(this.canvas, loc.x, loc.y, this.width, this.height)
    }
    const imageStream = panoCanvis.createJPEGStream({
      bufsize: 4096,
      quality: 100,
      progressive: false
    })
    return imageStream
    // const buf = await getBufferFromStream(imageStream)
    // let stats
    // try {
    //   stats = await fs.stat('./screenshots')
    // } catch (e) {
    //   if (!stats?.isDirectory()) {
    //     await fs.mkdir('./screenshots')
    //   }
    // }
    // await fs.writeFile(`./screenshots/${name}.jpg`, buf)
    // console.info(`saved ${name}.jpg`)
  }

  async takePicture (direction, name) {
    const cameraPos = new Vec3(this.viewer.camera.position.x, this.viewer.camera.position.y, this.viewer.camera.position.z)
    const point = cameraPos.add(direction)
    this.viewer.camera.lookAt(point.x, point.y, point.z)
    this.renderer.render(this.viewer.scene, this.viewer.camera)

    const imageStream = this.canvas.createJPEGStream({
      bufsize: 4096,
      quality: 100,
      progressive: false
    })
    const buf = await getBufferFromStream(imageStream)
    let stats
    try {
      stats = await fs.stat('./screenshots')
    } catch (e) {
      if (!stats?.isDirectory()) {
        await fs.mkdir('./screenshots')
      }
    }
    await fs.writeFile(`screenshots/${name}.jpg`, buf)
    console.log('saved', name)
  }
}

module.exports = Camera
