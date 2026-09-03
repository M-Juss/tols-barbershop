<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentAddOnResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'add_on_id' => $this->service_add_on_id,
            'name' => $this->name_snapshot ?? $this->serviceAddOn?->name,
            'price' => $this->price,
        ];
    }
}
