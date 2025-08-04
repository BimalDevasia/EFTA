# PowerShell script to rename coperatefront.png to corporatefront.png
Write-Host "Creating a copy of coperatefront.png as corporatefront.png..."

# Check if source file exists
if (Test-Path "c:\Users\muham\EFTA-1\public\coperatefront.png") {
    # Check if target file already exists
    if (Test-Path "c:\Users\muham\EFTA-1\public\corporatefront.png") {
        Write-Host "File corporatefront.png already exists. Removing it first..."
        Remove-Item "c:\Users\muham\EFTA-1\public\corporatefront.png" -Force
    }
    
    # Copy the file with correct spelling
    Copy-Item "c:\Users\muham\EFTA-1\public\coperatefront.png" -Destination "c:\Users\muham\EFTA-1\public\corporatefront.png"
    Write-Host "Created corporatefront.png successfully!"
    
    Write-Host "The original file coperatefront.png is kept for backward compatibility."
    Write-Host "After verifying everything works, you can remove it manually."
} else {
    Write-Host "Error: Source file coperatefront.png not found!"
    exit 1
}

# Update image references in code files
Write-Host "Updating image references in code files..."

# Update in Corporatefront.jsx
$corporatefrontJsxPath = "c:\Users\muham\EFTA-1\src\components\Corporatefront.jsx"
if (Test-Path $corporatefrontJsxPath) {
    (Get-Content $corporatefrontJsxPath) -replace '"/coperatefront.png"', '"/corporatefront.png"' | Set-Content $corporatefrontJsxPath
    Write-Host "Updated reference in Corporatefront.jsx"
} else {
    Write-Host "Warning: Corporatefront.jsx not found"
}

# Update in sampleBannerData.js
$sampleBannerDataPath = "c:\Users\muham\EFTA-1\src\lib\sampleBannerData.js"
if (Test-Path $sampleBannerDataPath) {
    (Get-Content $sampleBannerDataPath) -replace '"./coperatefront.png"', '"./corporatefront.png"' | Set-Content $sampleBannerDataPath
    Write-Host "Updated reference in sampleBannerData.js"
} else {
    Write-Host "Warning: sampleBannerData.js not found"
}

# Update in corporates/page.js
$corporatesPagePath = "c:\Users\muham\EFTA-1\src\app\(withfooter)\corporates\page.js"
if (Test-Path $corporatesPagePath) {
    (Get-Content $corporatesPagePath) -replace '"/coperatefront.png"', '"/corporatefront.png"' | Set-Content $corporatesPagePath
    Write-Host "Updated reference in corporates/page.js"
} else {
    Write-Host "Warning: corporates/page.js not found"
}

Write-Host "Image reference updates completed!"
