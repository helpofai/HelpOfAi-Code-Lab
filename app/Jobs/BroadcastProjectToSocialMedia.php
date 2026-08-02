<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

use App\Models\Project;
use App\Models\SiteSetting;
use App\Models\SocialMediaLog;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BroadcastProjectToSocialMedia implements ShouldQueue
{
    use Queueable;

    public $project;

    /**
     * Create a new job instance.
     */
    public function __construct(Project $project)
    {
        $this->project = $project;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $settings = SiteSetting::where('group', 'social_media')->pluck('value', 'key');
        
        if ($settings->get('telegram_enabled') === '1' || $settings->get('telegram_enabled') === true) {
            $this->sendTelegram($settings);
        }

        if ($settings->get('whatsapp_enabled') === '1' || $settings->get('whatsapp_enabled') === true) {
            $this->sendWhatsApp($settings);
        }
    }

    private function parseTemplate($template)
    {
        if (!$template) return "New Project: " . $this->project->title;

        $search = ['{title}', '{description}', '{price}', '{link}'];
        $replace = [
            $this->project->title,
            \Illuminate\Support\Str::limit(strip_tags($this->project->description), 100),
            $this->project->price > 0 ? '$' . number_format($this->project->price, 2) : 'Free',
            route('project.show', $this->project->slug ?? $this->project->id)
        ];

        return str_replace($search, $replace, $template);
    }

    private function sendTelegram($settings)
    {
        $token = $settings->get('telegram_bot_token');
        $chatId = $settings->get('telegram_chat_id');
        
        if (!$token || !$chatId) return;

        $template = $settings->get('telegram_custom_template');
        $message = $this->parseTemplate($template);

        try {
            $apiUrl = "https://api.telegram.org/bot{$token}/sendMessage";
            
            // Use proxy if provided
            $proxy = $settings->get('telegram_api_proxy');
            if ($proxy) {
                $apiUrl = rtrim($proxy, '/') . "/bot{$token}/sendMessage";
            }

            $response = Http::post($apiUrl, [
                'chat_id' => $chatId,
                'text' => $message,
                'parse_mode' => 'Markdown'
            ]);

            SocialMediaLog::create([
                'platform' => 'telegram',
                'project_id' => $this->project->id,
                'status' => $response->successful() ? 'success' : 'failed',
                'error_message' => $response->successful() ? null : $response->body()
            ]);
        } catch (\Exception $e) {
            Log::error("Telegram Broadcast Error: " . $e->getMessage());
            SocialMediaLog::create([
                'platform' => 'telegram',
                'project_id' => $this->project->id,
                'status' => 'failed',
                'error_message' => $e->getMessage()
            ]);
        }
    }

    private function sendWhatsApp($settings)
    {
        $token = $settings->get('whatsapp_access_token');
        $phoneId = $settings->get('whatsapp_phone_id');
        $recipientId = $settings->get('whatsapp_group_id');
        
        if (!$token || !$phoneId || !$recipientId) return;

        $template = $settings->get('whatsapp_custom_template');
        $message = $this->parseTemplate($template);

        try {
            $url = "https://graph.facebook.com/v17.0/{$phoneId}/messages";
            
            $response = Http::withToken($token)->post($url, [
                'messaging_product' => 'whatsapp',
                'recipient_type' => 'individual',
                'to' => $recipientId,
                'type' => 'text',
                'text' => [
                    'preview_url' => true,
                    'body' => $message
                ]
            ]);

            SocialMediaLog::create([
                'platform' => 'whatsapp',
                'project_id' => $this->project->id,
                'status' => $response->successful() ? 'success' : 'failed',
                'error_message' => $response->successful() ? null : $response->body()
            ]);
        } catch (\Exception $e) {
            Log::error("WhatsApp Broadcast Error: " . $e->getMessage());
            SocialMediaLog::create([
                'platform' => 'whatsapp',
                'project_id' => $this->project->id,
                'status' => 'failed',
                'error_message' => $e->getMessage()
            ]);
        }
    }
}
