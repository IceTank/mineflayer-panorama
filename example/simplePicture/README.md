### Docker build
```
docker build . -f example/simplePicture/Dockerfile -t simple-image-bot
```

### Docker run
```bash
docker run --rm -v ${PWD}/screenshots:/usr/src/app/screenshots --name image-bot -e HOST=<host> -e PORT=<port> -e USERNAME=<username> -e PASSWORD=<password> pano-image
```
For connectiong to a local server use `host.docker.internal` for HOST
