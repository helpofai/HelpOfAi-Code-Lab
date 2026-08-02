<?php

/*
|--------------------------------------------------------------------------
| HelpOfAi (HOA) Professional Software
|--------------------------------------------------------------------------
|
| Copyright (c) 2026 Rajib Adhikary. All Rights Reserved.
|
| This file is part of the HelpOfAi Professional Software Suite.
| Unauthorized copying, modification, redistribution, reverse engineering,
| decompilation, or commercial use of this source code, in whole or in part,
| is strictly prohibited without prior written permission from the copyright owner.
|
| Author      : Rajib Adhikary
| Organization: HelpOfAi (HOA)
| Website     : https://helpofai.com
| Location    : Basta Purba Para, Aranghata, Nadia, West Bengal, India
|
| This source code contains proprietary and confidential information.
| Any unauthorized access or distribution may violate applicable copyright laws.
|
|--------------------------------------------------------------------------
*/

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Project;
use App\Http\Controllers\Admin\AdUnitController;
use App\Http\Controllers\Admin\SocialMediaController;
use App\Http\Controllers\Admin\QueueMonitorController;
use App\Http\Controllers\Vendors\OnboardingController;
use App\Http\Controllers\Admin\FrontManagementController;
use App\Models\SiteSetting;
use App\Http\Controllers\NewsletterSubscriberController;

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

Route::get('/explore', function () {
    return Inertia::render('Explore');
})->name('explore');

// Public Directory Routes
Route::get('/search', [\App\Http\Controllers\PublicDirectoryController::class, 'search'])->name('public.search');
Route::get('/categories', [\App\Http\Controllers\PublicDirectoryController::class, 'categories'])->name('public.categories.index');
Route::get('/categories/{slug}', [\App\Http\Controllers\PublicDirectoryController::class, 'categoryShow'])->name('public.categories.show');
Route::get('/tags', [\App\Http\Controllers\PublicDirectoryController::class, 'tags'])->name('public.tags.index');
Route::get('/tags/{slug}', [\App\Http\Controllers\PublicDirectoryController::class, 'tagShow'])->name('public.tags.show');

// Newsletter Route
Route::post('/subscribe', [NewsletterSubscriberController::class, 'store'])->middleware('throttle:5,1')->name('newsletter.subscribe');
Route::get('/unsubscribe/{token}', [NewsletterSubscriberController::class, 'unsubscribe'])->middleware('throttle:10,1')->name('newsletter.unsubscribe');

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
    $project = Project::with(['user', 'team', 'reviews.user'])->where('slug', $slug)->firstOrFail();
    $project->append(['average_rating', 'reviews_count']);
    
    // Unique IP-based View Tracking
    $viewKey = 'project_viewed_' . $project->id . '_' . request()->ip();
    if (!\Illuminate\Support\Facades\Cache::has($viewKey)) {
        $project->increment('views');
        \Illuminate\Support\Facades\Cache::put($viewKey, true, now()->addHours(24)); // Lock IP for 24h
        
        if ($project->user) {
            app(\App\Services\VendorLevelService::class)->evaluate($project->user);
        }
    }

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

    // If it's a marketplace product OR has a github repo, show the product sales page
    if ($project->is_for_sale || !empty($project->github_repo_url)) {
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

Route::middleware(['auth', 'verified', \App\Http\Middleware\CheckVendorOnboarding::class])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/dashboard/my-projects', function () {
        return Inertia::render('MyProjects');
    })->name('my-projects');
});

