### Docker build
```
docker build . -f example/simplePicture/Dockerfile -t simple-image-bot
```

### Docker run
```bash
docker run --rm -v ${pwd}/screenshots:/usr/src/app/screenshots --name image-bot -e HOST=<host> -e PORT=<port> -e USERNAME=<username> -e PASSWORD=<password> simple-image-bot
```
For connectiong to a local server use `host.docker.internal` for HOST
