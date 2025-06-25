#!/bin/bash
set -e

SERVICES=(DEMOCRACY PROPOSAL MEMBERSHIP ACCOUNT PROFILE TOKEN)

for s in ${SERVICES[@]}; do 
	echo "***SERVICE "$s"***"

	# extract credentials from environment variables
	db_user_var="\$DB_"$s"_USER"
	db_user=`eval echo $db_user_var`
	db_name_var="\$DB_"$s"_DB"
	db_name=`eval echo $db_name_var`
	db_pass_var="\$DB_"$s"_PASSWORD"
	db_pass=`eval echo $db_pass_var`

	# create database user
	psql -v ON_ERROR_STOP=1 --username="$DB_DEFAULT_USER" --dbname="$DB_DEFAULT_DB" <<-EOSQL
	        CREATE USER $db_user WITH ENCRYPTED PASSWORD '$db_pass';
	        CREATE DATABASE $db_name;
	        GRANT ALL PRIVILEGES ON DATABASE $db_name TO $db_user;
		ALTER USER $db_user WITH SUPERUSER;
	EOSQL

	# create tables as defined in schema/
	for d in /docker-entrypoint-initdb.d/$s/[0-9]*.sql; do
		for f in $d*; do
			psql -v ON_ERROR_STOP=1 --username="$db_user" --dbname="$db_name" -f $f;
		done
	done

	# build service reset_test_data function
	reset_test_data="CREATE OR REPLACE PROCEDURE reset_test_data()
			LANGUAGE plpgsql
		AS
		\$$
		BEGIN"
	
	# create temp tables with data from schema/*.json
	TABLES=`ls /docker-entrypoint-initdb.d/$s/*.json | xargs -n 1 basename -s .json`
	for t in $TABLES; do
		reset_test_data="${reset_test_data}
			CREATE TABLE temp$t (data jsonb);
			COPY temp$t (data) FROM '/docker-entrypoint-initdb.d/$s/$t.json';"
	done

	# fill tables with temp table data using schema/test.sql
	service_test_data=`cat /docker-entrypoint-initdb.d/$s/test.sql`
	reset_test_data="${reset_test_data}
		${service_test_data}"

	# drop temp tables
	for t in $TABLES; do
		reset_test_data="${reset_test_data}
			DROP TABLE temp$t;"
	done
	reset_test_data="${reset_test_data}
		END; \$$;"

	# save service reset_test_data function to db
	psql -v ON_ERROR_STOP=1 --username="$db_user" --dbname="$db_name" <<-EOSQL
		${reset_test_data}
	EOSQL

	psql -v  ON_ERROR_STOP=1 --username="$db_user" --dbname="$db_name" <<-EOSQL
		CREATE OR REPLACE PROCEDURE start_test()
		LANGUAGE plpgsql
		AS
		\$$
		BEGIN
			CALL reset_test_data();
		END; \$$;
	EOSQL
	psql -v  ON_ERROR_STOP=1 --username="$db_user" --dbname="$db_name" <<-EOSQL
		CREATE OR REPLACE PROCEDURE end_test()
		LANGUAGE plpgsql
		AS
		\$$
		BEGIN
		END; \$$;
	EOSQL
done

# global reset_test_data
reset_test_data="CREATE EXTENSION IF NOT EXISTS dblink;
	CREATE OR REPLACE PROCEDURE reset_test_data()
		LANGUAGE plpgsql
	AS
	\$$
		BEGIN"
for s in ${SERVICES[@]}; do 
	reset_test_data="${reset_test_data}
	PERFORM dblink('dbname=`echo "${s,,}"`','CALL reset_test_data();');"
done
reset_test_data="${reset_test_data}
	END; \$$;"
echo ${reset_test_data}
psql -v ON_ERROR_STOP=1 --username="$DB_DEFAULT_USER" --dbname="$DB_DEFAULT_DB" <<-EOSQL
	${reset_test_data}
EOSQL
psql -v ON_ERROR_STOP=1 --username="$DB_DEFAULT_USER" --dbname="$DB_DEFAULT_DB" <<-EOSQL
	CALL reset_test_data();
EOSQL
