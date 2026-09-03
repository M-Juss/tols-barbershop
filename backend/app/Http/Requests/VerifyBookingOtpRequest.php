<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VerifyBookingOtpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'request_token' => ['required', 'string', 'size:64'],
            'otp' => ['required', 'digits:6'],
        ];
    }
}
