FROM postgres:latest
COPY infra/dev/local_database/init.sh /docker-entrypoint-initdb.d/
COPY services/api-democracy/schema /docker-entrypoint-initdb.d/DEMOCRACY/
COPY services/api-membership/schema /docker-entrypoint-initdb.d/MEMBERSHIP/
COPY services/api-proposal/schema /docker-entrypoint-initdb.d/PROPOSAL/
COPY services/api-account/schema /docker-entrypoint-initdb.d/ACCOUNT/
COPY services/api-profile/schema /docker-entrypoint-initdb.d/PROFILE/
COPY services/api-token/schema /docker-entrypoint-initdb.d/TOKEN/
EXPOSE ${DB_PORT}
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["postgres"]

