#!/bin/bash

sudo docker-compose \
	-f contrib/docker/docker-compose.devel.yaml \
	--env-file contrib/docker/env.devel \
	up
