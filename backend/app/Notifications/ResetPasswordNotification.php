<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;

class ResetPasswordNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $token
    ) {}

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Reset Password Notification')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('You are receiving this email because we received a password reset request for your account.')
            ->action('Reset Password', 'http://app.local/auth/reset-password/' . $this->token . '?email=' . urlencode($notifiable->getEmailForResetPassword()))
            ->line('This password reset link will expire in ' . config('auth.passwords.'.config('auth.defaults.passwords', 'users').'.expire') . ' minutes.')
            ->line('If you did not request a password reset, no further action is required.')
            ->salutation('Regards, ChatX Team');
    }
}
