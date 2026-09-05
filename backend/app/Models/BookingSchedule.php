<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingSchedule extends Model
{
    protected $fillable = [
        'effective_from',
        'open_day_from',
        'open_day_to',
        'closed_weekday',
        'opening_time',
        'closing_time',
        'custom_open_time',
        'booking_days_ahead',
        'created_by_user_id',
    ];

    protected $casts = [
        'effective_from' => 'date:Y-m-d',
        'open_day_from' => 'integer',
        'open_day_to' => 'integer',
        'closed_weekday' => 'integer',
        'booking_days_ahead' => 'integer',
    ];
}
