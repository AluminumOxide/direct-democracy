FROM node:latest

WORKDIR /app

COPY [".npmrc", "./.npmrc"]

EXPOSE ${API_PORT}

CMD ["npm", "run", "server"]
