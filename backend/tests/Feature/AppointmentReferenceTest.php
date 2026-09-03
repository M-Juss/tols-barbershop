<?php

use App\Models\Module;
use App\Models\Notification;
use App\Models\User;
use App\Support\DisplayId;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('appointment display references use the REF prefix', function () {
    expect(DisplayId::booking(1))->toBe('REF-90235');
});

test('existing booking references are migrated to appointment references', function () {
    $user = User::create([
        'fullname' => 'Reference Test User',
        'contact_number' => '09170000000',
        'email' => 'reference@example.test',
        'role' => 'manager',
        'password' => 'password',
        'is_active' => true,
    ]);

    $notification = Notification::create([
        'user_id' => $user->id,
        'type' => 'appointment_completed',
        'title' => 'Booking Complete',
        'message' => 'Your booking BK-90235 is now complete.',
        'payload' => [
            'appointment_id' => 1,
            'booking_id' => 'BK-90235',
        ],
    ]);

    $migration = require database_path('migrations/2026_07_13_000000_update_booking_references_to_appointment_references.php');
    $migration->up();

    $notification->refresh();

    expect($notification->message)->toBe('Your booking APT-90235 is now complete.');
    expect($notification->payload['booking_id'])->toBe('APT-90235');
});

test('legacy appointment references and module labels migrate to the new names', function () {
    $user = User::create([
        'fullname' => 'Reference Migration User',
        'contact_number' => '09170000001',
        'email' => 'reference-migration@example.test',
        'role' => 'manager',
        'password' => 'password',
        'is_active' => true,
    ]);

    Module::create(['key' => 'appointment', 'name' => 'Appointments']);

    $notification = Notification::create([
        'user_id' => $user->id,
        'type' => 'appointment_confirmed',
        'title' => 'Booking Confirmed',
        'message' => 'Your booking APT-90235 is confirmed.',
        'payload' => [
            'reference' => 'APT-90235',
        ],
    ]);

    $migration = require database_path('migrations/2026_09_03_010002_rename_appointment_module_and_references.php');
    $migration->up();

    $notification->refresh();

    expect(Module::where('key', 'appointment')->value('name'))->toBe('Schedules')
        ->and($notification->message)->toBe('Your booking REF-90235 is confirmed.')
        ->and($notification->payload['reference'])->toBe('REF-90235');
});