// Vendor Onboarding Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/onboarding', [OnboardingController::class, 'index'])->name('vendor.onboarding.index');
    Route::post('/onboarding', [OnboardingController::class, 'store'])->name('vendor.onboarding.store');
    Route::post('/onboarding/skip', [OnboardingController::class, 'skip'])->name('vendor.onboarding.skip');
});



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
    Route::delete('/admin/email/subscriber/{id}', [\App\Http\Controllers\Admin\EmailController::class, 'destroySubscriber'])->name('admin.email.subscriber.destroy');
    Route::post('/admin/email/resend/{log}', [\App\Http\Controllers\Admin\EmailController::class, 'resend'])->name('admin.email.resend');
    Route::get('/admin/email/settings', [\App\Http\Controllers\Admin\EmailController::class, 'settings'])->name('admin.email.settings');
    Route::post('/admin/email/settings', [\App\Http\Controllers\Admin\EmailController::class, 'updateSettings'])->name('admin.email.settings.update');
    Route::post('/admin/email/test', [\App\Http\Controllers\Admin\EmailController::class, 'testConnection'])->name('admin.email.test');
    // Social Media Management
    Route::get('/admin/social-media', [\App\Http\Controllers\Admin\SocialMediaController::class, 'index'])->name('admin.social-media.settings');
    Route::post('/admin/social-media', [\App\Http\Controllers\Admin\SocialMediaController::class, 'update'])->name('admin.social-media.update');
    Route::post('/admin/social-media/test-telegram', [\App\Http\Controllers\Admin\SocialMediaController::class, 'testTelegram'])->name('admin.social-media.test-telegram');
    Route::post('/admin/social-media/test-whatsapp', [\App\Http\Controllers\Admin\SocialMediaController::class, 'testWhatsapp'])->name('admin.social-media.test-whatsapp');
    Route::get('/admin/social-media/logs', [\App\Http\Controllers\Admin\SocialMediaController::class, 'logs'])->name('admin.social-media.logs');

    // Queue Monitor
    Route::get('/admin/queue', [\App\Http\Controllers\Admin\QueueMonitorController::class, 'index'])->name('admin.queue.index');
    Route::post('/admin/queue/retry/{id}', [\App\Http\Controllers\Admin\QueueMonitorController::class, 'retry'])->name('admin.queue.retry');

    // Security & Firewall
    Route::get('/admin/security', [\App\Http\Controllers\Admin\SecurityController::class, 'index'])->name('admin.security.index');
    Route::post('/admin/security', [\App\Http\Controllers\Admin\SecurityController::class, 'update'])->name('admin.security.update');
    Route::post('/admin/security/ban', [\App\Http\Controllers\Admin\SecurityController::class, 'ban'])->name('admin.security.ban');
    Route::delete('/admin/security/unban/{bannedIp}', [\App\Http\Controllers\Admin\SecurityController::class, 'unban'])->name('admin.security.unban');
    Route::delete('/admin/queue/delete/{id}', [\App\Http\Controllers\Admin\QueueMonitorController::class, 'deleteFailed'])->name('admin.queue.delete');
    Route::delete('/admin/queue/clear-pending', [\App\Http\Controllers\Admin\QueueMonitorController::class, 'clearPending'])->name('admin.queue.clear-pending');
    Route::post('/admin/queue/process', [\App\Http\Controllers\Admin\QueueMonitorController::class, 'processQueue'])->name('admin.queue.process');

    Route::resource('admin/email', \App\Http\Controllers\Admin\EmailController::class, ['names' => 'admin.email']);
});

