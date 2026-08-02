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

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PurchaseReceiptNotification extends Notification
{
    use Queueable;

    protected $purchase;
    protected $project;
    protected $license;

    /**
     * Create a new notification instance.
     */
    public function __construct($purchase, $project, $license)
    {
        $this->purchase = $purchase;
        $this->project = $project;
        $this->license = $license;
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
        // Generate PDF Invoice on the fly
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.invoice', [
            'purchase' => $this->purchase,
            'project' => $this->project,
            'license' => $this->license,
            'buyer' => $notifiable
        ]);

        return (new MailMessage)
                    ->subject('Your Purchase Receipt & License Key')
                    ->greeting('Hello ' . $notifiable->name . ',')
                    ->line('Thank you for purchasing ' . $this->project->title . '!')
                    ->line('Your official invoice and license key are attached to this email.')
                    ->line('License Key: ' . $this->license->license_key)
                    ->action('View My Purchases', url('/my-purchases'))
                    ->line('Happy coding!')
                    ->attachData($pdf->output(), 'invoice_' . $this->purchase->payment_id . '.pdf', [
                        'mime' => 'application/pdf',
                    ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'purchase_receipt',
            'title' => 'Purchase Successful',
            'message' => 'You purchased ' . $this->project->title,
            'action_url' => '/my-purchases',
        ];
    }
}
