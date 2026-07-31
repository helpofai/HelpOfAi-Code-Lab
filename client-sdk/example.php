<?php

// example.php
// This is how a buyer would use your script in their WordPress theme, Laravel app, or core software.

require_once __DIR__ . '/LicenseManager.php';

use HOA\Licensing\LicenseManager;

// The buyer provides their key (typically saved in their database or config)
$userLicenseKey = 'HOA-A1B2-C3D4-E5F6'; 

$licenseManager = new LicenseManager(
    $userLicenseKey, 
    'https://yourmarketplace.com' // Your actual domain
);

// Enforce License Verification
if (!$licenseManager->isValid()) {
    // Kill the application or downgrade to free version
    die("<h1>License Error</h1><p>Your license key is invalid, expired, or registered to a different domain. Please purchase a valid license.</p>");
}

// If it reaches here, the software is authenticated cryptographically.
echo "<h1>Welcome to the Pro Version!</h1>";
echo "<p>Your license is valid and verified via RSA.</p>";
