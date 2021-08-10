### Docker build
```
docker build . -f example/simplePanorama/Dockerfile -t simple-pano-bot
```

### Docker run (linux/unix)
```bash
docker run --rm -v $(pwd)/screenshots:/usr/src/app/screenshots --name simple-pano-bot -e HOST=<Host> -e PORT=<PORT> -e USERNAME=<username> -e PASSWORD=<password> simple-pano-bot
```

### Docker run (Windows)
```
docker run --rm -v ${PWD}/screenshots:/usr/src/app/screenshots --name simple-pano-bot -e HOST=<Host> -e PORT=<PORT> -e USERNAME=<username> -e PASSWORD=<password> simple-pano-bot
```

For connectiong to Docker Host localhost use `host.docker.internal` as HOST
