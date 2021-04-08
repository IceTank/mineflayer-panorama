FROM node:14

# Install stuff needed for node-canvas-webgl to work in docker
RUN apt-get update -y
RUN apt-get install -y xserver-xorg-dev libxi-dev xserver-xorg-dev libxext-dev xvfb

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 8080

# Start the container with the BrowserCubeMap example script
# xvfb-run and the arguments behide it are needed for node-canvas-webgl to work. 
CMD xvfb-run --auto-servernum --server-num=1 --server-args='-ac -screen 0 1280x1024x24' node example/browserCubeMap/index.js $HOST $PORT $USERNAME $PASSWORD
