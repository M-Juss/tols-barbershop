<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingMailNotification extends Notification
{
    use Queueable;

    public function __construct(public readonly array $content) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject($this->content['subject'])
            ->view([
                'html' => 'emails.booking',
                'text' => 'emails.booking-text',
            ], $this->content);
    }
}
