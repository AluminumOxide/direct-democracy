FROM node:latest

WORKDIR /app

COPY ["./source/entry.sh", "./entry.sh"]

EXPOSE ${API_DEMOCRACY_PORT}

CMD ["./entry.sh"]

