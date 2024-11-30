#!/bin/bash

# Load .env file from the parent directory of scripts
source "$(dirname "$0")/../.env"

# Log file for truncation
LOG_FILE="/home/jay/Documents/projects/leyeco/lvis-monorepo/backup/logs/truncate_all_tables_in_warehouse.log"

# Ensure the logs directory exists
LOG_DIR=$(dirname "$LOG_FILE")
if [ ! -d "$LOG_DIR" ]; then
  mkdir -p "$LOG_DIR"
  echo "$(date +'%Y-%m-%d %H:%M:%S') - Created logs directory: $LOG_DIR"
fi

# Log start of execution
echo "$(date +'%Y-%m-%d %H:%M:%S') - Initializing truncation of all tables in $DB_WAREHOUSE_NAME..." >> "$LOG_FILE"

# Ensure we have a valid connection
echo "$(date +'%Y-%m-%d %H:%M:%S') - Checking database connection..." >> "$LOG_FILE"
docker exec -i "$DB_CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_WAREHOUSE_NAME" -c "\q" &>/dev/null
if [ $? -ne 0 ]; then
  echo "$(date +'%Y-%m-%d %H:%M:%S') - Error: Could not connect to the database." >> "$LOG_FILE"
  exit 1
fi

# Log the start of truncation
echo "$(date +'%Y-%m-%d %H:%M:%S') - Running truncation procedure..." >> "$LOG_FILE"

# Spinner function
spinner() {
  local pid=$!
  local delay=0.1
  local spinstr='|/-\\'
  while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
    for i in `seq 0 3`; do
      echo -ne "\r${spinstr:$i:1}"
      sleep $delay
    done
  done
}

# Run the truncation and show the spinner
docker exec -i "$DB_CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_WAREHOUSE_NAME" -c "
DO \$\$
DECLARE
   r RECORD;
BEGIN
   FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
      EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE';
   END LOOP;
END \$\$;
" &

# Start spinner in the background
spinner $!

# Check the output and log success or failure
OUTPUT=$(docker exec -i "$DB_CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_WAREHOUSE_NAME" -c "
DO \$\$
DECLARE
   r RECORD;
BEGIN
   FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
      EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE';
   END LOOP;
END \$\$;
" 2>&1)

# Log result
if [ $? -eq 0 ]; then
  echo "$(date +'%Y-%m-%d %H:%M:%S') - Successfully truncated all tables." >> "$LOG_FILE"
else
  echo "$(date +'%Y-%m-%d %H:%M:%S') - Error during truncation: $OUTPUT" >> "$LOG_FILE"
fi

# Log completion
echo "$(date +'%Y-%m-%d %H:%M:%S') - All tables truncation process complete." >> "$LOG_FILE"
echo "All tables in $DB_WAREHOUSE_NAME have been truncated."
