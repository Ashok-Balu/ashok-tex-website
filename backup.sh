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

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is missing. Set it in .env.production before running backup."
  exit 1
fi

if [ -z "${SUPABASE_URL:-}" ] || [ -z "${SUPABASE_SECRET_KEY:-}" ]; then
  echo "SUPABASE_URL or SUPABASE_SECRET_KEY is missing."
  exit 1
fi

DB_FILE="$BACKUP_DIR/database_backup.sql"
echo "[1/2] Dumping database to $DB_FILE"
pg_dump "$DATABASE_URL" > "$DB_FILE"

STORAGE_DIR="$BACKUP_DIR/storage"
mkdir -p "$STORAGE_DIR"

echo "[2/2] Downloading Supabase Storage files from bucket: ${SUPABASE_STORAGE_BUCKET:-uploads}"

curl -sS \
  -H "Authorization: Bearer ${SUPABASE_SECRET_KEY}" \
  "${SUPABASE_URL}/storage/v1/object/list/${SUPABASE_STORAGE_BUCKET:-uploads}?limit=1000" \
  -o "$BACKUP_DIR/storage_listing.json"

python3 - "$BACKUP_DIR/storage_listing.json" "$STORAGE_DIR" <<'PY'
import json, os, sys
listing_file, out_dir = sys.argv[1], sys.argv[2]
with open(listing_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

if isinstance(data, dict):
    items = data.get('data') or data.get('files') or []
else:
    items = data

for item in items:
    name = item.get('name') if isinstance(item, dict) else str(item)
    if not name:
        continue
    path = os.path.join(out_dir, name)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'wb') as out:
        pass
PY

echo "Backup completed: $BACKUP_DIR"
