FROM node:latest

WORKDIR /app

COPY [".npmrc", "./.npmrc"]

COPY ["spec.json", "./"]

COPY ["source", "./"]

RUN npm install

EXPOSE ${API_DEMOCRACY_PORT}

CMD ["node", "index.js"]
