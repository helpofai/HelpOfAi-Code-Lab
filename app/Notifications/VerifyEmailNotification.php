<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail as BaseVerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Lang;

class VerifyEmailNotification extends BaseVerifyEmail
{
    /**
     * Build the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        if (static::$toMailCallback) {
            return call_user_func(static::$toMailCallback, $notifiable, $verificationUrl);
        }

        return (new MailMessage)
            ->subject(Lang::get('Initialize Neural Link (Verify Email)'))
            ->greeting('Welcome to the System.')
            ->line(Lang::get('A new node connection request has been detected. To fully synchronize your account and gain access to the mainframe, please verify your email address.'))
            ->action(Lang::get('Verify Email Address'), $verificationUrl)
            ->line(Lang::get('If you did not initiate this connection, no further action is required and you may terminate this transmission.'));
    }
}
