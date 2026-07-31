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
        'siteSettings' => $settings,
    ]);
});

Route::get('/explore', function () {
    return Inertia::render('Explore');
})->name('explore');

Route::get('/marketplace', function () {
    return Inertia::render('Marketplace');
})->name('marketplace');

Route::get('/editor/{slug?}', function ($slug = null) {
    $project = null;
    if ($slug) {
        $project = Project::with(['user', 'team'])->where('slug', $slug)->firstOrFail();
        
        $user = auth()->user();
        $hasPurchased = false;
        if ($user) {
            $hasPurchased = $project->purchases()->where('user_id', $user->id)->exists();
        }

        $isOwner = $user && $project->user_id === $user->id;
        $isTeamMember = $project->team_id && $user && 
                        $user->teams()->where('teams.id', $project->team_id)->exists();

        $isRestricted = false;
        $accessRequestStatus = null;
        // Security Guard: Private Projects
        if (!$project->is_public && !$isOwner && !$isTeamMember && !$hasPurchased) {
            $isRestricted = true;
            
            if ($user) {
                $accessRequest = \App\Models\ProjectAccessRequest::where('project_id', $project->id)
                    ->where('user_id', $user->id)
                    ->first();
                    
                if ($accessRequest) {
                    $accessRequestStatus = $accessRequest->status;
                    if ($accessRequestStatus === 'approved') {
                        $isRestricted = false;
                    }
                }
            }
        }

        // Add metadata for frontend logic
        $project->has_purchased = $hasPurchased;
        $project->is_restricted = $isRestricted;
        $project->access_request_status = $accessRequestStatus;

        // Force visibility of code and settings for Live Previews
        $project->makeVisible(['code', 'settings']);
    }
    return Inertia::render('Editor', [
        'project' => $project
    ]);
})->name('editor');

Route::get('/projects/{slug}/og-image', [\App\Http\Controllers\Api\ProjectImageController::class, 'show'])->name('projects.og-image');

