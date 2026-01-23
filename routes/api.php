<?php

use App\Http\Controllers\Api\ProjectController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Public stats & featured projects for Welcome page
Route::get('explore/featured', [\App\Http\Controllers\Api\ExploreController::class, 'featured']);
Route::get('explore/stats', [\App\Http\Controllers\Api\ExploreController::class, 'stats']);

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('admin/stats', [\App\Http\Controllers\Api\AdminController::class, 'stats']);
    Route::get('admin/users', [\App\Http\Controllers\Api\AdminController::class, 'users']);
    Route::post('admin/users', [\App\Http\Controllers\Api\AdminController::class, 'storeUser']);
    Route::put('admin/users/{user}', [\App\Http\Controllers\Api\AdminController::class, 'updateUser']);
    Route::put('/admin/users/{user}/role', [\App\Http\Controllers\Api\AdminController::class, 'updateRole']);
    Route::post('/admin/users/{user}/block', [\App\Http\Controllers\Api\AdminController::class, 'toggleBlock']);
    Route::post('/admin/users/{user}/toggle-pro', [\App\Http\Controllers\Api\AdminController::class, 'togglePro']);
    Route::delete('/admin/users/{user}', [\App\Http\Controllers\Api\AdminController::class, 'destroyUser']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('projects', ProjectController::class)->except(['show']);
    Route::apiResource('collections', CollectionController::class);
    Route::post('collections/{collection}/add', [CollectionController::class, 'addProject']);

    Route::get('/notifications', [\App\Http\Controllers\Api\NotificationController::class, 'index']);
    Route::put('/notifications/{id}/read', [\App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);
    Route::put('/notifications/read-all', [\App\Http\Controllers\Api\NotificationController::class, 'markAllAsRead']);

    Route::post('/media/upload', [\App\Http\Controllers\Api\MediaController::class, 'upload']);

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