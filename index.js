const Camera = require('./lib/camera')

function panoramaImage (bot) {
  bot.panoramaImage = {}
  const cam = new Camera(bot)

  bot.panoramaImage.takePicture = cam.takePicture

  bot.panoramaImage.takePanoramaPictures = cam.takePanoramaPictures
}

module.exports = {
  image: panoramaImage
}
