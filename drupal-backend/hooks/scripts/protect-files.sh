#!/usr/bin/env bash
#
# Protección backend: archivos específicos del servidor que no deben modificarse.
#

if [[ -z "$CLAUDE_TOOL_FILE_PATH" ]]; then
  exit 0
fi

PROTECTED_PATTERNS=(
  '*/core/*'
  '*/sites/default/default.settings.php'
  '*/sites/default/default.services.yml'
  '*/sites/default/settings.ddev.php'
)

for pattern in "${PROTECTED_PATTERNS[@]}"; do
  if [[ "$CLAUDE_TOOL_FILE_PATH" == "$pattern" ]]; then
    echo "Error: El archivo $CLAUDE_TOOL_FILE_PATH está protegido contra modificaciones (patrón: $pattern)" >&2
    exit 1
  fi
done
