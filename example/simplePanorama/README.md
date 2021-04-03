### Docker build
```
docker build . -f example/simplePanorama/Dockerfile -t simple-pano-bot
```

### Docker run
```bash
docker run --rm -v $(pwd)/screenshots:/usr/src/app/screenshots --name simple-pano-bot -e HOST=<Host> -e PORT=<PORT> -e USERNAME=<username> -e PASSWORD=<password> simple-pano-bot
```