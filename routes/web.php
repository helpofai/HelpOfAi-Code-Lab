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
    Route::post('/admin/update/start', [\App\Http\Controllers\Admin\UpdateController::class, 'start'])->name('admin.update.start');

    Route::get('/admin/support', [\App\Http\Controllers\Admin\SupportController::class, 'index'])->name('admin.support');
    Route::get('/admin/support/{ticket}', [\App\Http\Controllers\Admin\SupportController::class, 'show'])->name('admin.support.show');
    Route::post('/admin/support/{ticket}/reply', [\App\Http\Controllers\Admin\SupportController::class, 'reply'])->name('admin.support.reply');
    Route::put('/admin/support/{ticket}/status', [\App\Http\Controllers\Admin\SupportController::class, 'updateStatus'])->name('admin.support.status');
    Route::delete('/admin/support/{ticket}', [\App\Http\Controllers\Admin\SupportController::class, 'destroy'])->name('admin.support.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/support', [\App\Http\Controllers\SupportController::class, 'index'])->name('support.index');
    Route::post('/support', [\App\Http\Controllers\SupportController::class, 'store'])->name('support.store');
    Route::get('/support/{ticket}', [\App\Http\Controllers\SupportController::class, 'show'])->name('support.show');
    Route::post('/support/{ticket}/reply', [\App\Http\Controllers\SupportController::class, 'reply'])->name('support.reply');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
