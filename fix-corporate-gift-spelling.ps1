# PowerShell script to run the corporate gift spelling fix migration
Write-Host "Running corporate gift spelling fix migration..."
Write-Host "Trying with CommonJS version..."
node scripts/fixCorporateGiftSpellingCJS.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "CommonJS version failed, trying with ESM version..."
    node --experimental-modules scripts/fixCorporateGiftSpelling.js
}
Write-Host "Migration script execution complete."