Route::middleware('auth')->group(function () {
    Route::get('/support', [\App\Http\Controllers\SupportController::class, 'index'])->name('support.index');
    Route::post('/support', [\App\Http\Controllers\SupportController::class, 'store'])->name('support.store');
    Route::get('/support/{ticket}', [\App\Http\Controllers\SupportController::class, 'show'])->name('support.show');
    Route::post('/support/{ticket}/reply', [\App\Http\Controllers\SupportController::class, 'reply'])->name('support.reply');

    // Project Purchases
    Route::post('/projects/{project:slug}/review', [\App\Http\Controllers\ReviewController::class, 'store'])->name('reviews.store');
    Route::get('/checkout/project/{project:slug}', [\App\Http\Controllers\PurchaseController::class, 'checkoutPage'])->name('checkout.project')->middleware('throttle:10,1');
    Route::get('/purchase/status', [\App\Http\Controllers\PurchaseController::class, 'statusPage'])->name('purchase.status');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/my-account', function (\Illuminate\Http\Request $request) {
        return Inertia::render('MyAccount', [
            'mustVerifyEmail' => $request->user() instanceof \Illuminate\Contracts\Auth\MustVerifyEmail,
            'status' => session('status'),
            'tokens' => $request->user()->tokens,
        ]);
    })->name('my-account');

    Route::post('/my-account/token', function (\Illuminate\Http\Request $request) {
        $token = $request->user()->createToken('Personal Access Token');
        return response()->json([
            'token' => $token->plainTextToken,
            'tokenData' => clone $token->accessToken
        ]);
    })->name('my-account.token.store');

    Route::delete('/my-account/token/{id}', function (\Illuminate\Http\Request $request, $id) {
        $request->user()->tokens()->where('id', $id)->delete();
        return response()->json(['message' => 'Token deleted successfully']);
    })->name('my-account.token.destroy');

    Route::get('/vendors/sell', function () {
        return Inertia::render('Vendors/Sell');
    })->name('vendors.sell');

    Route::get('/vendors/projects', function () {
        return Inertia::render('Vendors/Projects');
    })->name('vendors.projects');

    Route::get('/vendors/payments', function () {
        $user = auth()->user();
        
        $sales = \App\Models\Purchase::whereHas('project', function($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with(['project', 'user' => function($q) { $q->select('id', 'name'); }])
            ->where('status', 'completed')
            ->orderBy('created_at', 'desc')
            ->get();
            
        $totalEarnings = $sales->sum('amount') * 0.70;

        return Inertia::render('Vendors/Payments', [
            'sales' => $sales,
            'totalEarnings' => $totalEarnings
        ]);
    })->name('vendors.payments');

    Route::get('/vendors/sdk-integration', function () {
        return Inertia::render('Vendors/SdkIntegration');
    })->name('vendors.sdk-integration');

    Route::get('/vendors/dashboard', function () {
        $user = auth()->user();
        
        $sales = \App\Models\Purchase::whereHas('project', function($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with(['project', 'user' => function($q) { $q->select('id', 'name'); }])
            ->where('status', 'completed')
            ->orderBy('created_at', 'desc')
            ->get();
            
        $totalEarnings = $sales->sum('amount') * 0.70;
        $totalSales = $sales->count();
        $projectCount = \App\Models\Project::where('user_id', $user->id)->count();
        
        // Group for Recharts (last 7 days)
        $chartData = collect([]);
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $daySales = $sales->filter(function($s) use ($date) {
                return $s->created_at->format('Y-m-d') === $date;
            });
            $chartData->push([
                'date' => now()->subDays($i)->format('M d'),
                'amount' => $daySales->sum('amount') * 0.70
            ]);
        }

        return Inertia::render('Vendors/Dashboard', [
            'totalEarnings' => $totalEarnings,
            'totalSales' => $totalSales,
            'projectCount' => $projectCount,
            'recentSales' => $chartData,
        ]);
    })->name('vendors.dashboard');

    Route::get('/vendors/payments', function () {
        $user = auth()->user();
        
        $sales = \App\Models\Purchase::whereHas('project', function($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with(['project', 'user' => function($q) { $q->select('id', 'name'); }])
            ->where('status', 'completed')
            ->orderBy('created_at', 'desc')
            ->get();
            
        $totalEarnings = $sales->sum('amount') * 0.70;

        return Inertia::render('Vendors/Payments', [
            'sales' => $sales,
            'totalEarnings' => $totalEarnings
        ]);
    })->name('vendors.payments');

    Route::get('/vendors/settings', function () {
        return Inertia::render('Vendors/Settings');
    })->name('vendors.settings');

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
    
    // Invoices
    Route::get('/api/purchases/{id}/invoice', [\App\Http\Controllers\Api\InvoiceController::class, 'show'])->name('purchases.invoice');
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


// Public Vendor Profile
Route::get('/@{username}', [\App\Http\Controllers\VendorProfileController::class, 'show'])->name('vendor.profile');

// SEO Sitemap
Route::get('/sitemap.xml', [\App\Http\Controllers\SitemapController::class, 'index']);

// IndexNow Verification
Route::get('/{key}.txt', function ($key) {
    $expectedKey = substr(md5(config('app.key')), 0, 32);
    if ($key === $expectedKey) {
        return response($key, 200)->header('Content-Type', 'text/plain');
    }
    abort(404);
});

require __DIR__.'/auth.php';
