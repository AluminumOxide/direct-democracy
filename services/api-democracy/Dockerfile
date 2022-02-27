FROM node:latest

WORKDIR /app

COPY [".npmrc", "./.npmrc"]

EXPOSE ${API_DEMOCRACY_PORT}

CMD ["npm", "run", "server"]
