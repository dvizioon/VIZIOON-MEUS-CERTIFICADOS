# shellcheck shell=bash
# Variáveis copiadas para docker/.env no deploy.
# No CI, o job define APP_PREFIX (development | production) e as vars
# vêm prefixadas: development_PORT, production_HOSTNAME, etc.

APP_ENV_KEYS=(
  APP_ENV
  NODE_ENV
  PORT
  HOSTNAME
  MEM_LIMIT
  MEM_RESERVATION
  CPUS
  SYSTEM_NAME
  SYSTEM_VERSION
  SYSTEM_DESCRIPTION
)
