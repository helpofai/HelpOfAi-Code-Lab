<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Project;
use App\Models\License;
use Illuminate\Support\Facades\Http;

echo "Starting E2E System Test...\n\n";

// 1. Setup Data
$user = User::firstOrCreate(
    ['email' => 'testvendor@example.com'],
    ['name' => 'Test Vendor', 'password' => bcrypt('password'), 'level' => 4, 'role' => 'vendor']
);

$project = Project::firstOrCreate(
    ['slug' => 'test-github-project'],
    [
        'user_id' => $user->id,
        'title' => 'Test GitHub Project',
        'is_public' => true,
        'github_repo_url' => 'https://github.com/helpofai/HOA-Stream',
        'version' => '1.0.0',
        'code' => ['html' => '', 'css' => '', 'js' => '']
    ]
);
$project->update(['github_repo_url' => 'https://github.com/helpofai/HOA-Stream']);

$license = License::firstOrCreate(
    ['license_key' => 'TEST-KEY-1234-5678'],
    [
        'project_id' => $project->id,
        'user_id' => $user->id,
        'is_valid' => true,
    ]
);

echo "[PASS] Database setup complete.\n";

// 2. Test License Validation (First Activation)
$request = Request::create('/api/licenses/validate', 'POST', [
    'license_key' => 'TEST-KEY-1234-5678',
    'domain' => 'test-client.com'
]);
$response = app()->handle($request);
if ($response->status() !== 200) {
    die("[FAIL] License Validation failed with status {$response->status()}: " . $response->getContent() . "\n");
}
echo "[PASS] License Activation and Node-Locking successful.\n";

// 3. Test GitHub Sync (Webhook Simulation)
Auth::login($user); // Login as the vendor
$syncRequest = Request::create('/api/projects/' . $project->slug . '/sync-github', 'POST');
$syncResponse = app()->handle($syncRequest);

if ($syncResponse->status() !== 200) {
    die("[FAIL] GitHub Sync failed with status {$syncResponse->status()}: " . $syncResponse->getContent() . "\n");
}
echo "[PASS] GitHub Sync and Auto-Zipping successful. Version updated to: " . json_decode($syncResponse->getContent())->version . "\n";

// 4. Test OTA Download
$downloadRequest = Request::create('/api/license/download-update', 'GET', [
    'key' => 'TEST-KEY-1234-5678',
    'domain' => 'test-client.com'
]);
$downloadResponse = app()->handle($downloadRequest);

if ($downloadResponse->getStatusCode() !== 200) {
    die("[FAIL] OTA Download failed with status {$downloadResponse->getStatusCode()}: \n");
}
echo "[PASS] OTA Download successful. File served securely.\n";

echo "\nAll Tests Passed Successfully!\n";
