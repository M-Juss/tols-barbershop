<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingVerification extends Model
{
    protected $fillable = [
        'request_token_hash',
        'email',
        'otp_hash',
        'payload',
        'attempts',
        'expires_at',
        'resend_available_at',
        'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'payload' => 'encrypted:array',
            'expires_at' => 'datetime',
            'resend_available_at' => 'datetime',
            'verified_at' => 'datetime',
        ];
    }
}
