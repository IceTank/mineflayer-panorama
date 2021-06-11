<h1 align="center">mineflayer-panorama</h1>

<p align="center">
 
  <img src="https://img.shields.io/npm/v/mineflayer-panorama" />
  <img src="https://img.shields.io/github/repo-size/IceTank/mineflayer-panorama" />
  <img src="https://img.shields.io/npm/dm/mineflayer-panorama" />
  <img src="https://img.shields.io/github/contributors/IceTank/mineflayer-panorama" />
  <img src="https://img.shields.io/github/license/IceTank/mineflayer-panorama" />
</p>

---
Make Simple Panorama images and view them in your browser!

![Download (1)](https://user-images.githubusercontent.com/61137113/113225697-8b005c00-928e-11eb-8bef-4ee1251cabdb.png)

## What is this?

This is a plugin for [Mineflayer](https://github.com/PrismarineJS/mineflayer) a high level Node.js API for creating Minecraft Bots.
As most bots you run with mineflayer don't have any graphical interface its hard to visualize what is happening to the bot without joining the same server.
With this plugin you can get a glimpse into what the world the bot is in looks like. Or you can just make pretty panorama images and save them for later use.

## Getting Started

This plugin is built using Node and can be installed using:

```bash
git clone https://github.com/IceTank/mineflayer-panorama.git
cd mineflayer-panorama
npm install
```

### Example

For use as a plugin to make Panorama Images:
```js
const panorama = require('./index')
const mineflayer = require('mineflayer')
const fs = require('fs')
const bot = mineflayer.createBot({
  host: 'localhost'
})

bot.on('spawn', async () => {
  console.info('Bot spawned')
  bot.loadPlugin(panorama.image)
  bot.on('camera_ready', async () => {
    await bot.waitForChunksToLoad()
    console.info('Ready to use')
    let imageStream = await bot.panoramaImage.takePanoramaPictures()
    let image = fs.createWriteStream('panorama1.jpeg')
    imageStream.pipe(image)
    image.on('finish', () => {
      console.info('Wrote panorama image panorama1.jpeg')
    })
  })
})
```

This plugin also includes a webserver that can be used to view the generated images.
The webserver opens a website on a given port and serves the current panorama view of the bot and a Panorama viewer.
For an example see: `example/browserCubeMap/index.js`. 
Note: three.module.js has to be provided in `public/js`. If `npm install` did not download it, it has to be added manually. 

## Running on Windows
The rendering is done by node-canvas-webgl which is tricky to install on Windows. I recommend using a unix based operating system or Docker to run this plugin.

## Documentation

### `async bot.panoramaImage.takePanoramaPictures(camPos)`
Takes a panorama Image and resolves with a jpeg stream of that image on success.
* `camPos` - a `null`, `number` or `Vec3` like object
  * `null` - takes the panorama image from the bot current position
  * `number` - takes the panorama image with a high offset at the bots current location
  * `Vec3` like - takes the panorama image at a given location. Note: the bot can only render chunks that are loaded. Taking images outside of the current render distance may result in a blank image off the current sky color.

### `async bot.panoramaImage.takePicture(lookAt, name)`
Takes a picture of the current world at the bots current position looking at the point `lookAt`
* `lookAt` - a `Vec3` like object of the point the bot should look at
* `name` - the name the jpeg image will be saved as

### `WebServer(bot, PORT)`
A class providing a express app to host the panorama viewer on. 
When the page is opened the web server automatically calls `bot.panoramaImage.takePanoramaImage` to take an up to date panorama image to display in the panorama viewer.
* `bot` - the mineflayer bot instance
* `PORT` - the port the express app should listen on

### `WebServer.READY` - `boolean` if the express app is ready

### Events
### `"ready"` 
Emitted when the express app is ready and running

## Docker

It is possible to run this in a docker container by building the provided Dockerfile. 
The Dockerfile builds an image with the example script in `example/browserCubeMap/index.js`.

```bash
cd mineflayer-panorama
docker build . -t panorama-bot 
# can be any name not only panorama-bot

docker run --rm -p 8080:8080 --name pano-bot -e HOST=<Host> -e PORT=<PORT> -e USERNAME=<username> -e PASSWORD=<password> panorama-bot 
# pano-bot is the container name
# panorama-bot is the image name; 
# -p exposes the port Hostport:8080
# -e USERNAME and -e PASSWORD are only required for online servers

# If for whatever reason the THREE module has not been downloaded by npm you can navigate into the container:
docker exec -it <container id> /bin/bash 
# and execture the npm install script again
> npm run prepare
```

## TODO
* Add panorama Video streaming/saving
* Add entitys to the panorama view

### License

This project uses the [MIT](https://github.com/TheDudeFromCI/mineflayer-plugin-template/blob/master/LICENSE) license.

## Contributions

This project is accepting PRs and Issues. See something you think can be improved? Go for it! Any and all help is highly appreciated!

For larger changes, it is recommended to discuss these changes in the issues tab before writing any code. It's also preferred to make many smaller PRs than one large one, where applicable.
