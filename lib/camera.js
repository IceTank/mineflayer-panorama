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
    this.cameraReady = false
    this.rendererLoadTime = 3000
    this.viewDistance = 4
    this.cameraHight = 10
    this.width = 512
    this.height = 512
    this.canvas = createCanvas(this.width, this.height)
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas })
    this.viewer = new Viewer(this.renderer)
    this._init().then(() => {
      this.emit('camera_ready')
    })
  }

  async _init () {
    const botPos = this.bot.entity.position
    const center = new Vec3(botPos.x, botPos.y + 10, botPos.z)
    this.viewer.setVersion(this.bot.version)

    // Load world
    this.worldView = new WorldView(this.bot.world, this.viewDistance, center)
    this.viewer.listen(this.worldView)

    this.viewer.camera.position.set(center.x, center.y, center.z)
    this.viewer.camera.lookAt(center.x + 1, center.y, center.z)

    await this.worldView.init(center)
  }

  async takePanoramaPictures (camPos) {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas })
    this.viewer = new Viewer(this.renderer)
    this.viewer.setVersion(this.bot.version)
    this.viewer.camera.fov = 90
    this.viewer.camera.updateProjectionMatrix()
    let cameraHeight = this.cameraHight
    const botPos = this.bot.entity.position
    let viewPos = new Vec3(botPos.x, botPos.y, botPos.z)
    if (camPos && !isNaN(Number(camPos))) {
      cameraHeight = camPos
    } else if (camPos && 'x' in camPos && 'y' in camPos && 'z' in camPos) {
      viewPos = camPos
      cameraHeight = 0
    }
    // Load world
    const worldView = new WorldView(this.bot.world, this.viewDistance, viewPos)
    this.viewer.listen(worldView)
    this.viewer.camera.position.set(viewPos.x, viewPos.y + cameraHeight, viewPos.z)
    await worldView.init(viewPos)
    
    await this.viewer.waitForChunksToRender()

    const directions = [
      new Vec3(1, 0, 0), new Vec3(-1, 0, 0), new Vec3(0, 1, 0),
      new Vec3(0, -1, 0), new Vec3(0, 0, -1), new Vec3(0, 0, 1)
    ]
    const locations = [
      { x: 0, y: 0 }, { x: this.width, y: 0 }, { x: this.width * 2, y: 0 },
      { x: 0, y: this.height }, { x: this.width, y: this.height }, { x: this.width * 2, y: this.height }
    ]
    console.info('Creating canvas')
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
    console.info('Converting to image')
    const imageStream = panoCanvis.createJPEGStream({
      bufsize: 4096,
      quality: 100,
      progressive: false
    })
    return imageStream
  }

  async takePicture (point, direction) {
    if (!isVec(point) || !isVec(direction)) throw Error('invalid arguments')
    await this.worldView.updatePosition(point)
    this.viewer.camera.position.set(point.x, point.y, point.z)
    let { x, y, z } = point.plus(direction)
    this.viewer.camera.lookAt(x, y, z)

    console.info('Waiting for world to load')
    await new Promise(resolve => setTimeout(resolve, this.rendererLoadTime))
    this.renderer.render(this.viewer.scene, this.viewer.camera)

    const imageStream = this.canvas.createJPEGStream({
      bufsize: 4096,
      quality: 100,
      progressive: false
    })
    return imageStream
  }
}

function isVec(obj) {
  if (!obj) return false
  return obj instanceof Vec3
}

module.exports = Camera
