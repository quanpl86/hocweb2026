# Upload the curated HOC-WEB2026 course package to a NEW / EMPTY GitHub repository.
# Run in PowerShell from the extracted root folder: .\scripts\push-initial.ps1
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$remote = 'https://github.com/quanpl86/hocweb2026.git'
if ($env:HOCWEB_REMOTE) { $remote = $env:HOCWEB_REMOTE } # test/alternate remote
Set-Location $root

function Run-Git {
    & git @args
    if ($LASTEXITCODE -ne 0) { throw "Git command failed (exit $LASTEXITCODE): git $($args -join ' ')" }
}
if (-not (Test-Path README.md) -or -not (Test-Path '02-bai-hoc') -or -not (Test-Path '03-thuc-hanh')) {
    throw 'The course files are missing. Extract the entire ZIP first.'
}
if (Test-Path '.git') { throw 'This script is only for initial publication. The folder already has .git.' }
$name = & git config user.name
$email = & git config user.email
if (-not $name -or -not $email) {
    throw 'Configure git author first: git config --global user.name "Your Name" and git config --global user.email "your-GitHub-noreply-email"'
}
$heads = & git ls-remote --heads $remote
if ($LASTEXITCODE -ne 0) { throw 'Cannot read the remote. Check URL, network or repository access.' }
if ($heads) { throw 'The remote already contains commits. Stop and integrate changes manually; do not overwrite.' }
Run-Git init -b main
Run-Git remote add origin $remote
Run-Git add --all
Run-Git commit -m 'feat: initialize organized HTML CSS teaching materials'
Write-Host 'Local initial commit created. Pushing to GitHub...'
Run-Git push -u origin main
Write-Host 'SUCCESS: https://github.com/quanpl86/hocweb2026'
