#!/bin/bash

#Syntax run-env.sh <env files> -- commands

if [ "${1}" == '--' ]; then
  echo "command error"
  exit 1
fi

ENV_FILE="${1}"
while [ ! "${ENV_FILE}" == "--" ]; do
  echo "Loading from ${ENV_FILE}..."
  if [ ! -f "$ENV_FILE" ]; then
      echo "env file ${ENV_FILE} not found"
  else
      set -o allexport
      source "${ENV_FILE}"
      set +o allexport
      echo "Loaded env from ${ENV_FILE}"
  fi
  shift
  ENV_FILE="${1}"
done

shift
env
$@