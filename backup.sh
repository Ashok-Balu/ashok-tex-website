#!/usr/bin/env bash
set -euo pipefail

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="$PROJECT_DIR/backups/$TIMESTAMP"
mkdir -p "$BACKUP_DIR"

if [ -f "$PROJECT_DIR/.env.production" ]; then
  set -a
  . "$PROJECT_DIR/.env.production"
  set +a
fi

if [ -z "${MONGODB_URI:-}" ]; then
  echo "MONGODB_URI is missing. Set it in .env.production before running backup."
  exit 1
fi

DUMP_DIR="$BACKUP_DIR/mongodb"
echo "Dumping MongoDB to $DUMP_DIR"
mongodump --uri="$MONGODB_URI" --out="$DUMP_DIR"

echo "MongoDB backup completed: $BACKUP_DIR"
echo "Cloudinary assets are backed up separately through Cloudinary/your asset export process."
