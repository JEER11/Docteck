# Test upload to Flask OCR endpoint via Node proxy
# Usage: .\test_upload.ps1 -FilePath C:\path\to\image.jpg
param(
  [string]$FilePath = "C:\\Windows\\Web\\Wallpaper\\Windows\\img0.jpg"
)

if (-not (Test-Path $FilePath)) { Write-Error "File not found: $FilePath"; exit 1 }

$resp = curl -F "file=@$FilePath" http://localhost:3001/api/flask/api/ocr
Write-Output $resp
