#!/bin/bash
set -e

SERVICES=(DEMOCRACY PROPOSAL MEMBERSHIP)

for s in ${SERVICES[@]}; do 
	echo "***SERVICE "$s"***"
	db_user_var="\$DB_"$s"_USER"
	db_user=`eval echo $db_user_var`
	db_name_var="\$DB_"$s"_DB"
	db_name=`eval echo $db_name_var`
	db_pass_var="\$DB_"$s"_PASSWORD"
	db_pass=`eval echo $db_pass_var`
	psql -v ON_ERROR_STOP=1 --username="$DB_DEFAULT_USER" --dbname="$DB_DEFAULT_DB" <<-EOSQL
	        CREATE USER $db_user WITH ENCRYPTED PASSWORD '$db_pass';
	        CREATE DATABASE $db_name;
	        GRANT ALL PRIVILEGES ON DATABASE $db_name TO $db_user;
		ALTER USER $db_user WITH SUPERUSER;
	EOSQL
	TABLES=`ls /docker-entrypoint-initdb.d/$s/*.json | xargs -n 1 basename -s .json`
	echo $TABLES
	for t in $TABLES; do
		psql -v ON_ERROR_STOP=1 --username="$db_user" --dbname="$db_name" <<-EOSQL
			CREATE TABLE temp$t (data jsonb);
			\COPY temp$t (data) FROM '/docker-entrypoint-initdb.d/$s/$t.json';
		EOSQL
	done
	for d in /docker-entrypoint-initdb.d/$s/*.sql; do
		for f in $d*; do
			psql -v ON_ERROR_STOP=1 --username="$db_user" --dbname="$db_name" -f $f;
		done
	done
	for t in $TABLES; do
		psql -v ON_ERROR_STOP=1 --username="$db_user" --dbname="$db_name" <<-EOSQL
			DROP TABLE temp$t;
		EOSQL
	done
done	
