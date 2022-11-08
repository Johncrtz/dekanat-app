# Simple Dockerfile for using postgresql 13 on alpine linux
FROM postgres:13-alpine

# TODO: CHANGE ME!
ENV POSTGRES_USER admin
ENV POSTGRES_PASSWORD admin
ENV POSTGRES_DB db

# .sql and .sh files in /docker-entrypoint-initdb.d/ will be executed once
COPY init.sql /docker-entrypoint-initdb.d/
