#!/bin/sh
set -eu

export PORT="${PORT:-5560}"
export HOST="${HOST:-0.0.0.0}"

exec node /app/server.js
