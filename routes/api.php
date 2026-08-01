<?php

use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\AssetController;
use App\Http\Controllers\Api\CollectionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Explore Endpoints
Route::get('explore', [\App\Http\Controllers\Api\ExploreController::class, 'index']);
Route::get('explore/categories', [\App\Http\Controllers\Api\ExploreController::class, 'categories']);

// Public stats & featured projects for Welcome page
Route::get('explore/featured', [\App\Http\Controllers\Api\ExploreController::class, 'featured']);
Route::get('explore/paid', [\App\Http\Controllers\Api\ExploreController::class, 'paid']);
Route::get('explore/private', [\App\Http\Controllers\Api\ExploreController::class, 'privateProjects']);
Route::get('explore/stats', [\App\Http\Controllers\Api\ExploreController::class, 'stats']);

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('admin/stats', [\App\Http\Controllers\Api\AdminController::class, 'stats']);
    Route::get('admin/users', [\App\Http\Controllers\Api\AdminController::class, 'users']);
    Route::post('admin/users', [\App\Http\Controllers\Api\AdminController::class, 'storeUser']);
    Route::put('admin/users/{user}', [\App\Http\Controllers\Api\AdminController::class, 'updateUser']);
    Route::put('/admin/users/{user}/role', [\App\Http\Controllers\Api\AdminController::class, 'updateRole']);
    Route::post('/admin/users/{user}/block', [\App\Http\Controllers\Api\AdminController::class, 'toggleBlock']);
    Route::post('/admin/users/{user}/toggle-pro', [\App\Http\Controllers\Api\AdminController::class, 'togglePro']);
    Route::post('/admin/users/{user}/verify-identity', [\App\Http\Controllers\Api\AdminController::class, 'verifyIdentity']);
    Route::post('/admin/users/{user}/update-level', [\App\Http\Controllers\Api\AdminController::class, 'updateLevel']);
    Route::delete('/admin/users/{user}', [\App\Http\Controllers\Api\AdminController::class, 'destroyUser']);
});

Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    Route::post('/projects/{project:slug}/sync-github', [ProjectController::class, 'syncFromGithub']);
    Route::apiResource('projects', ProjectController::class)->except(['show']);
    Route::get('/teams-list', function() {
        return auth()->user()->teams()->get()->merge(auth()->user()->ownedTeams()->get());
    });

    // Access Requests
    Route::post('projects/{project}/request-access', [\App\Http\Controllers\Api\ProjectAccessRequestController::class, 'requestAccess']);
    Route::get('projects/access-requests', [\App\Http\Controllers\Api\ProjectAccessRequestController::class, 'getRequests']);
    Route::post('projects/access-requests/{accessRequest}/approve', [\App\Http\Controllers\Api\ProjectAccessRequestController::class, 'approve']);
    Route::post('projects/access-requests/{accessRequest}/reject', [\App\Http\Controllers\Api\ProjectAccessRequestController::class, 'reject']);
    Route::apiResource('assets', AssetController::class)->only(['index', 'store', 'destroy']);
    
    // Subscription system (Stripe & Multi-Gateway)
    Route::post('/subscription/checkout', [\App\Http\Controllers\Api\SubscriptionController::class, 'checkout']);
    Route::post('/subscription/verify', [\App\Http\Controllers\Api\SubscriptionController::class, 'verify']);
    Route::post('/subscription/portal', [\App\Http\Controllers\Api\SubscriptionController::class, 'portal']);
    Route::get('/subscription/status', [\App\Http\Controllers\Api\SubscriptionController::class, 'status']);
    
    // Neural Checkout Bridge
    Route::post('/payment/phonepe/callback', [\App\Http\Controllers\Api\PurchaseController::class, 'phonepeCallback'])->name('api.phonepe.callback');
    
    Route::get('projects/{project}/revisions', [\App\Http\Controllers\Api\RevisionController::class, 'index']);
    Route::post('projects/{project}/revisions', [\App\Http\Controllers\Api\RevisionController::class, 'store']);
    Route::get('projects/{project}/revisions/{revision}', [\App\Http\Controllers\Api\RevisionController::class, 'show']);
    Route::post('projects/{project}/revisions/{revision}/restore', [\App\Http\Controllers\Api\RevisionController::class, 'restore']);
    
    Route::apiResource('collections', CollectionController::class);
    Route::post('collections/{collection}/add', [CollectionController::class, 'addProject']);

    // Project Purchases
    Route::post('/purchase/checkout', [\App\Http\Controllers\Api\PurchaseController::class, 'checkout'])->middleware('throttle:10,1');
    Route::post('/webhooks/stripe', [\App\Http\Controllers\Api\PurchaseController::class, 'stripeWebhook']);
    
    // GitHub Webhook for Real-time CI/CD Sync
    Route::post('/webhooks/github', [\App\Http\Controllers\Api\GithubWebhookController::class, 'handle'])->middleware('throttle:30,1');
    Route::post('/purchase/verify', [\App\Http\Controllers\Api\PurchaseController::class, 'verify'])->middleware('throttle:30,1');
    Route::get('/purchases/my-purchases', [\App\Http\Controllers\Api\PurchaseController::class, 'myPurchases']);

    Route::get('/notifications', [\App\Http\Controllers\Api\NotificationController::class, 'index']);
    Route::put('/notifications/{id}/read', [\App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);
    Route::put('/notifications/read-all', [\App\Http\Controllers\Api\NotificationController::class, 'markAllAsRead']);

    Route::post('/media/upload', [\App\Http\Controllers\Api\MediaController::class, 'upload']);
    
    // User Identity Verification
    Route::post('/profile/identity', [\App\Http\Controllers\Api\ProfileIdentityController::class, 'uploadIdentity']);

    // Google Drive Sync
    Route::get('/google-drive/auth', [\App\Http\Controllers\Api\GoogleDriveController::class, 'auth']);
    Route::get('/google-drive/list', [\App\Http\Controllers\Api\GoogleDriveController::class, 'list']);
    Route::get('/google-drive/fetch/{fileId}', [\App\Http\Controllers\Api\GoogleDriveController::class, 'fetch']);
    Route::post('/google-drive/save', [\App\Http\Controllers\Api\GoogleDriveController::class, 'save']);
    Route::post('/google-drive/disconnect', [\App\Http\Controllers\Api\GoogleDriveController::class, 'disconnect']);
    Route::delete('/google-drive/delete/{fileId}', [\App\Http\Controllers\Api\GoogleDriveController::class, 'destroy']);
});

