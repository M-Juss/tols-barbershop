<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AppointmentAddOnRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'add_on_id' => [
                'required',
                'integer',
                'exists:service_add_ons,id',
            ],
        ];
    }
}
