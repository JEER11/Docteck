# Bootstrap script for Windows (PowerShell)
# - Installs Node deps for root and server
# - Sets up Python venv for python_server and installs requirements
# - Starts Flask service and Node backend, then the React app

param(
  [switch]$NoFrontend,
  [switch]$NoBackend,
  [switch]$NoFlask
)

$ErrorActionPreference = 'Stop'

function Info($msg) { Write-Host "[+] $msg" -ForegroundColor Cyan }
function Warn($msg) { Write-Host "[!] $msg" -ForegroundColor Yellow }
function Die($msg) { Write-Error $msg; exit 1 }

# Detect repo root (script directory)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Ensure Node.js exists
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Die "Node.js not found. Install from https://nodejs.org/en/download and re-run."
}

# Ensure Python exists
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
  Warn "Python not found. Install Python 3.10+ from https://www.python.org/downloads/."
}

# Create .env from examples if missing
if (-not (Test-Path ".env") -and (Test-Path ".env.example")) {
  Copy-Item ".env.example" ".env"
  Info "Created .env from .env.example (edit as needed)."
}
if (-not (Test-Path "server/.env") -and (Test-Path "server/.env.example")) {
  Copy-Item "server/.env.example" "server/.env"
  Info "Created server/.env from server/.env.example (edit as needed)."
}
if (-not (Test-Path "python_server/.env") -and (Test-Path "python_server/.env.example")) {
  Copy-Item "python_server/.env.example" "python_server/.env"
  Info "Created python_server/.env from python_server/.env.example (edit as needed)."
}

# Install root deps
Info "Installing root npm deps..."
try { npm install } catch { Die "npm install failed at root." }

# Install server deps
if (-not $NoBackend) {
  Info "Installing server npm deps..."
  Push-Location server
  try { npm install } catch { Pop-Location; Die "npm install failed in server/." }
  Pop-Location
}

# Setup Python venv and install requirements
if (-not $NoFlask) {
  if (Get-Command python -ErrorAction SilentlyContinue) {
    Info "Preparing python_server venv..."
    Push-Location python_server
    if (-not (Test-Path ".venv")) { python -m venv .venv }
    .\.venv\Scripts\Activate.ps1
    try { pip install --upgrade pip setuptools wheel } catch { }
    try { pip install -r requirements.txt } catch { Pop-Location; Die "pip install failed in python_server/." }
    Deactivate
    Pop-Location
  } else {
    Warn "Skipping Flask env setup because Python not found."
  }
}

# Start services
$procs = @()

if (-not $NoFlask) {
  if (Get-Command python -ErrorAction SilentlyContinue) {
    Info "Starting Flask service on :5000..."
    $flaskCmd = "& { Push-Location python_server; .\.venv\Scripts\Activate.ps1; $env:FLASK_APP='app.py'; python -m flask run --host=0.0.0.0 --port=5000 }"
    $procs += Start-Process powershell -ArgumentList "-NoProfile","-Command",$flaskCmd -PassThru
  } else {
    Warn "Flask service not started (Python missing)."
  }
}

if (-not $NoBackend) {
  Info "Starting Node backend on :3001..."
  $procs += Start-Process powershell -ArgumentList "-NoProfile","-Command","cd server; node index.js" -PassThru
}

if (-not $NoFrontend) {
  Info "Starting React dev server on :3000..."
  $procs += Start-Process powershell -ArgumentList "-NoProfile","-Command","npm start" -PassThru
}

Info "Launched services. Press Ctrl+C in each window to stop."
