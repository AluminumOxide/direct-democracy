FROM node:latest

WORKDIR /app

COPY [".npmrc", "./.npmrc"]
COPY ["./source/entry.sh", "./entry.sh"]

EXPOSE ${API_MEMBERSHIP_PORT}

CMD ["./entry.sh"]
