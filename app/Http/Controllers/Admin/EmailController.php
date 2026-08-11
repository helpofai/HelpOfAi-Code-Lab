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

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EmailTemplate;
use App\Models\User;
use App\Models\EmailLog;
use App\Mail\DynamicEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use App\Jobs\SendBroadcastEmailJob;
use App\Models\NewsletterSubscriber;

use App\Models\SiteSetting;

class EmailController extends Controller
{
    /**
     * Display a listing of email templates.
     */
    public function index()
    {
        return Inertia::render('Admin/Email/Index', [
            'templates' => EmailTemplate::latest()->get(),
            'logs' => EmailLog::with('template')->latest()->take(50)->get(),
            'stats' => [
                'total_sent' => EmailLog::where('status', 'sent')->count(),
                'total_failed' => EmailLog::where('status', 'failed')->count(),
                'broadcasts' => EmailLog::where('type', 'broadcast')->count(),
                'subscribers' => NewsletterSubscriber::where('status', 'active')->count(),
            ],
            'subscribers' => NewsletterSubscriber::latest()->get(),
        ]);
    }

    public function destroySubscriber($id)
    {
        $sub = NewsletterSubscriber::findOrFail($id);
        $sub->delete();
        return back()->with('success', 'Subscriber deleted successfully.');
    }

    /**
     * Show the SMTP Settings page.
     */
    public function settings()
    {
        $settings = SiteSetting::where('group', 'smtp')->pluck('value', 'key');
        return Inertia::render('Admin/Email/Settings', ['settings' => $settings]);
    }

