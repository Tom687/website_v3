FROM postgres:13.0

ADD /tables/ /docker-entrypoint-initdb.d/tables/
ADD /seed/ /docker-entrypoint-initdb.d/seed/
ADD deploy_schema.sql /docker-entrypoint-initdb.d/