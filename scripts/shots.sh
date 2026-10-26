#!/usr/bin/env bash
# Screenshots for a local build: runs each locked repository's scripts/docs-shots.sh on a GitHub
# clone at the locked ref (.cache/shots-src), into .shots/<repo>. If scripts/link-design-system.sh
# made a package in .local, each copy uses that package instead of its pinned design system.
#   scripts/shots.sh [repo…]
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
tgz=""
if [[ -d "$root/.local" ]]; then
  tgz="$(find "$root/.local" -name 'zeabur-design-system-*.tgz' | head -1)"
fi
mapfile -t repos < <(jq -r '.repos[] | "\(.name) \(.github) \(.ref)"' "$root/docs.lock.json")
for entry in "${repos[@]}"; do
  read -r name github ref <<<"$entry"
  if (($# > 0)) && ! printf '%s\n' "$@" | grep -qx "$name"; then continue; fi
  src="$root/.cache/shots-src/$name"
  if [[ ! -d "$src/.git" ]]; then git clone --quiet --no-checkout "https://github.com/$github.git" "$src"; fi
  git -C "$src" fetch --quiet origin "$ref"
  git -C "$src" checkout --quiet --force "$ref"
  if [[ ! -f "$src/docs/shots.yaml" ]]; then continue; fi
  if [[ -n "$tgz" ]]; then
    while IFS= read -r manifest; do
      dir="$(dirname "$manifest")"
      echo "$name: linking @zeabur/design-system in ${dir#"$src/"}"
      (cd "$src" && nix develop -c sh -c "cd '$dir' && bun add '@zeabur/design-system@file:$tgz' >/dev/null")
    done < <(git -C "$src" grep -lE '"@zeabur/design-system": "(github|git\+ssh):' -- '*package.json' | sed "s|^|$src/|")
  fi
  echo "$name@${ref:0:8}: taking screenshots"
  mkdir -p "$root/.shots/$name"
  (cd "$src" && nix develop -c scripts/docs-shots.sh docs/shots.yaml "$root/.shots/$name")
done
