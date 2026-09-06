<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\SanitizesInput;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AssistedBookingRequest extends FormRequest
{
    use SanitizesInput;

    public function authorize(): bool
    {
        return in_array($this->user()?->role, ['admin', 'manager'], true);
    }

    protected function prepareForValidation(): void
    {
        $this->sanitizeStringFields(['customer_name']);
        $this->normalizeEmailFields(['customer_email']);
        $this->normalizePhoneFields(['customer_contact_number']);
        $this->sanitizeTextFields(['notes']);

        $this->merge([
            'customer_email' => filled($this->input('customer_email'))
                ? $this->input('customer_email')
                : null,
            'customer_contact_number' => filled($this->input('customer_contact_number'))
                ? $this->input('customer_contact_number')
                : null,
        ]);
    }

    public function rules(): array
    {
        return [
            'customer_name' => ['required', 'string', 'min:2', 'max:255', 'regex:/^[\pL\s.\'-]+$/u'],
            'customer_email' => ['nullable', 'string', 'email:rfc', 'max:255'],
            'customer_contact_number' => ['nullable', 'string', 'regex:/^09\d{9}$/'],
            'service_id' => [
                'required',
                'integer',
                Rule::exists('services', 'id')->where('is_active', true),
            ],
            'barber_user_id' => [
                'required',
                'integer',
                Rule::exists('users', 'id')->where(fn ($query) => $query
                    ->where('role', 'barber')
                    ->where('is_active', true)),
            ],
            'appointment_date' => ['required', 'date_format:Y-m-d'],
            'appointment_time' => ['required', 'date_format:H:i'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function attributes(): array
    {
        return [
            'appointment_date' => 'booking date',
            'appointment_time' => 'booking time',
        ];
    }
}
