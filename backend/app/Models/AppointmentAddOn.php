<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AppointmentAddOn extends Model
{
    protected $fillable = [
        'appointment_id',
        'service_add_on_id',
        'name_snapshot',
        'price',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }

    public function serviceAddOn(): BelongsTo
    {
        return $this->belongsTo(ServiceAddOn::class);
    }
}
