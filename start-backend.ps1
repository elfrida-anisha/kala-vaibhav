Write-Host "Starting Kala Vaibhav Go Backend Server..." -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot\backend"
$env:PORT = "8080"
$env:GIN_MODE = "release"
& "C:\Users\Elfrida\.gemini\antigravity\scratch\go\bin\go.exe" run ./cmd/server
