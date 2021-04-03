const Camera = require(__dirname + '/lib/camera')

function panoramaImage (bot) {
  bot.panoramaImage = {}
  const cam = new Camera(bot)

  bot.panoramaImage.takePicture = async function (name) {
    return cam.takePanoramaPictures(name)
  }

  bot.panoramaImage.takePanoramaPictures = async function (name) {
    return cam.takePanoramaPictures(name)
  }
}

module.exports = {
  image: panoramaImage
}
