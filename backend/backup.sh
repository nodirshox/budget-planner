#!/bin/bash

# Variables
PROJECT_NAME="budget-planner"
DOCKER_BACKEND_SERVICE_NAME=budget-planner-backend
DOCKER_DATABASE_SERVICE_NAME=budget-planner-postgres
POSTGRES_USER=user
MC_ALIAS="s3_alias/bucket"

cd budget-planner/backend

# Stop connected service
docker compose down $DOCKER_BACKEND_SERVICE_NAME

# Backup
DATE=$(date +%H-%M-%d-%m-%Y)
FILE_NAME="${PROJECT_NAME}-db-${DATE}.sql.gz"
docker compose exec -it $DOCKER_DATABASE_SERVICE_NAME pg_dumpall -U $POSTGRES_USER | gzip -9c > $FILE_NAME

# Start service
docker compose up -d $DOCKER_BACKEND_SERVICE_NAME

# Move file and change directory
mkdir -p /home/ubuntu/backup
mv $FILE_NAME /home/ubuntu/backup
cd
cd backup

echo "Backup saved: $FILE_NAME"

# Upload to storage
mc cp "./$FILE_NAME" "$MC_ALIAS/$FILE_NAME"

rm $FILE_NAME

echo "Backup process completed successfully"