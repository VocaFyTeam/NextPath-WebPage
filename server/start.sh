#!/usr/bin/env sh
# Levanta la Fake API local de NextPath en http://localhost:3000
cd "$(dirname "$0")" && npx json-server --watch db.json --port 3000
