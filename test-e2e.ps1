$baseUrl = "http://localhost:8080/api"
$passed = 0
$failed = 0

function Assert-Test($condition, $testName) {
    if ($condition) {
        Write-Host " [PASS] $testName" -ForegroundColor Green
        $script:passed++
    } else {
        Write-Host " [FAIL] $testName" -ForegroundColor Red
        $script:failed++
    }
}

Write-Host ">>> Running TEST A: Artisan Listing and Kala Mitra Voice..." -ForegroundColor Yellow

# 1. Login as artisan
$artisanLogin = Invoke-RestMethod -Uri "$baseUrl/auth/demo-login" -Method Post -Body '{"role": "artisan"}' -ContentType "application/json"
Assert-Test ($artisanLogin.user.role -eq "artisan") "TEST A.1: Artisan login authentication"

# 2. Extract listing via Kala Mitra
$extractBody = '{"transcript": "This is a handmade Kasuti bag. The price is 800 rupees. It took me three days to make."}'
$extracted = Invoke-RestMethod -Uri "$baseUrl/ai/extract-listing" -Method Post -Body $extractBody -ContentType "application/json"
Assert-Test ($extracted.extracted.price -eq 800 -and $extracted.extracted.craftType -eq "Kasuti Embroidery") "TEST A.2: Kala Mitra AI structured voice extraction"

# 3. Create and publish product
$artisanHeader = @{ "X-Demo-User" = $artisanLogin.user.id }
$newProdBody = @{
    title = "Handcrafted Test Silk Stole"
    craftType = "Kasuti Embroidery"
    category = "Textiles & Embroidery"
    description = "Authentic counted-thread silk stole with temple motifs"
    price = 1200
    materials = "Pure Silk"
    timeToMake = "4 days"
    stockQuantity = 5
    imageUrls = @("https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80")
} | ConvertTo-Json
$createdProd = Invoke-RestMethod -Uri "$baseUrl/products" -Method Post -Body $newProdBody -Headers $artisanHeader -ContentType "application/json"
Assert-Test ($createdProd.product.title -eq "Handcrafted Test Silk Stole") "TEST A.3: Product creation and marketplace publication"

# 4. Verify product in catalogue
$catalogue = Invoke-RestMethod -Uri "$baseUrl/products?search=Test%20Silk" -Method Get
Assert-Test ($catalogue.count -ge 1) "TEST A.4: Published product appears in catalogue search"

Write-Host "`n>>> Running TEST B: Existing Product Purchase and Mock Payment..." -ForegroundColor Yellow

# 1. Login as buyer
$buyerLogin = Invoke-RestMethod -Uri "$baseUrl/auth/demo-login" -Method Post -Body '{"role": "buyer"}' -ContentType "application/json"
Assert-Test ($buyerLogin.user.role -eq "buyer") "TEST B.1: Buyer login authentication"

# 2. Place order with server price validation
$buyerHeader = @{ "X-Demo-User" = $buyerLogin.user.id }
$orderBody = @{
    items = @(
        @{
            productId = $createdProd.product.id
            quantity = 1
            unitPrice = 1 # Client manipulation attempt
        }
    )
    shippingAddress = @{
        fullName = "Anamika Sharma"
        phone = "+91 98110 55555"
        addressLine1 = "14B Heritage Palms"
        city = "Bengaluru"
        state = "Karnataka"
        postalCode = "560034"
    }
    isDemo = $true
} | ConvertTo-Json
$createdOrder = Invoke-RestMethod -Uri "$baseUrl/orders" -Method Post -Body $orderBody -Headers $buyerHeader -ContentType "application/json"
Assert-Test ($createdOrder.order.totalAmount -eq 1200) "TEST B.2: Order created with server-enforced authentic price"

# 3. Simulate payment verification
$paymentVerifyBody = @{
    orderId = $createdOrder.order.id
    razorpayOrderId = "DEMO-RZP-12345"
    razorpayPaymentId = "pay_demo_test"
    razorpaySignature = "sig_test"
    isMock = $true
} | ConvertTo-Json
$verifiedPayment = Invoke-RestMethod -Uri "$baseUrl/payments/verify" -Method Post -Body $paymentVerifyBody -ContentType "application/json"
Assert-Test ($verifiedPayment.order.status -eq "paid") "TEST B.3: Payment verification and order marked paid"

