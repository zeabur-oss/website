#!/usr/bin/env bash
# Fails on `as unknown as`, `as any` and `as never`: a double cast tells the compiler to stop
# checking. Narrow the type or use `satisfies` instead.
set -euo pipefail
cd "$(dirname "$0")/.."

if grep -rnE --include='*.ts' --include='*.tsx' --include='*.astro' '\bas (unknown as|any|never)\b' src scripts astro.config.ts; then
  echo "error: remove 'as unknown as', 'as any' and 'as never'" >&2
  exit 1
fi
