```bash
cd mineflayer-panorama
docker build . -f example/browserCubeMap/Dockerfile -t panorama-bot 
# can be any name not only panorama-bot

docker run --rm -p 8080:8080 --name pano-bot -e HOST=<Host> -e PORT=<PORT> -e USERNAME=<username> -e PASSWORD=<password> panorama-bot 
# pano-bot is the container name
# panorama-bot is the image name
# -p exposes the port Hostport:8080
# -e USERNAME and -e PASSWORD are only required for online servers
# for connecting to localhost use: host.docker.internal as HOST. If you want to connect to a server on the internet put its ip as HOST instead.

# If for whatever reason the THREE module has not been downloaded by npm you can navigate into the container:
docker exec -it <container id> /bin/bash 
# and execture the npm install script again
> npm run download_three
```