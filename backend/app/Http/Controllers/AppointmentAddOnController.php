<?php

namespace App\Http\Controllers;

use App\Http\Requests\AppointmentAddOnRequest;
use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use App\Models\AppointmentAddOn;
use App\Models\ServiceAddOn;
use App\Support\EntityChange;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AppointmentAddOnController extends Controller
{
    public function store(AppointmentAddOnRequest $request, string $appointmentId)
    {
        $validated = $request->validated();

        try {
            $appointment = DB::transaction(function () use ($appointmentId, $validated): Appointment {
                $appointment = Appointment::whereKey($appointmentId)
                    ->lockForUpdate()
                    ->firstOrFail();

                $this->assertConfirmed($appointment);

                $addOn = ServiceAddOn::query()
                    ->whereKey($validated['add_on_id'])
                    ->where('is_active', true)
                    ->lockForUpdate()
                    ->first();

                if (! $addOn) {
                    throw ValidationException::withMessages([
                        'add_on_id' => 'The selected add-on is not active.',
                    ]);
                }

                if (AppointmentAddOn::query()
                    ->where('appointment_id', $appointment->id)
                    ->where('service_add_on_id', $addOn->id)
                    ->exists()) {
                    throw ValidationException::withMessages([
                        'add_on_id' => 'This add-on is already applied to the appointment.',
                    ]);
                }

                AppointmentAddOn::create([
                    'appointment_id' => $appointment->id,
                    'service_add_on_id' => $addOn->id,
                    'name_snapshot' => $addOn->name,
                    'price' => $addOn->price,
                ]);

                $appointment->update([
                    'price' => round((float) $appointment->price + (float) $addOn->price, 2),
                ]);

                return $appointment;
            }, 3);
        } catch (UniqueConstraintViolationException) {
            throw ValidationException::withMessages([
                'add_on_id' => 'This add-on is already applied to the appointment.',
            ]);
        }

        $appointment->load([
            'bookingCustomer',
            'barber',
            'service',
            'addOns',
            'emailDeliveries',
        ]);

        EntityChange::dispatch('appointments');

        return new AppointmentResource($appointment);
    }

    public function destroy(string $appointmentId, string $addOnId)
    {
        $appointment = DB::transaction(function () use ($appointmentId, $addOnId): Appointment {
            $appointment = Appointment::whereKey($appointmentId)
                ->lockForUpdate()
                ->firstOrFail();

            $this->assertConfirmed($appointment);

            $line = AppointmentAddOn::query()
                ->where('appointment_id', $appointment->id)
                ->whereKey($addOnId)
                ->lockForUpdate()
                ->first();

            if (! $line) {
                throw ValidationException::withMessages([
                    'add_on_id' => 'The add-on is not applied to this appointment.',
                ]);
            }

            $appointment->update([
                'price' => max(0, round((float) $appointment->price - (float) $line->price, 2)),
            ]);
            $line->delete();

            return $appointment;
        }, 3);

        $appointment->load([
            'bookingCustomer',
            'barber',
            'service',
            'addOns',
            'emailDeliveries',
        ]);

        EntityChange::dispatch('appointments');

        return new AppointmentResource($appointment);
    }

    private function assertConfirmed(Appointment $appointment): void
    {
        if ($appointment->status !== 'confirmed') {
            throw ValidationException::withMessages([
                'appointment' => 'Add-ons can only be changed on confirmed appointments.',
            ]);
        }
    }
}
