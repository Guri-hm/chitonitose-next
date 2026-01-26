# PowerShell script to import SQL to SQLite
# Requires sqlite3.exe in PATH

$sqlFile = "C:\\Users\\socia\\source\\chitonitose-next\\data\\database.sql"
$dbFile = "C:\\Users\\socia\\source\\chitonitose-next\\data\\data.sqlite3"

if (Test-Path $dbFile) {
    $backup = "$dbFile.backup.$(Get-Date -Format 'yyyyMMddHHmmss')"
    Copy-Item $dbFile $backup
    Remove-Item $dbFile
}

Get-Content $sqlFile | sqlite3 $dbFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Import successful"
    sqlite3 $dbFile ".tables"
} else {
    Write-Host "✗ Import failed"
}
