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

### What is this?

This is a plugin for [Mineflayer](https://github.com/PrismarineJS/mineflayer) a high level Node.js API for creating Minecraft Bots.
As most bots you run with mineflayer don't have any graphical interface its hard to visualize what is happening to the bot without joining the same server.
With this plugin you can get a glimpse into what the world the bot is in looks like. Or you can just make pretty panorama images and save them for later use.

### Getting Started

This plugin is built using Node and can be installed using:

```bash
git clone https://github.com/IceTank/mineflayer-panorama.git
cd mineflayer-panorama
npm install
```

#### Example

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

### Docker

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


### Documentation

### License

This project uses the [MIT](https://github.com/TheDudeFromCI/mineflayer-plugin-template/blob/master/LICENSE) license.

### Contributions

This project is accepting PRs and Issues. See something you think can be improved? Go for it! Any and all help is highly appreciated!

For larger changes, it is recommended to discuss these changes in the issues tab before writing any code. It's also preferred to make many smaller PRs than one large one, where applicable.
