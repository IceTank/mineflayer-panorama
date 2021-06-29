const Camera = require('./lib/camera')

function panoramaImage (bot) {
  bot.panoramaImage = {}
  const cam = new Camera(bot)

  // Don't touch things break
  bot.panoramaImage.takePanoramaPictures = async function (camPos) {
    return cam.takePanoramaPictures(camPos)
  }
}

function image (bot) {
  bot.image = {}
  const cam = new Camera(bot)

  // Don't touch things break
  bot.image.takePicture = async function (point, direction) {
    return cam.takePicture(point, direction)
  }
}

module.exports = {
  panoramaImage,
  image
}
