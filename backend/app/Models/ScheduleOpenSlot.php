<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScheduleOpenSlot extends Model
{
    protected $fillable = [
        'slot_date',
        'slot_time',
        'barber_user_id',
        'created_by_user_id',
    ];

    protected $casts = [
        'slot_date' => 'date:Y-m-d',
    ];

    public function barber(): BelongsTo
    {
        return $this->belongsTo(User::class, 'barber_user_id');
    }
}