Route::get('/google-drive/callback', [\App\Http\Controllers\Api\GoogleDriveController::class, 'callback'])->middleware(['web', 'auth'])->name('google-drive.callback');

// Public route for viewing projects
Route::get('projects/{slug}', [ProjectController::class, 'show']);

// Digital Product Licensing Endpoints
Route::post('/licenses/validate', [\App\Http\Controllers\Api\LicenseValidationController::class, 'verify']);
Route::get('/license/download-update', [\App\Http\Controllers\Api\LicenseValidationController::class, 'downloadUpdate']);

// Vendor Endpoints
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/vendors/payout-accounts', [\App\Http\Controllers\Api\VendorController::class, 'updatePayoutAccounts']);
    Route::post('/vendors/request-payout', [\App\Http\Controllers\Api\VendorController::class, 'requestPayout']);
    Route::get('/vendors/connections', [\App\Http\Controllers\Api\VendorController::class, 'getConnections']);
    Route::post('/vendors/connections', [\App\Http\Controllers\Api\VendorController::class, 'storeConnection']);
    Route::post('/vendors/connections/{id}/verify', [\App\Http\Controllers\Api\VendorController::class, 'verifyConnection']);
    Route::delete('/vendors/connections/{id}', [\App\Http\Controllers\Api\VendorController::class, 'deleteConnection']);
    Route::post('/vendors/github/fetch-md', [\App\Http\Controllers\Api\VendorController::class, 'fetchMarkdownFiles']);
});

// Secure Download Endpoint
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/purchases/{purchaseId}/download', [\App\Http\Controllers\Api\DownloadController::class, 'downloadProject']);
});
