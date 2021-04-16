#!/bin/bash

sudo docker-compose \
	-f contrib/docker/docker-compose.server.yaml \
	--env-file contrib/docker/env.server \
	up --build
