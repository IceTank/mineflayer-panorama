const fs = require('fs')
const https = require('https')
const threeJsPath = 'public/js/three.module.js'
const threeJsUrl = 'https://threejs.org/build/three.module.js'

try {
  if (fs.statSync(threeJsPath).isFile()) {
    return
  }
} catch (e) {
}

console.info('Downloading THREE.js from', threeJsUrl)
fs.mkdirSync('public/js')
const file = fs.createWriteStream(threeJsPath)
https.get(threeJsUrl, function(response) {
  response.pipe(file)
})
