#!/bin/bash
docker stop graphql-test
docker rm graphql-test
docker rmi graphql
docker build -t graphql .
docker run -d -p 4321:4321 --name graphql-test graphql