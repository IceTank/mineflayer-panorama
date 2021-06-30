FROM node:14

RUN apt-get update -y
RUN apt-get install -y xserver-xorg-dev libxi-dev xserver-xorg-dev libxext-dev xvfb

WORKDIR /usr/src/app

COPY example/simplePanorama/package.json ./
RUN mkdir screenshots

RUN npm install

COPY . .

# Start the container with the BrowserCubeMap example script
CMD xvfb-run --auto-servernum --server-num=1 --server-args='-ac -screen 0 1280x1024x24' node example/simplePanorama/simplePanorama.js $HOST $PORT $USERNAME $PASSWORD
