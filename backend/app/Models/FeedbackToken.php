<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FeedbackToken extends Model
{
    protected $fillable = [
        'token_hash',
        'booking_customer_id',
        'appointment_id',
        'batch_id',
        'expires_at',
        'used_at',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'used_at' => 'datetime',
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
