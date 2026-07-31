<?php
/**
 * Vanilla PHP Integration (With Built-in UI)
 * Place this at the very top of your index.php
 */

$API_URL = 'YOUR_MARKETPLACE_URL_HERE/api/licenses/validate';
$CACHE_FILE = __DIR__ . '/.license_data.json';

// Handle Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['license_key'])) {
    $ch = curl_init($API_URL);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'license_key' => $_POST['license_key'],
        'domain' => $_SERVER['HTTP_HOST']
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code == 200) {
        $result = json_decode($response, true);
        if (isset($result['valid']) && $result['valid']) {
            $result['cached_at'] = time();
            file_put_contents($CACHE_FILE, json_encode($result));
            header("Location: " . $_SERVER['PHP_SELF']);
            exit;
        }
    }
    $error = "Invalid license key or domain mismatch.";
}

// Check License Cache
$is_valid = false;
$data = [];
if (file_exists($CACHE_FILE)) {
    $data = json_decode(file_get_contents($CACHE_FILE), true);
    // Cache lasts for 24 hours (86400 seconds)
    if (isset($data['valid']) && $data['valid'] && (time() - $data['cached_at'] < 86400)) {
        $is_valid = true;
    }
}

// IF NOT VALID, HALT SCRIPT AND RENDER UI
if (!$is_valid) {
    http_response_code(403);
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>Product Activation</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-100 flex items-center justify-center min-h-screen">
        <div class="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-200">
            <h2 class="text-2xl font-black text-gray-800 mb-2">Activate Product</h2>
            <p class="text-sm text-gray-500 mb-6">This application requires a valid license key to run.</p>
            
            <?php if (isset($error)): ?>
                <div class="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100"><?php echo $error; ?></div>
            <?php endif; ?>

            <form method="POST">
                <input type="text" name="license_key" class="w-full border border-gray-300 rounded-lg p-3 mb-4 font-mono focus:ring-2 focus:ring-blue-500 outline-none" placeholder="XXXX-XXXX-XXXX-XXXX" required>
                <button type="submit" class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">Verify & Activate</button>
            </form>
        </div>
    </body>
    </html>
    <?php
    exit; // Stop executing the rest of the application
}

// IF VALID, YOU CAN OPTIONALLY ADD A ?license_dashboard=1 URL PARAM TO VIEW STATUS
if (isset($_GET['license_dashboard'])) {
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>License Dashboard</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-100 p-8">
        <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h1 class="text-2xl font-black mb-6">License Dashboard</h1>
            <div class="bg-emerald-500 text-white p-4 rounded-xl mb-6">
                <h3 class="font-bold text-lg">Active License: <?php echo htmlspecialchars($data['product_name'] ?? ''); ?></h3>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-50 p-4 rounded-lg border"><strong>Author:</strong> <?php echo htmlspecialchars($data['author_name'] ?? ''); ?></div>
                <div class="bg-gray-50 p-4 rounded-lg border"><strong>Version:</strong> <?php echo htmlspecialchars($data['version'] ?? ''); ?></div>
                <div class="bg-gray-50 p-4 rounded-lg border"><strong>Support Expiry:</strong> <?php echo htmlspecialchars($data['support_expires_at'] ?? ''); ?></div>
                <div class="bg-gray-50 p-4 rounded-lg border"><strong>Build Hash:</strong> <?php echo htmlspecialchars($data['build_hash'] ?? ''); ?></div>
            </div>
            <a href="?" class="mt-6 inline-block text-blue-600 hover:underline">Return to App</a>
        </div>
    </body>
    </html>
    <?php
    exit;
}
