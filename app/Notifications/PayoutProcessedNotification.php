<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PayoutProcessedNotification extends Notification
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
                    ->subject('Your Payout Has Been Processed')
                    ->greeting('Hello ' . $notifiable->name . ',')
                    ->line('Good news! Your withdrawal request for $' . number_format($this->payout->amount, 2) . ' has been processed.')
                    ->line('Admin Notes: ' . ($this->payout->admin_notes ?: 'None'))
                    ->line('Reference ID: ' . ($this->payout->reference_id ?: 'N/A'))
                    ->action('View Wallet', url('/vendor/payments'))
                    ->line('Thank you for selling with us!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'payout_processed',
            'title' => 'Payout Processed',
            'message' => 'Your $' . number_format($this->payout->amount, 2) . ' withdrawal is complete.',
            'action_url' => '/vendor/payments',
        ];
    }
}
