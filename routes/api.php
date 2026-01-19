<?php

use App\Http\Controllers\Api\ProjectController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Public discovery routes
Route::get('explore/latest', [\App\Http\Controllers\Api\ExploreController::class, 'latest']);
Route::get('explore/random', [\App\Http\Controllers\Api\ExploreController::class, 'random']);
Route::get('explore/featured', [\App\Http\Controllers\Api\ExploreController::class, 'featured']);

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('admin/stats', [\App\Http\Controllers\Api\AdminController::class, 'stats']);
    Route::get('admin/users', [\App\Http\Controllers\Api\AdminController::class, 'users']);
    Route::post('admin/users', [\App\Http\Controllers\Api\AdminController::class, 'storeUser']);
    Route::put('admin/users/{user}', [\App\Http\Controllers\Api\AdminController::class, 'updateUser']);
    Route::put('admin/users/{user}/role', [\App\Http\Controllers\Api\AdminController::class, 'updateRole']);
    Route::post('admin/users/{user}/block', [\App\Http\Controllers\Api\AdminController::class, 'toggleBlock']);
    Route::delete('admin/users/{user}', [\App\Http\Controllers\Api\AdminController::class, 'destroyUser']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('projects', ProjectController::class)->except(['show']);
    Route::apiResource('collections', CollectionController::class);
    Route::post('collections/{collection}/add', [CollectionController::class, 'addProject']);
});

// Public route for viewing projects
Route::get('projects/{slug}', [ProjectController::class, 'show']);