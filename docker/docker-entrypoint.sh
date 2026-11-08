#!/bin/sh
set -eu

export PORT="${PORT:-3000}"
export HOSTNAME="${HOSTNAME:-0.0.0.0}"

exec node /app/server.js
