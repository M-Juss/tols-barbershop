<?php

namespace App\Services;

use App\Models\BookingCustomer;
use Illuminate\Validation\ValidationException;

class BookingCustomerService
{
    public function findOrCreate(
        string $fullname,
        ?string $email,
        ?string $contact,
        string $contactField = 'contact_number',
    ): BookingCustomer {
        if (! $email && ! $contact) {
            return BookingCustomer::create([
                'fullname' => $fullname,
                'email' => null,
                'contact_number' => null,
            ]);
        }

        $matches = BookingCustomer::query()
            ->where(function ($query) use ($email, $contact): void {
                if ($email) {
                    $query->where('email', $email);
                }
                if ($contact) {
                    $email
                        ? $query->orWhere('contact_number', $contact)
                        : $query->where('contact_number', $contact);
                }
            })
            ->orderBy('id')
            ->lockForUpdate()
            ->get();

        $emailMatch = $email ? $matches->firstWhere('email', $email) : null;
        $contactMatches = $contact
            ? $matches->where('contact_number', $contact)->values()
            : collect();

        if ($emailMatch && $contactMatches->contains(fn (BookingCustomer $customer): bool => $customer->id !== $emailMatch->id)) {
            throw ValidationException::withMessages([
                $contactField => 'The email and contact number belong to different customer records.',
            ]);
        }

        if (! $emailMatch && $contactMatches->count() > 1) {
            throw ValidationException::withMessages([
                $contactField => 'Multiple customers use this contact number. Add the customer email to identify the correct record.',
            ]);
        }

        $customer = $emailMatch ?? $contactMatches->first();
        $attributes = ['fullname' => $fullname];
        if ($email) {
            $attributes['email'] = $email;
        }
        if ($contact) {
            $attributes['contact_number'] = $contact;
        }

        if ($customer) {
            $customer->update($attributes);

            return $customer->refresh();
        }

        return BookingCustomer::create([
            ...$attributes,
            'email' => $email,
            'contact_number' => $contact,
        ]);
    }
}
