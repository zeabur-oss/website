#!/usr/bin/env bash
# Installs @zeabur/design-system from a local checkout, to try a change before it is
# pushed. It changes package.json and bun.lock; do not commit these changes.
#   scripts/link-design-system.sh [path to design-system checkout]
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
ds="$(realpath "${1:-$root/../design-system}")"
rev="$(git -C "$ds" rev-parse --short HEAD)"
out="$root/.local/design-system-$rev"
mkdir -p "$out"
(cd "$ds" && bun pm pack --destination "$out" --quiet >/dev/null)
tgz="$(find "$out" -name '*.tgz' | head -1)"
cd "$root"
bun add "@zeabur/design-system@file:./${tgz#"$root/"}"
echo "linked @zeabur/design-system from $ds ($rev)"
