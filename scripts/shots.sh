#!/usr/bin/env bash
# Screenshots for a local build: runs each locked repository's scripts/docs-shots.sh on a GitHub
# clone at the locked ref (.cache/shots-src), into .shots/<repo>.
#   scripts/shots.sh [repo…]
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
mapfile -t repos < <(jq -r '.repos[] | "\(.name) \(.github) \(.ref)"' "$root/docs.lock.json")
for entry in "${repos[@]}"; do
  read -r name github ref <<<"$entry"
  if (($# > 0)) && ! printf '%s\n' "$@" | grep -qx "$name"; then continue; fi
  src="$root/.cache/shots-src/$name"
  if [[ ! -d "$src/.git" ]]; then git clone --quiet --no-checkout "https://github.com/$github.git" "$src"; fi
  git -C "$src" fetch --quiet origin "$ref"
  git -C "$src" checkout --quiet --force "$ref"
  if [[ ! -f "$src/docs/shots.yaml" ]]; then continue; fi
  echo "$name@${ref:0:8}: taking screenshots"
  mkdir -p "$root/.shots/$name"
  (cd "$src" && nix develop -c scripts/docs-shots.sh docs/shots.yaml "$root/.shots/$name")
done
