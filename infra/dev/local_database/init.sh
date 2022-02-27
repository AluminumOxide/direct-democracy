#!/bin/bash
set -e

SERVICES=(DEMOCRACY PROPOSAL)

for s in ${SERVICES[@]}; do 
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
	for d in /docker-entrypoint-initdb.d/$s/; do
		for f in $d*; do
			psql -v ON_ERROR_STOP=1 --username="$db_user" --dbname="$db_name" -f $f;
		done
	done
done	
