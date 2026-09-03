<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AppointmentFeedback extends Model
{
    protected $table = 'appointment_feedback';

    protected $fillable = [
        'appointment_id',
        'batch_id',
        'booking_customer_id',
        'rating',
        'comment',
        'is_featured',
        'customer_name_snapshot',
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_featured' => 'boolean',
    ];

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class)->withTrashed();
    }

    public function bookingCustomer(): BelongsTo
    {
        return $this->belongsTo(BookingCustomer::class);
    }
}
