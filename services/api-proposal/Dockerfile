FROM node:latest

WORKDIR /app

COPY [".npmrc", "./.npmrc"]

EXPOSE ${API_PROPOSAL_PORT}

CMD ["npm", "run", "server"]
