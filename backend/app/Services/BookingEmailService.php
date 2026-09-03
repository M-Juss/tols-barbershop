<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\BookingEmailDelivery;
use App\Notifications\BookingMailNotification;
use App\Support\DisplayId;
use Illuminate\Support\Facades\Notification;
use Throwable;

class BookingEmailService
{
    public function createAndSend(
        Appointment $appointment,
        string $type,
        array $content,
        ?int $createdByUserId = null,
        ?string $batchId = null,
    ): BookingEmailDelivery {
        $appointment->loadMissing('bookingCustomer');

        $delivery = BookingEmailDelivery::create([
            'booking_customer_id' => $appointment->booking_customer_id,
            'appointment_id' => $appointment->id,
            'batch_id' => $batchId ?? $appointment->batch_id,
            'type' => $type,
            'recipient_email' => $appointment->customer_email_snapshot ?? $appointment->bookingCustomer?->email,
            'status' => 'pending',
            'payload' => $content,
            'created_by_user_id' => $createdByUserId,
        ]);

        $this->send($delivery);

        return $delivery->refresh();
    }

    public function send(BookingEmailDelivery $delivery): bool
    {
        $delivery->increment('attempts');

        try {
            Notification::route('mail', $delivery->recipient_email)
                ->notify(new BookingMailNotification($delivery->payload ?? []));

            $delivery->forceFill([
                'status' => 'sent',
                'sent_at' => now(),
                'failed_at' => null,
                'error_message' => null,
            ])->save();

            return true;
        } catch (Throwable $exception) {
            report($exception);
            $delivery->forceFill([
                'status' => 'failed',
                'failed_at' => now(),
                'error_message' => str($exception->getMessage())->limit(1000),
            ])->save();

            return false;
        }
    }

    public function pendingContent(Appointment $appointment, int $count = 1): array
    {
        $appointment->loadMissing(['bookingCustomer', 'barber', 'service']);
        $reference = $count > 1
            ? DisplayId::group($appointment->id)
            : DisplayId::booking($appointment->id);

        return [
            'subject' => 'Your TOL Barbershop booking is pending',
            'heading' => 'Booking Request Received',
            'customerName' => $appointment->bookingCustomer?->fullname ?? $appointment->customerDisplayName() ?? 'there',
            'intro' => $count > 1
                ? "Your group booking request for {$count} appointments is pending staff confirmation."
                : 'Your appointment request is pending staff confirmation.',
            'highlight' => $reference,
            'details' => [
                'Date' => $appointment->appointment_date->format('F j, Y'),
                'Barber' => $appointment->barber?->fullname ?? '—',
                'Appointments' => (string) $count,
            ],
            'footer' => 'We will email you when the booking is confirmed or rejected.',
        ];
    }
}
