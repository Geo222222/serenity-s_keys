#!/usr/bin/env bash
export $(grep -v '^#' .env | xargs)
uvicorn app.main:api --host 0.0.0.0 --port ${PORT:-8080} --reload