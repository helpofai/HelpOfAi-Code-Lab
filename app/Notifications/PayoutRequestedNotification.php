<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PayoutRequestedNotification extends Notification
{
    use Queueable;

    protected $payout;

    /**
     * Create a new notification instance.
     */
    public function __construct($payout)
    {
        $this->payout = $payout;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('New Payout Request')
                    ->greeting('Hello Admin,')
                    ->line('A vendor has requested a withdrawal.')
                    ->line('Vendor: ' . $this->payout->user->name)
                    ->line('Amount: $' . number_format($this->payout->amount, 2))
                    ->action('Review Request', url('/admin/payouts'))
                    ->line('Please review and process this payout.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'payout_request',
            'title' => 'New Payout Request',
            'message' => $this->payout->user->name . ' requested $' . number_format($this->payout->amount, 2),
            'action_url' => '/admin/payouts',
        ];
    }
}
