# PowerShell script to download water image
$ErrorActionPreference = "Stop"

$directory = "menu/beverages"
$waterImageUrl = "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800"
$outputFile = Join-Path $directory "water.jpg"

Write-Host "Downloading water.jpg..."
try {
    Invoke-WebRequest -Uri $waterImageUrl -OutFile $outputFile
    Write-Host "Successfully downloaded water.jpg"
}
catch {
    Write-Host "Failed to download water.jpg: $_"
} 