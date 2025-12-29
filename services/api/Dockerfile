FROM node:25

WORKDIR /app

COPY ["./source/entry.sh", "./entry.sh"]

EXPOSE ${API_PORT}

CMD ["./entry.sh"]
