<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScheduleOpenSlotResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slot_date' => $this->slot_date->toDateString(),
            'slot_time' => substr((string) $this->slot_time, 0, 5),
            'barber_user_id' => (int) $this->barber_user_id,
            'barber_name' => $this->barber?->fullname,
            'created_at' => $this->created_at,
        ];
    }
}
