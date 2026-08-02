<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Bus\Dispatchable;
use App\Models\User;
use App\Models\EmailTemplate;
use App\Models\EmailLog;
use App\Mail\DynamicEmail;
use Illuminate\Support\Facades\Mail;

class SendBroadcastEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $user;
    public $template;
    public $type;

    /**
     * Create a new job instance.
     */
    public function __construct(User $user, EmailTemplate $template, string $type)
    {
        $this->user = $user;
        $this->template = $template;
        $this->type = $type;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $content = str_replace(
            ['{{name}}', '{{email}}'], 
            [$this->user->name, $this->user->email], 
            $this->template->content
        );

        if (isset($this->user->unsubscribe_link)) {
            $content .= '<br><br><div style="text-align:center;font-size:12px;color:#888;">'
                      . 'You are receiving this email because you subscribed on our website. '
                      . '<a href="' . $this->user->unsubscribe_link . '" style="color:#a855f7;text-decoration:underline;">Unsubscribe here</a>'
                      . '</div>';
        }

        try {
            Mail::to($this->user->email)->send(new DynamicEmail($this->template->subject, $content));
            
            EmailLog::create([
                'recipient' => $this->user->email,
                'subject' => $this->template->subject,
                'content' => $content,
                'status' => 'sent',
                'type' => $this->type,
                'user_id' => $this->user->id,
                'template_id' => $this->template->id,
            ]);
        } catch (\Exception $e) {
            EmailLog::create([
                'recipient' => $this->user->email,
                'subject' => $this->template->subject,
                'content' => $content,
                'status' => 'failed',
                'error' => $e->getMessage(),
                'type' => $this->type,
                'user_id' => $this->user->id,
                'template_id' => $this->template->id,
            ]);
        }
    }
}
