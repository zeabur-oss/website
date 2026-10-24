#!/usr/bin/env bash
# Screenshots for a local build: runs each locked repository's scripts/docs-shots.sh on a copy at
# the locked ref (.cache/shots-src), with the local design system linked, into .shots/<repo>.
#   scripts/shots.sh [repo…]
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
tgz="$(find "$root/.local" -name 'zeabur-design-system-*.tgz' 2>/dev/null | head -1)"
mapfile -t repos < <(jq -r '.repos[] | select(.local) | "\(.name) \(.local) \(.ref)"' "$root/docs.lock.json")
for entry in "${repos[@]}"; do
  read -r name local ref <<<"$entry"
  if (($# > 0)) && ! printf '%s\n' "$@" | grep -qx "$name"; then continue; fi
  if ! git -C "$root/$local" cat-file -e "$ref:docs/shots.yaml" 2>/dev/null; then continue; fi
  src="$root/.cache/shots-src/$name"
  if [[ ! -d "$src/.git" ]]; then git clone --quiet --no-checkout "$root/$local" "$src"; fi
  git -C "$src" fetch --quiet "$root/$local" "$ref"
  git -C "$src" checkout --quiet --force "$ref"
  if [[ -n "$tgz" ]]; then
    while IFS= read -r manifest; do
      dir="$(dirname "$manifest")"
      echo "$name: linking @zeabur/design-system in ${dir#"$src/"}"
      (cd "$src" && nix develop -c sh -c "cd '$dir' && bun add '@zeabur/design-system@file:$tgz' >/dev/null")
    done < <(git -C "$src" grep -l '"@zeabur/design-system": "github:' -- '*package.json' | sed "s|^|$src/|")
  fi
  echo "$name@${ref:0:8}: taking screenshots"
  mkdir -p "$root/.shots/$name"
  (cd "$src" && nix develop -c scripts/docs-shots.sh docs/shots.yaml "$root/.shots/$name")
done
