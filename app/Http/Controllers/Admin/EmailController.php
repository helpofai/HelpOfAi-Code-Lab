<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EmailTemplate;
use App\Models\User;
use App\Models\EmailLog;
use App\Mail\DynamicEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

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
            ]
        ]);
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
            'recipient_type' => 'required|in:all,pro,admins,specific',
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
            case 'specific':
                $user = User::where('email', $validated['specific_email'])->first();
                if ($user) $users->push($user);
                break;
        }

        $count = 0;
        $failed = 0;
        foreach ($users as $user) {
            $content = str_replace(
                ['{{name}}', '{{email}}'], 
                [$user->name, $user->email], 
                $template->content
            );

            try {
                Mail::to($user->email)->send(new DynamicEmail($template->subject, $content));
                
                EmailLog::create([
                    'recipient' => $user->email,
                    'subject' => $template->subject,
                    'content' => $content,
                    'status' => 'sent',
                    'type' => $validated['recipient_type'] === 'specific' ? 'individual' : 'broadcast',
                    'user_id' => $user->id,
                    'template_id' => $template->id,
                ]);

                $count++;
            } catch (\Exception $e) {
                EmailLog::create([
                    'recipient' => $user->email,
                    'subject' => $template->subject,
                    'content' => $content,
                    'status' => 'failed',
                    'error' => $e->getMessage(),
                    'type' => $validated['recipient_type'] === 'specific' ? 'individual' : 'broadcast',
                    'user_id' => $user->id,
                    'template_id' => $template->id,
                ]);
                $failed++;
            }
        }

        return back()->with('success', "Email protocol completed. Sent: $count | Failed: $failed");
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
