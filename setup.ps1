# 💎 Luxe Jewelry Boutique - Installation & Setup

Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                           ║" -ForegroundColor Cyan
Write-Host "║        LUXE JEWELRY BOUTIQUE - INSTALLATION SCRIPT        ║" -ForegroundColor Cyan
Write-Host "║        Premium 3D E-Commerce Platform Setup               ║" -ForegroundColor Cyan
Write-Host "║                                                           ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check Node.js installation
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
Write-Host ""

$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js not found!" -ForegroundColor Red
    Write-Host "  Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# Check npm installation
$npmVersion = npm --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ npm installed: v$npmVersion" -ForegroundColor Green
} else {
    Write-Host "✗ npm not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
Write-Host "This may take 2-3 minutes..." -ForegroundColor Gray
Write-Host ""

# Install dependencies
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Dependencies installed successfully!" -ForegroundColor Green
    Write-Host ""
    
    # Success message
    Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║                                                           ║" -ForegroundColor Green
    Write-Host "║                  INSTALLATION COMPLETE!                   ║" -ForegroundColor Green
    Write-Host "║                                                           ║" -ForegroundColor Green
    Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    
    # Next steps
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Start the development server:" -ForegroundColor White
    Write-Host "   npm run dev" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "2. Open your browser:" -ForegroundColor White
    Write-Host "   http://localhost:3000" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "3. Read the documentation:" -ForegroundColor White
    Write-Host "   • README.md - Complete guide" -ForegroundColor Gray
    Write-Host "   • QUICKSTART.md - Quick reference" -ForegroundColor Gray
    Write-Host "   • DEVELOPMENT.md - Developer guide" -ForegroundColor Gray
    Write-Host ""
    
    # Project info
    Write-Host "Project Structure:" -ForegroundColor Cyan
    Write-Host "  src/app/          - Pages (Home, Shop, Product, About, Contact)" -ForegroundColor Gray
    Write-Host "  src/components/   - Reusable components" -ForegroundColor Gray
    Write-Host "  src/lib/          - Data and utilities" -ForegroundColor Gray
    Write-Host "  src/store/        - State management (Zustand)" -ForegroundColor Gray
    Write-Host ""
    
    # Tips
    Write-Host "Tips:" -ForegroundColor Cyan
    Write-Host "  • Edit products in src/lib/data.ts" -ForegroundColor Gray
    Write-Host "  • Customize colors in tailwind.config.ts" -ForegroundColor Gray
    Write-Host "  • Change hero text in src/components/home/Hero.tsx" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "Ready to build luxury experiences! 💎" -ForegroundColor Magenta
    Write-Host ""
    
} else {
    Write-Host ""
    Write-Host "✗ Installation failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Delete node_modules folder" -ForegroundColor Gray
    Write-Host "2. Delete package-lock.json" -ForegroundColor Gray
    Write-Host "3. Run: npm cache clean --force" -ForegroundColor Gray
    Write-Host "4. Run this script again" -ForegroundColor Gray
    Write-Host ""
    exit 1
}
