<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Project;
use App\Models\SiteSetting;
use App\Models\SocialMediaLog;

class SendProjectToSocialMediaJob implements ShouldQueue
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
        $settings = SiteSetting::where('group', 'social_media')->pluck('value', 'key')->toArray();

        if (isset($settings['telegram_enabled']) && $settings['telegram_enabled'] == '1') {
            $this->postToTelegram($settings);
        }

        if (isset($settings['whatsapp_enabled']) && $settings['whatsapp_enabled'] == '1') {
            $this->postToWhatsApp($settings);
        }
    }

    private function postToTelegram($settings)
    {
        $botToken = $settings['telegram_bot_token'] ?? null;
        $chatId = $settings['telegram_chat_id'] ?? null;

        if (!$botToken || !$chatId) return;

        $projectUrl = url('/editor/' . $this->project->slug);
        
        $type = $this->project->github_repo_url ? 'GitHub Repository' : 'Code Snippet (HTML/CSS/JS)';
        $pricing = $this->project->is_for_sale ? "Paid (\${$this->project->price})" : "Free";

        $caption = "🚀 *New Project Published!*\n\n"
                 . "📌 *Title:* {$this->project->title}\n"
                 . "📦 *Type:* {$type}\n"
                 . "💰 *Pricing:* {$pricing}\n\n"
                 . "Explore the code and learn how it was built! 👇";

        $keyboard = [
            'inline_keyboard' => [
                [
                    ['text' => '🔍 View Project', 'url' => $projectUrl]
                ]
            ]
        ];

        if ($this->project->is_for_sale) {
            $keyboard['inline_keyboard'][0][] = ['text' => '💳 Buy Now', 'url' => $projectUrl . '#buy'];
        }

        // Thumbnail resolution: If HTML/CSS/JS we assume they can pass a live view screenshot URL
        // or we use a default placeholder. For Git, we use the uploaded thumbnail.
        $thumbnailUrl = $this->project->thumbnail ?? url('/images/default-project-thumbnail.png');

        try {
            $response = Http::post("https://api.telegram.org/bot{$botToken}/sendPhoto", [
                'chat_id' => $chatId,
                'photo' => $thumbnailUrl,
                'caption' => $caption,
                'parse_mode' => 'Markdown',
                'reply_markup' => json_encode($keyboard),
            ]);

            if ($response->successful()) {
                SocialMediaLog::create(['platform' => 'telegram', 'project_id' => $this->project->id, 'status' => 'success', 'error_message' => 'Auto-post successful']);
            } else {
                SocialMediaLog::create(['platform' => 'telegram', 'project_id' => $this->project->id, 'status' => 'failed', 'error_message' => $response->body()]);
            }
        } catch (\Exception $e) {
            SocialMediaLog::create(['platform' => 'telegram', 'project_id' => $this->project->id, 'status' => 'failed', 'error_message' => $e->getMessage()]);
            Log::error('Telegram Auto-Post Failed: ' . $e->getMessage());
        }
    }

    private function postToWhatsApp($settings)
    {
        $token = $settings['whatsapp_access_token'] ?? null;
        $phoneId = $settings['whatsapp_phone_id'] ?? null;
        $recipientGroup = $settings['whatsapp_group_id'] ?? null;

        if (!$token || !$phoneId || !$recipientGroup) return;

        $projectUrl = url('/editor/' . $this->project->slug);
        
        $type = $this->project->github_repo_url ? 'GitHub Repository' : 'Code Snippet (HTML/CSS/JS)';
        $pricing = $this->project->is_for_sale ? "Paid (\${$this->project->price})" : "Free";

        $message = "🚀 *New Project Published!*\n\n"
                 . "📌 *Title:* {$this->project->title}\n"
                 . "📦 *Type:* {$type}\n"
                 . "💰 *Pricing:* {$pricing}\n\n"
                 . "🔍 View Project: {$projectUrl}";

        try {
            $response = Http::withToken($token)->post("https://graph.facebook.com/v17.0/{$phoneId}/messages", [
                'messaging_product' => 'whatsapp',
                'to' => $recipientGroup,
                'type' => 'text',
                'text' => [
                    'preview_url' => true,
                    'body' => $message,
                ],
            ]);

            if ($response->successful()) {
                SocialMediaLog::create(['platform' => 'whatsapp', 'project_id' => $this->project->id, 'status' => 'success', 'error_message' => 'Auto-post successful']);
            } else {
                SocialMediaLog::create(['platform' => 'whatsapp', 'project_id' => $this->project->id, 'status' => 'failed', 'error_message' => $response->body()]);
            }
        } catch (\Exception $e) {
            SocialMediaLog::create(['platform' => 'whatsapp', 'project_id' => $this->project->id, 'status' => 'failed', 'error_message' => $e->getMessage()]);
            Log::error('WhatsApp Auto-Post Failed: ' . $e->getMessage());
        }
    }
}
