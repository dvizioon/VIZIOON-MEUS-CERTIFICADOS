#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CERT="$ROOT/public/certificates"
PREV="$CERT/previews"
mkdir -p "$PREV"

for pdf in "$CERT"/*.pdf; do
  [ -f "$pdf" ] || continue
  base="$(basename "$pdf" .pdf)"
  pdftoppm -png -f 1 -l 1 -r 140 "$pdf" "$PREV/$base"
  mv -f "$PREV/${base}-1.png" "$PREV/${base}.png"
  echo "ok $base"
done

# PNGs soltos (ex.: insígnia)
for png in "$CERT"/*.png; do
  [ -f "$png" ] || continue
  cp -f "$png" "$PREV/$(basename "$png")"
done

echo "previews em $PREV"