    /**
     * Update SMTP Settings.
     */
    public function updateSettings(Request $request)
    {
        $data = $request->validate([
            'mail_mailer' => 'required|string',
            'mail_host' => 'required|string',
            'mail_port' => 'required|numeric',
            'mail_username' => 'nullable|string',
            'mail_password' => 'nullable|string',
            'mail_encryption' => 'nullable|string',
            'mail_from_address' => 'required|email',
            'mail_from_name' => 'required|string',
        ]);

        foreach ($data as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value, 'group' => 'smtp', 'type' => 'text']
            );
        }

        return back()->with('success', 'SMTP settings updated.');
    }

    /**
     * Test SMTP Connection.
     */
    public function testConnection(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        // Apply settings dynamically
        $settings = SiteSetting::where('group', 'smtp')->pluck('value', 'key');
        
        config([
            'mail.default' => $settings['mail_mailer'] ?? 'smtp',
            'mail.mailers.smtp.host' => $settings['mail_host'] ?? '',
            'mail.mailers.smtp.port' => $settings['mail_port'] ?? 587,
            'mail.mailers.smtp.encryption' => $settings['mail_encryption'] ?? 'tls',
            'mail.mailers.smtp.username' => $settings['mail_username'] ?? '',
            'mail.mailers.smtp.password' => $settings['mail_password'] ?? '',
            'mail.from.address' => $settings['mail_from_address'] ?? '',
            'mail.from.name' => $settings['mail_from_name'] ?? '',
        ]);

        try {
            Mail::to($request->email)->send(new DynamicEmail('SMTP Test Connection', '<h1>Connection Successful</h1><p>Your SMTP settings are valid. This is a test email from HOACodeLab.</p>'));
            return back()->with('success', 'Test email sent successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Connection failed: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new template.
     */
    public function create()
    {
        return Inertia::render('Admin/Email/CreateEdit');
    }

    /**
     * Store a newly created template.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        EmailTemplate::create($validated);

        return redirect()->route('admin.email.index')->with('success', 'Template created successfully.');
    }

    /**
     * Show the form for editing the specified template.
     */
    public function edit(EmailTemplate $email)
    {
        return Inertia::render('Admin/Email/CreateEdit', [
            'template' => $email
        ]);
    }

    /**
     * Update the specified template.
     */
    public function update(Request $request, EmailTemplate $email)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $email->update($validated);

        return redirect()->route('admin.email.index')->with('success', 'Template updated successfully.');
    }

    /**
     * Remove the specified template.
     */
    public function destroy(EmailTemplate $email)
    {
        $email->delete();
        return back()->with('success', 'Template deleted successfully.');
    }

    /**
     * Show the Send Email interface.
     */
    public function sendPage()
    {
        return Inertia::render('Admin/Email/Send', [
            'templates' => EmailTemplate::all(),
            'userCounts' => [
                'all' => User::count(),
                'pro' => User::where('role', 'paid-user')->count(),
                'admins' => User::where('role', 'admin')->count(),
                'newsletter' => NewsletterSubscriber::count(),
            ]
        ]);
    }

    /**
     * Process sending emails.
     */
    public function send(Request $request)
    {
        $validated = $request->validate([
            'template_id' => 'required|exists:email_templates,id',
            'recipient_type' => 'required|in:all,pro,admins,newsletter,specific',
            'specific_email' => 'required_if:recipient_type,specific|nullable|email',
        ]);

        $template = EmailTemplate::find($validated['template_id']);
        $users = collect();

        switch ($validated['recipient_type']) {
            case 'all':
                $users = User::all();
                break;
            case 'pro':
                $users = User::where('role', 'paid-user')->get();
                break;
            case 'admins':
                $users = User::where('role', 'admin')->get();
                break;
            case 'newsletter':
                $subscribers = NewsletterSubscriber::where('status', 'active')->get();
                foreach ($subscribers as $sub) {
                    $fakeUser = new User();
                    $fakeUser->email = $sub->email;
                    $fakeUser->name = 'Subscriber';
                    $fakeUser->unsubscribe_link = route('newsletter.unsubscribe', ['token' => $sub->token]);
                    $users->push($fakeUser);
                }
                break;
            case 'specific':
                $user = User::where('email', $validated['specific_email'])->first();
                if ($user) $users->push($user);
                break;
        }

        $count = 0;
        $delaySeconds = 0;
        $type = $validated['recipient_type'] === 'specific' ? 'individual' : 'broadcast';

        $useQueue = SiteSetting::where('key', 'mail_use_queue')->value('value') ?? '1';

        foreach ($users as $user) {
            if ($useQueue === '1') {
                // Queue the job
                SendBroadcastEmailJob::dispatch($user, $template, $type)->delay(now()->addSeconds($delaySeconds));
                $delaySeconds += 10;
            } else {
                // Send immediately (Sync)
                try {
                    \Illuminate\Support\Facades\Mail::to($user->email)->send(new \App\Mail\DynamicEmail($template->subject, str_replace(['{{name}}', '{{email}}'], [$user->name, $user->email], $template->content)));
                    \App\Models\EmailLog::create([
                        'recipient' => $user->email,
                        'subject' => $template->subject,
                        'status' => 'sent',
                        'type' => $type,
                        'user_id' => $user->id,
                        'template_id' => $template->id,
                    ]);
                } catch (\Exception $e) {
                    \App\Models\EmailLog::create([
                        'recipient' => $user->email,
                        'subject' => $template->subject,
                        'status' => 'failed',
                        'error' => $e->getMessage(),
                        'type' => $type,
                        'user_id' => $user->id,
                        'template_id' => $template->id,
                    ]);
                }
            }
            $count++;
        }

        return back()->with('success', "Email broadcast initiated. {$count} emails queued for processing.");
    }

    /**
     * Resend a specific email from logs.
     */
    public function resend(EmailLog $log)
    {
        try {
            Mail::to($log->recipient)->send(new DynamicEmail($log->subject, $log->content));
            
            $log->update([
                'status' => 'sent',
                'error' => null,
                'created_at' => now(),
            ]);

            return back()->with('success', 'Email protocol re-initialized successfully.');
        } catch (\Exception $e) {
            $log->update([
                'status' => 'failed',
                'error' => $e->getMessage(),
            ]);
            return back()->with('error', 'Resend failed: ' . $e->getMessage());
        }
    }
}
