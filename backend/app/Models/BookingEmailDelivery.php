<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingEmailDelivery extends Model
{
    protected $fillable = [
        'booking_customer_id',
        'appointment_id',
        'batch_id',
        'type',
        'recipient_email',
        'status',
        'attempts',
        'payload',
        'error_message',
        'sent_at',
        'failed_at',
        'created_by_user_id',
    ];

    protected function casts(): array
    {
        return [
            'payload' => 'array',
            'sent_at' => 'datetime',
            'failed_at' => 'datetime',
        ];
    }

    public function bookingCustomer(): BelongsTo
    {
        return $this->belongsTo(BookingCustomer::class);
    }

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class)->withTrashed();
    }
}
