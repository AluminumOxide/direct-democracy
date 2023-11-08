FROM node:latest

WORKDIR /app

COPY [".npmrc", "./.npmrc"]
COPY ["./source/entry.sh", "./entry.sh"]

EXPOSE ${API_PROPOSAL_PORT}

CMD ["./entry.sh"]
