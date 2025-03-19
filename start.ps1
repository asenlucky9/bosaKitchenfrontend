# Change to the frontend directory
Set-Location -Path "bosaKitchenfrontend"

# Install dependencies
Write-Host "Installing dependencies..."
npm install

# Start the server
Write-Host "Starting the server..."
npm start 