#!/usr/bin/env bash
#
# Protección frontend: archivos compilados y de build que no deben modificarse.
#

if [[ -z "$CLAUDE_TOOL_FILE_PATH" ]]; then
  exit 0
fi

PROTECTED_PATTERNS=(
  '*/core/*'
  '*/dist/*'
  '*/build/*'
)

for pattern in "${PROTECTED_PATTERNS[@]}"; do
  if [[ "$CLAUDE_TOOL_FILE_PATH" == "$pattern" ]]; then
    echo "Error: El archivo $CLAUDE_TOOL_FILE_PATH está protegido contra modificaciones (patrón: $pattern)" >&2
    exit 1
  fi
done