Write-Host "`n>>> Running TEST C: CreateConnect Custom Commission..." -ForegroundColor Yellow

# 1. Submit custom request as buyer
$customReqBody = @{
    title = "Custom Heirloom Bridal Panel"
    description = "Need bespoke Kasuti panel with ancestral peacock gopuram"
    craftType = "Kasuti Embroidery"
    budgetMin = 5000
    budgetMax = 9000
    desiredDate = "2026-12-25"
    referenceImageUrl = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
    isPrivate = $false
} | ConvertTo-Json
$createdCustomReq = Invoke-RestMethod -Uri "$baseUrl/custom-requests" -Method Post -Body $customReqBody -Headers $buyerHeader -ContentType "application/json"
Assert-Test ($createdCustomReq.request.title -eq "Custom Heirloom Bridal Panel") "TEST C.1: Buyer submitted custom commission request"

# 2. Submit proposal as artisan
$proposalBody = @{
    proposedPrice = 7200
    estimatedDays = 15
    message = "I will use authentic Tussar silk and pure natural madder dyes."
} | ConvertTo-Json
$proposalRes = Invoke-RestMethod -Uri "$baseUrl/custom-requests/$($createdCustomReq.request.id)/proposals" -Method Post -Body $proposalBody -Headers $artisanHeader -ContentType "application/json"
Assert-Test ($proposalRes.proposal.proposedPrice -eq 7200) "TEST C.2: Artisan submitted custom proposal"

# 3. Accept proposal as buyer
$acceptBody = @{ proposalId = $proposalRes.proposal.id } | ConvertTo-Json
$acceptRes = Invoke-RestMethod -Uri "$baseUrl/custom-requests/$($createdCustomReq.request.id)/accept" -Method Post -Body $acceptBody -Headers $buyerHeader -ContentType "application/json"
Assert-Test ($acceptRes.message -like "*accepted*") "TEST C.3: Buyer accepted proposal and milestone started"

Write-Host "`n>>> Running TEST D: Digital Craft Passport and Story..." -ForegroundColor Yellow
$passport = Invoke-RestMethod -Uri "$baseUrl/passports/$($createdProd.product.id)" -Method Get
Assert-Test ($passport.passport.provenanceStatus -eq "artisan-declared") "TEST D.1: Auto-linked Digital Craft Passport exists with provenance tier"

Write-Host "`n>>> Running TEST E: Security and Role Permissions..." -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$baseUrl/admin/metrics" -Method Get -Headers $buyerHeader -ErrorAction Stop
    Assert-Test $false "TEST E.1: Buyer prevented from admin access"
} catch {
    Assert-Test ($_.Exception.Response.StatusCode.value__ -eq 403) "TEST E.1: Unauthorized buyer blocked from admin portal (403 Forbidden)"
}

Write-Host "`n>>> Running TEST F: Transparent Pricing Assistance..." -ForegroundColor Yellow
$pricingBody = @{
    craftType = "Kasuti Embroidery"
    materialCost = 400
    labourHours = 10
    hourlyRate = 120
    overheadsCost = 80
    packagingCost = 50
    complexityTier = "moderate"
} | ConvertTo-Json
$pricingRes = Invoke-RestMethod -Uri "$baseUrl/ai/pricing-guidance" -Method Post -Body $pricingBody -ContentType "application/json"
Assert-Test ($pricingRes.pricing.recommendedFairPrice -gt $pricingRes.pricing.baseProductionCost) "TEST F.1: Fair pricing calculated with dignified wage and margin"

Write-Host "`n===================================================="
Write-Host "FINAL RESULTS: $passed PASSED, $failed FAILED"
Write-Host "===================================================="

if ($failed -eq 0) {
    Exit 0
} else {
    Exit 1
}
