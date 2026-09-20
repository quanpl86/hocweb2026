#!/usr/bin/env bash
# Upload the curated HOC-WEB2026 course package to a NEW / EMPTY GitHub repository.
# Run from any directory: bash scripts/push-initial.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REMOTE="${HOCWEB_REMOTE:-https://github.com/quanpl86/hocweb2026.git}"
cd "$ROOT"

if [[ ! -f README.md || ! -d 02-bai-hoc || ! -d 03-thuc-hanh ]]; then
  echo 'ERROR: The HOC-WEB2026 course files are missing. Extract the entire ZIP first.' >&2
  exit 1
fi
if [[ -d .git ]]; then
  echo 'STOP: This folder already has .git. This script is only for initial publication.' >&2
  exit 1
fi
if ! git config user.name >/dev/null || ! git config user.email >/dev/null; then
  echo 'ERROR: Configure your Git author identity first:' >&2
  echo 'git config --global user.name "Your Name"' >&2
  echo 'git config --global user.email "your-GitHub-noreply-email"' >&2
  exit 1
fi

# Never overwrite an existing branch, including a branch that is not named main.
if ! branches="$(git ls-remote --heads "$REMOTE")"; then
  echo 'ERROR: Cannot read the remote repository. Check URL, network or repository access.' >&2
  exit 1
fi
if [[ -n "$branches" ]]; then
  echo 'STOP: The remote already contains commits. Do not overwrite it.' >&2
  echo 'Use git clone and manually integrate the course files into a new branch instead.' >&2
  exit 1
fi

git init -b main
git remote add origin "$REMOTE"
git add --all
git commit -m 'feat: initialize organized HTML CSS teaching materials'
echo 'Local initial commit created. Pushing to GitHub...'
git push -u origin main
echo 'SUCCESS: Published to GitHub. Visit https://github.com/quanpl86/hocweb2026'
