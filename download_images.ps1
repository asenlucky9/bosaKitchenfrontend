# PowerShell script to download beverage images
$ErrorActionPreference = "Stop"

# Create directory if it doesn't exist
$directory = "menu/beverages"
if (-not (Test-Path $directory)) {
    New-Item -ItemType Directory -Path $directory
}

# Image URLs (from Unsplash and Pexels - free to use commercially)
$images = @{
    "coca-cola.jpg" = "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800"
    "sprite.jpg" = "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=800"
    "fanta.jpg" = "https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=800"
    "ginger-ale.jpg" = "https://images.pexels.com/photos/2983100/pexels-photo-2983100.jpeg?w=800"
    "bissap.jpg" = "https://images.unsplash.com/photo-1570696516188-ade861b84a49?w=800"
    "ginger-beer.jpg" = "https://images.pexels.com/photos/4021983/pexels-photo-4021983.jpeg?w=800"
    "water.jpg" = "https://images.unsplash.com/photo-1616118132534-381148898dd4?w=800"
    "sparkling-water.jpg" = "https://images.unsplash.com/photo-1598705352140-be8e33a97d55?w=800"
}

# Download each image
foreach ($image in $images.GetEnumerator()) {
    $outputFile = Join-Path $directory $image.Key
    Write-Host "Downloading $($image.Key)..."
    
    try {
        Invoke-WebRequest -Uri $image.Value -OutFile $outputFile
        Write-Host "Successfully downloaded $($image.Key)"
    }
    catch {
        Write-Host "Failed to download $($image.Key): $_"
    }
}

Write-Host "Download complete!" 