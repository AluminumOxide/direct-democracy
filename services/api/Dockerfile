FROM node:21

WORKDIR /app

COPY ["./source/entry.sh", "./entry.sh"]

EXPOSE ${API_PORT}

CMD ["./entry.sh"]
