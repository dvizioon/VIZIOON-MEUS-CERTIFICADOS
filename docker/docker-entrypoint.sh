#!/bin/sh
set -eu

export PORT="${PORT:-5560}"
export HOSTNAME="${HOSTNAME:-0.0.0.0}"

exec node /app/server.js
