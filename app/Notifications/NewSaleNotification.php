<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewSaleNotification extends Notification
{
    use Queueable;

    protected $purchase;
    protected $project;

    /**
     * Create a new notification instance.
     */
    public function __construct($purchase, $project)
    {
        $this->purchase = $purchase;
        $this->project = $project;
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
        $vendorShare = $this->project->price * 0.70;
        return (new MailMessage)
                    ->subject('You made a sale! 🎉')
                    ->greeting('Hello ' . $notifiable->name . '!')
                    ->line('Someone just purchased your project: ' . $this->project->title)
                    ->line('Your earnings for this sale: $' . number_format($vendorShare, 2))
                    ->action('View Sales Dashboard', url('/vendor/sales'))
                    ->line('Keep up the great work!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'sale',
            'title' => 'New Sale: ' . $this->project->title,
            'message' => 'You earned $' . number_format($this->project->price * 0.70, 2),
            'action_url' => '/vendor/sales',
        ];
    }
}
