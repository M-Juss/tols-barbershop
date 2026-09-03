<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BookingCustomer extends Model
{
    protected $fillable = [
        'fullname',
        'email',
        'contact_number',
    ];

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    public function feedback(): HasMany
    {
        return $this->hasMany(AppointmentFeedback::class);
    }
}
