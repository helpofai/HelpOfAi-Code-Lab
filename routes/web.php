<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Project;
use App\Http\Controllers\Admin\FrontManagementController;
use App\Models\SiteSetting;

Route::get('/', function () {
    $settings = SiteSetting::whereIn('group', ['home', 'branding', 'seo', 'typography', 'subscription'])->get()->mapWithKeys(function ($item) {
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

Route::get('/projects/{slug}/og-image', [\App\Http\Controllers\Api\ProjectImageController::class, 'show'])->name('projects.og-image');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/dashboard/my-projects', function () {
    return Inertia::render('MyProjects');
})->middleware(['auth', 'verified'])->name('my-projects');



Route::get('/cloud-sync', function () {
    return Inertia::render('CloudSync');
})->middleware(['auth', 'verified'])->name('cloud-sync');

Route::get('/blog', [\App\Http\Controllers\BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{slug}', [\App\Http\Controllers\BlogController::class, 'show'])->name('blog.show');

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
    Route::post('/admin/update/migrate', [\App\Http\Controllers\Admin\UpdateController::class, 'migrate'])->name('admin.update.migrate');
    Route::post('/admin/update/dependencies', [\App\Http\Controllers\Admin\UpdateController::class, 'installDependencies'])->name('admin.update.dependencies');
    Route::post('/admin/update/assets', [\App\Http\Controllers\Admin\UpdateController::class, 'buildAssets'])->name('admin.update.assets');

    Route::get('/admin/info', [\App\Http\Controllers\Admin\InfoController::class, 'index'])->name('admin.info');

    Route::get('/admin/blog', [\App\Http\Controllers\Admin\PostController::class, 'index'])->name('admin.blog.index');
    Route::get('/admin/blog/create', [\App\Http\Controllers\Admin\PostController::class, 'create'])->name('admin.blog.create');
    Route::post('/admin/blog', [\App\Http\Controllers\Admin\PostController::class, 'store'])->name('admin.blog.store');
    Route::get('/admin/blog/{post}/edit', [\App\Http\Controllers\Admin\PostController::class, 'edit'])->name('admin.blog.edit');
    Route::put('/admin/blog/{post}', [\App\Http\Controllers\Admin\PostController::class, 'update'])->name('admin.blog.update');
    Route::delete('/admin/blog/{post}', [\App\Http\Controllers\Admin\PostController::class, 'destroy'])->name('admin.blog.destroy');

    // Page Manager
    Route::resource('/admin/pages', \App\Http\Controllers\Admin\PageManagerController::class)->names('admin.pages');

    Route::get('/admin/subscriptions', [\App\Http\Controllers\Admin\SubscriptionController::class, 'index'])->name('admin.subscriptions');
    Route::post('/admin/subscriptions', [\App\Http\Controllers\Admin\SubscriptionController::class, 'update'])->name('admin.subscriptions.update');
    Route::post('/admin/subscriptions/test-gateway', [\App\Http\Controllers\Admin\SubscriptionController::class, 'testGateway'])->name('admin.subscriptions.test-gateway');

    Route::get('/admin/support', [\App\Http\Controllers\Admin\SupportController::class, 'index'])->name('admin.support');
    Route::get('/admin/support/{ticket}', [\App\Http\Controllers\Admin\SupportController::class, 'show'])->name('admin.support.show');
    Route::post('/admin/support/{ticket}/reply', [\App\Http\Controllers\Admin\SupportController::class, 'reply'])->name('admin.support.reply');
    Route::put('/admin/support/{ticket}/status', [\App\Http\Controllers\Admin\SupportController::class, 'updateStatus'])->name('admin.support.status');
    Route::delete('/admin/support/{ticket}', [\App\Http\Controllers\Admin\SupportController::class, 'destroy'])->name('admin.support.destroy');

    // Admin Email System
    Route::get('/admin/email/send', [\App\Http\Controllers\Admin\EmailController::class, 'sendPage'])->name('admin.email.send');
    Route::post('/admin/email/send', [\App\Http\Controllers\Admin\EmailController::class, 'send'])->name('admin.email.send.process');
    Route::post('/admin/email/resend/{log}', [\App\Http\Controllers\Admin\EmailController::class, 'resend'])->name('admin.email.resend');
    Route::get('/admin/email/settings', [\App\Http\Controllers\Admin\EmailController::class, 'settings'])->name('admin.email.settings');
    Route::post('/admin/email/settings', [\App\Http\Controllers\Admin\EmailController::class, 'updateSettings'])->name('admin.email.settings.update');
    Route::post('/admin/email/test', [\App\Http\Controllers\Admin\EmailController::class, 'testConnection'])->name('admin.email.test');
    Route::resource('admin/email', \App\Http\Controllers\Admin\EmailController::class, ['names' => 'admin.email']);
});

Route::middleware('auth')->group(function () {
    Route::get('/support', [\App\Http\Controllers\SupportController::class, 'index'])->name('support.index');
    Route::post('/support', [\App\Http\Controllers\SupportController::class, 'store'])->name('support.store');
    Route::get('/support/{ticket}', [\App\Http\Controllers\SupportController::class, 'show'])->name('support.show');
    Route::post('/support/{ticket}/reply', [\App\Http\Controllers\SupportController::class, 'reply'])->name('support.reply');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Personal Google Drive Config
    Route::post('/api/google-drive/config', function (\Illuminate\Http\Request $request) {
        $validated = $request->validate([
            'google_client_id' => 'required|string',
            'google_client_secret' => 'required|string',
        ]);
        
        $user = auth()->user();
        $user->personal_google_client_id = $validated['google_client_id'];
        $user->personal_google_client_secret = $validated['google_client_secret'];
        $user->save();
        
        return back()->with('success', 'Config_Stored');
    })->name('google-drive.save-config');

    // Team System
    Route::resource('teams', \App\Http\Controllers\TeamController::class)->except(['create', 'edit']);
    Route::post('teams/{team}/members', [\App\Http\Controllers\TeamController::class, 'addMember'])->name('teams.members.store');
    Route::delete('teams/{team}/members/{user}', [\App\Http\Controllers\TeamController::class, 'removeMember'])->name('teams.members.destroy');
    Route::delete('teams/{team}/invitations/{invitation}', [\App\Http\Controllers\TeamController::class, 'cancelInvitation'])->name('teams.invitations.destroy');
    Route::post('invitations/{invitation}/accept', [\App\Http\Controllers\TeamController::class, 'acceptInvitation'])->name('invitations.accept');
    Route::delete('invitations/{invitation}', [\App\Http\Controllers\TeamController::class, 'rejectInvitation'])->name('invitations.destroy');
});

Route::get('/p/{slug}', function ($slug) {
    $page = \App\Models\Page::where('slug', $slug)->where('is_published', true)->firstOrFail();
    return Inertia::render('Page', [
        'page' => $page
    ]);
})->name('pages.show');

require __DIR__.'/auth.php';
