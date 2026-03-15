#!/usr/bin/env powershell

# 🧪 AirCart Phase 3 Integration Testing Script
# Date: March 14, 2026

Write-Host "`n" -ForegroundColor Green
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     🧪 AIRCART PHASE 3 - INTEGRATION TEST SUITE 🧪         ║" -ForegroundColor Cyan
Write-Host "║             Testing Backend + Frontend                     ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

# Test Results
$testsPassed = 0
$testsFailed = 0
$testResults = @()

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [object]$Body,
        [string]$ExpectedStatus
    )
    
    Write-Host "`n🔍 Testing: $Name" -ForegroundColor Yellow
    Write-Host "   URL: $Method $Url" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            UseBasicParsing = $true
            TimeoutSec = 5
        }
        
        if ($Body) {
            $params['ContentType'] = 'application/json'
            $params['Body'] = ($Body | ConvertTo-Json)
        }
        
        $response = Invoke-WebRequest @params -ErrorAction Stop
        $statusCode = $response.StatusCode
        
        if ($statusCode -eq 200 -or $statusCode -eq 201) {
            Write-Host "   ✅ PASS - Status: $statusCode" -ForegroundColor Green
            Write-Host "   Response Length: $($response.Content.Length) bytes" -ForegroundColor Green
            $testsPassed++
            return $true
        } else {
            Write-Host "   ❌ FAIL - Status: $statusCode (expected 200/201)" -ForegroundColor Red
            $testsFailed++
            return $false
        }
    } catch {
        Write-Host "   ❌ FAIL - $($_.Exception.Message)" -ForegroundColor Red
        $testsFailed++
        return $false
    }
}

# ===============================================
Write-Host "`n📈 PHASE 3 BACKEND TESTS" -ForegroundColor Cyan
Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Cyan

# 1. Health Check
Test-Endpoint -Name "Backend Health Check" -Method "GET" -Url "http://localhost:5000/api/health"

# 2. Get Products
Test-Endpoint -Name "Get All Products" -Method "GET" -Url "http://localhost:5000/api/products"

# 3. Get Featured Products
Test-Endpoint -Name "Get Featured Products" -Method "GET" -Url "http://localhost:5000/api/products/featured"

# 4. Get Product by ID
Test-Endpoint -Name "Get Product by ID" -Method "GET" -Url "http://localhost:5000/api/products/1"

# 5. Register User
$registerBody = @{
    email = "testuser$(Get-Random)@example.com"
    password = "Test@12345"
    name = "Test User"
}
Test-Endpoint -Name "User Registration" -Method "POST" -Url "http://localhost:5000/api/auth/register" -Body $registerBody

# 6. Login User
$loginBody = @{
    email = "phase2user@example.com"
    password = "Phase2@Secure"
}
Test-Endpoint -Name "User Login" -Method "POST" -Url "http://localhost:5000/api/auth/login" -Body $loginBody

# 7. Get Cart
Test-Endpoint -Name "Get Shopping Cart" -Method "GET" -Url "http://localhost:5000/api/cart"

# 8. Get Cart Summary
Test-Endpoint -Name "Get Cart Summary" -Method "GET" -Url "http://localhost:5000/api/cart/summary"

# 9. Test Frontend Home Page
Write-Host "`n📈 PHASE 3 FRONTEND TESTS" -ForegroundColor Cyan
Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Cyan

Test-Endpoint -Name "Home Page (Frontend)" -Method "GET" -Url "http://localhost:3001"

# 10. Test Products Page
Test-Endpoint -Name "Products Page (Frontend)" -Method "GET" -Url "http://localhost:3001/products"

# 11. Test Login Page
Test-Endpoint -Name "Login Page (Frontend)" -Method "GET" -Url "http://localhost:3001/auth/login"

# 12. Test Cart Page
Test-Endpoint -Name "Cart Page (Frontend)" -Method "GET" -Url "http://localhost:3001/cart"

# ===============================================
Write-Host "`n" -ForegroundColor Green
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                    📊 TEST RESULTS SUMMARY                 ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host "`n✅ Tests Passed: $testsPassed" -ForegroundColor Green
Write-Host "❌ Tests Failed: $testsFailed" -ForegroundColor Red
$totalTests = $testsPassed + $testsFailed
$passPercentage = if ($totalTests -gt 0) { [Math]::Round(($testsPassed / $totalTests) * 100, 2) } else { 0 }
Write-Host "📈 Success Rate: $passPercentage%" -ForegroundColor Cyan

Write-Host "`n" -ForegroundColor Green
if ($testsFailed -eq 0) {
    Write-Host "🎉 ALL TESTS PASSED! 🎉" -ForegroundColor Green
    Write-Host "`nPhase 3 Frontend Integration: ✅ COMPLETE" -ForegroundColor Green
    Write-Host "Status: Ready for Phase 4 & Production Deployment" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some tests failed. Review output above." -ForegroundColor Yellow
}

Write-Host "`n════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Visit: http://localhost:3001 (Frontend)" -ForegroundColor Gray
Write-Host "  2. Test user interactions (browse, filter, add to cart)" -ForegroundColor Gray
Write-Host "  3. Proceed to Phase 4 (Orders & Payments)" -ForegroundColor Gray
Write-Host "`n" -ForegroundColor Green
