#!/usr/bin/env bash
set -euo pipefail

REMOTE_URL="https://github.com/rickymamansandbox/rickymamansandbox.github.io.git"
DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"
ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

printf 'This will replace the published files in %s (%s), including its Jekyll workflow.\n' "$REMOTE_URL" "$DEPLOY_BRANCH"
read -r -p 'Continue? [y/N] ' confirmation
if [[ "$confirmation" != "y" && "$confirmation" != "Y" ]]; then
  printf 'Deployment cancelled.\n'
  exit 0
fi

printf 'url: "https://rickymamansandbox.github.io"\nbaseurl: ""\n' > "$TMP_DIR/deploy.yml"
(
  cd "$ROOT_DIR"
  bundle exec jekyll build --config "$ROOT_DIR/_config.yml,$TMP_DIR/deploy.yml" --destination "$TMP_DIR/site"
)

git clone --branch "$DEPLOY_BRANCH" "$REMOTE_URL" "$TMP_DIR/repo"
rsync -a --delete --exclude='/.git/' "$TMP_DIR/site/" "$TMP_DIR/repo/"
touch "$TMP_DIR/repo/.nojekyll"

git -C "$TMP_DIR/repo" add -A
if git -C "$TMP_DIR/repo" diff --cached --quiet; then
  printf 'The published site is already up to date.\n'
  exit 0
fi

git -C "$TMP_DIR/repo" commit -m "Deploy Bahtera site"
git -C "$TMP_DIR/repo" push origin "$DEPLOY_BRANCH"
printf 'Deployment complete.\n'