Route::get('/project/{slug}', function ($slug) {
    $project = Project::with(['user', 'team'])->where('slug', $slug)->firstOrFail();
    
    $user = auth()->user();
    $hasPurchased = false;
    if ($user) {
        $hasPurchased = $project->purchases()->where('user_id', $user->id)->exists();
    }

    $isOwner = $user && $project->user_id === $user->id;
    $isTeamMember = $project->team_id && $user && 
                    $user->teams()->where('teams.id', $project->team_id)->exists();

    $isRestricted = false;
    $accessRequestStatus = null;
    
    if (!$project->is_public && !$isOwner && !$isTeamMember && !$hasPurchased) {
        $isRestricted = true;
        
        if ($user) {
            $accessRequest = \App\Models\ProjectAccessRequest::where('project_id', $project->id)
                ->where('user_id', $user->id)
                ->first();
                
            if ($accessRequest) {
                $accessRequestStatus = $accessRequest->status;
                if ($accessRequestStatus === 'approved') {
                    $isRestricted = false;
                }
            }
        }
    }

    $project->has_purchased = $hasPurchased;
    $project->is_restricted = $isRestricted;
    $project->access_request_status = $accessRequestStatus;

    $project->makeVisible(['code', 'settings']);

    if (!empty($project->github_repo_url)) {
        return Inertia::render('MarketplaceProduct', [
            'project' => $project,
            'canEdit' => $isOwner || $isTeamMember || $hasPurchased
        ]);
    }

    return Inertia::render('ProjectView', [
        'project' => $project,
        'canEdit' => $isOwner || $isTeamMember || $hasPurchased
    ]);
})->name('project.show');

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

    Route::get('/admin/features', [\App\Http\Controllers\Admin\FeatureManagementController::class, 'index'])->name('admin.features');
    Route::post('/admin/features', [\App\Http\Controllers\Admin\FeatureManagementController::class, 'update'])->name('admin.features.update');
    
    Route::get('/admin/ads', [\App\Http\Controllers\Admin\AdsController::class, 'index'])->name('admin.ads');
    Route::post('/admin/ads/settings', [\App\Http\Controllers\Admin\AdsController::class, 'settings'])->name('admin.ads.settings');
    Route::post('/admin/ads', [\App\Http\Controllers\Admin\AdsController::class, 'store'])->name('admin.ads.store');
    Route::put('/admin/ads/{ad}', [\App\Http\Controllers\Admin\AdsController::class, 'update'])->name('admin.ads.update');
    Route::delete('/admin/ads/{ad}', [\App\Http\Controllers\Admin\AdsController::class, 'destroy'])->name('admin.ads.destroy');

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

    // Sales Management
    Route::get('/admin/sales', [\App\Http\Controllers\Admin\SalesController::class, 'index'])->name('admin.sales.index');
    Route::get('/admin/sales/paid-projects', [\App\Http\Controllers\Admin\SalesController::class, 'paidProjects'])->name('admin.sales.paid-projects');
    Route::get('/admin/payouts', [\App\Http\Controllers\Admin\PayoutController::class, 'index'])->name('admin.payouts.index');
    Route::post('/admin/payouts/settings', [\App\Http\Controllers\Admin\PayoutController::class, 'updateSettings'])->name('admin.payouts.settings');
    Route::post('/admin/payouts/{payout}/mark-paid', [\App\Http\Controllers\Admin\PayoutController::class, 'markAsPaid'])->name('admin.payouts.mark-paid');

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

    // Project Purchases
    Route::get('/checkout/project/{project:slug}', [\App\Http\Controllers\PurchaseController::class, 'checkoutPage'])->name('checkout.project')->middleware('throttle:10,1');
    Route::get('/purchase/status', [\App\Http\Controllers\PurchaseController::class, 'statusPage'])->name('purchase.status');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/my-account', function (\Illuminate\Http\Request $request) {
        return Inertia::render('MyAccount', [
            'mustVerifyEmail' => $request->user() instanceof \Illuminate\Contracts\Auth\MustVerifyEmail,
            'status' => session('status'),
        ]);
    })->name('my-account');

    Route::get('/sell', function () {
        return Inertia::render('Vendor/Sell');
    })->name('vendor.sell');

    Route::get('/vendor/dashboard', function () {
        return Inertia::render('Vendor/Dashboard');
    })->name('vendor.dashboard');

    Route::get('/vendor/payments', function () {
        $user = auth()->user();
        
        $sales = \App\Models\Purchase::whereHas('project', function($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with(['project', 'user' => function($q) { $q->select('id', 'name'); }])
            ->where('status', 'completed')
            ->orderBy('created_at', 'desc')
            ->get();
            
        $totalEarnings = $sales->sum('amount') * 0.70;

        return Inertia::render('Vendor/Payments', [
            'sales' => $sales,
            'totalEarnings' => $totalEarnings
        ]);
    })->name('vendor.payments');

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
    
    // Notifications
    Route::get('/api/notifications', [\App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::put('/api/notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::put('/api/notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'markAllRead'])->name('notifications.read-all');
});

Route::get('/p/{slug}', function ($slug) {
    $page = \App\Models\Page::where('slug', $slug)->where('is_published', true)->firstOrFail();
    return Inertia::render('Page', [
        'page' => $page
    ]);
})->name('pages.show');

// Production Installer (Setup) Routes
Route::post('/ads/{ad}/impression', [\App\Http\Controllers\Admin\AdsController::class, 'logImpression'])->name('ads.impression');
Route::get('/setup', [\App\Http\Controllers\SetupController::class, 'index'])->name('setup.index');
Route::post('/setup/run', [\App\Http\Controllers\SetupController::class, 'run'])->name('setup.run');
Route::post('/setup/save-env', [\App\Http\Controllers\SetupController::class, 'saveEnv'])->name('setup.save-env');
Route::post('/setup/check-db', [\App\Http\Controllers\SetupController::class, 'checkDb'])->name('setup.check-db');
Route::post('/setup/create-admin', [\App\Http\Controllers\SetupController::class, 'createAdmin'])->name('setup.create-admin');
Route::post('/setup/finish', [\App\Http\Controllers\SetupController::class, 'finish'])->name('setup.finish');

require __DIR__.'/auth.php';
