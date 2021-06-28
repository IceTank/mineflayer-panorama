const Camera = require('./lib/camera')

function panoramaImage (bot) {
  bot.panoramaImage = {}
  const cam = new Camera(bot)

  // Don't touch things break
  bot.panoramaImage.takePicture = async function (name) {
    return cam.takePicture(name)
  }

  // Don't touch things break
  bot.panoramaImage.takePanoramaPictures = async function (name) {
    return cam.takePanoramaPictures(name)
  }
}

module.exports = {
  image: panoramaImage
}
