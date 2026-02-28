$base = 'c:/Users/a186587500/dev/chitonitose-next/content/jh/omnibus'
for ($n = 8; $n -le 26; $n++) {
    $f = Join-Path $base "$n.md"
    Write-Host "=== $n.md ==="
    Get-Content $f | Select-Object -First 5
    Write-Host ""
}
