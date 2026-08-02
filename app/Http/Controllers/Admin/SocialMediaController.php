<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SiteSetting;
use App\Models\SocialMediaLog;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;

class SocialMediaController extends Controller
{
    public function index()
    {
        $settings = SiteSetting::where('group', 'social_media')->pluck('value', 'key')->toArray();
        $logs = SocialMediaLog::with('project:id,title')->latest()->take(50)->get();
        
        return Inertia::render('Admin/SocialMedia/Settings', [
            'settings' => $settings,
            'logs' => $logs
        ]);
    }

    public function logs()
    {
        $logs = \App\Models\SocialMediaLog::with('project:id,title')
            ->orderBy('created_at', 'desc')
            ->paginate(15);
            
        return Inertia::render('Admin/SocialMedia/Logs', [
            'logs' => $logs
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'telegram_enabled' => 'boolean',
            'telegram_bot_token' => 'nullable|string',
            'telegram_chat_id' => 'nullable|string',
            'telegram_admin_id' => 'nullable|string',
            'telegram_api_proxy' => 'nullable|string',
            'telegram_webhook_secret' => 'nullable|string',
            'telegram_manual_webhook' => 'nullable|string',
            'telegram_post_template' => 'nullable|string',
            'telegram_custom_template' => 'nullable|string',
            'whatsapp_enabled' => 'boolean',
            'whatsapp_access_token' => 'nullable|string',
            'whatsapp_phone_id' => 'nullable|string',
            'whatsapp_group_id' => 'nullable|string',
            'whatsapp_webhook_secret' => 'nullable|string',
            'whatsapp_manual_webhook' => 'nullable|string',
            'whatsapp_post_template' => 'nullable|string',
            'whatsapp_custom_template' => 'nullable|string',
        ]);

        foreach ($validated as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $key, 'group' => 'social_media'],
                ['value' => $value ?? '', 'type' => is_bool($value) ? 'boolean' : 'string']
            );
        }

        return back()->with('success', 'Social Media Auto-Post settings updated successfully.');
    }

    public function testTelegram(Request $request)
    {
        $botToken = $request->telegram_bot_token;
        $chatId = $request->telegram_chat_id;

        if (!$botToken || !$chatId) {
            return back()->with('error', 'Please provide both Bot Token and Chat ID to test.');
        }

        try {
            $response = Http::post("https://api.telegram.org/bot{$botToken}/sendMessage", [
                'chat_id' => $chatId,
                'text' => '✅ *Connection Test Successful!*\n\nYour HelpOfAi CodeLab system is successfully connected to this Telegram chat.',
                'parse_mode' => 'Markdown',
            ]);

            if ($response->successful()) {
                SocialMediaLog::create(['platform' => 'telegram', 'status' => 'success', 'error_message' => 'Connection Test Successful']);
                return back()->with('success', 'Telegram Test Message Sent Successfully!');
            }
            
            SocialMediaLog::create(['platform' => 'telegram', 'status' => 'failed', 'error_message' => $response->body()]);
            return back()->with('error', 'Telegram Test Failed: ' . $response->json('description') ?? 'Unknown error');
        } catch (\Exception $e) {
            SocialMediaLog::create(['platform' => 'telegram', 'status' => 'failed', 'error_message' => $e->getMessage()]);
            return back()->with('error', 'Connection failed: ' . $e->getMessage());
        }
    }

    public function testWhatsapp(Request $request)
    {
        $token = $request->whatsapp_access_token;
        $phoneId = $request->whatsapp_phone_id;
        $groupId = $request->whatsapp_group_id;

        if (!$token || !$phoneId || !$groupId) {
            return back()->with('error', 'Please provide all WhatsApp credentials to test.');
        }

        try {
            $response = Http::withToken($token)->post("https://graph.facebook.com/v17.0/{$phoneId}/messages", [
                'messaging_product' => 'whatsapp',
                'to' => $groupId,
                'type' => 'text',
                'text' => [
                    'body' => '✅ *Connection Test Successful!*\n\nYour HelpOfAi CodeLab system is successfully connected to WhatsApp.',
                ],
            ]);

            if ($response->successful()) {
                SocialMediaLog::create(['platform' => 'whatsapp', 'status' => 'success', 'error_message' => 'Connection Test Successful']);
                return back()->with('success', 'WhatsApp Test Message Sent Successfully!');
            }

            SocialMediaLog::create(['platform' => 'whatsapp', 'status' => 'failed', 'error_message' => $response->body()]);
            return back()->with('error', 'WhatsApp Test Failed: ' . $response->json('error.message') ?? 'Unknown error');
        } catch (\Exception $e) {
            SocialMediaLog::create(['platform' => 'whatsapp', 'status' => 'failed', 'error_message' => $e->getMessage()]);
            return back()->with('error', 'Connection failed: ' . $e->getMessage());
        }
    }
}
