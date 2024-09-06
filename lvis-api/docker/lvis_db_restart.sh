#!/bin/bash

# Stop and remove the lvis-db container along with its associated volumes
docker-compose down -v

# Start the lvis-db container in detached mode
docker-compose up -d lvis-db
