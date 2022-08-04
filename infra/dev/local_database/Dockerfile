FROM postgres:latest
COPY infra/dev/local_database/init.sh /docker-entrypoint-initdb.d/
COPY services/api-democracy/schema /docker-entrypoint-initdb.d/DEMOCRACY/
COPY services/api-membership/schema /docker-entrypoint-initdb.d/MEMBERSHIP/
COPY services/api-proposal/schema /docker-entrypoint-initdb.d/PROPOSAL/
EXPOSE ${DB_PORT}
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["postgres"]

