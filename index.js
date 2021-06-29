const Camera = require('./lib/camera')

function panoramaImage (bot) {
  bot.panoramaImage = {}
  const cam = new Camera(bot)

  // Don't touch things break
  bot.panoramaImage.takePicture = async function (point, name) {
    return cam.takePicture(point, name)
  }

  // Don't touch things break
  bot.panoramaImage.takePanoramaPictures = async function (camPos) {
    return cam.takePanoramaPictures(camPos)
  }
}

module.exports = {
  image: panoramaImage
}
