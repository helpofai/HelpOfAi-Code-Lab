<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Project;
use App\Http\Controllers\Admin\FrontManagementController;
use App\Models\SiteSetting;

Route::get('/', function () {
    $settings = SiteSetting::whereIn('group', ['home', 'branding', 'seo', 'typography'])->get()->mapWithKeys(function ($item) {
        return [$item->key => $item->value];
    });

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'siteSettings' => $settings,
    ]);
});

Route::get('/editor/{slug?}', function ($slug = null) {
    $project = null;
    if ($slug) {
        $project = Project::where('slug', $slug)->firstOrFail();
    }
    return Inertia::render('Editor', [
        'project' => $project
    ]);
})->name('editor');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/dashboard/my-projects', function () {
    return Inertia::render('MyProjects');
})->middleware(['auth', 'verified'])->name('my-projects');

Route::get('/explore', function () {
    return Inertia::render('Explore');
})->name('explore');

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', function () {
        return Inertia::render('Admin/AdminDashboard');
    })->name('admin.dashboard');

    Route::get('/admin/users-management', function () {
        return Inertia::render('Admin/UserManagement');
    })->name('admin.users');

    Route::get('/admin/front-management', [FrontManagementController::class, 'index'])->name('admin.front-management');
    Route::post('/admin/front-management', [FrontManagementController::class, 'update'])->name('admin.front-management.update');

    Route::get('/admin/update', [\App\Http\Controllers\Admin\UpdateController::class, 'index'])->name('admin.update');
    Route::post('/admin/update/check', [\App\Http\Controllers\Admin\UpdateController::class, 'check'])->name('admin.update.check');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
