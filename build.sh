#!/bin/sh
set -eu

# Build only the public static site. Keep the Pages Functions directory at the project root.
rm -rf dist
mkdir -p dist/assets
cp index.html app.js science.js styles.css dist/
cp -R assets/. dist/assets/

# Invoke Pages Functions only for the NASA API proxy route; serve static assets directly.
cat > dist/_routes.json <<'JSON'
{"version":1,"include":["/api/*"],"exclude":[]}
JSON