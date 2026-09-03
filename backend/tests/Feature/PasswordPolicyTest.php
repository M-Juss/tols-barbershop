<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

test('manager can create and update an admin with a simple six character password', function () {
    $manager = User::factory()->create(['role' => 'manager']);
    Sanctum::actingAs($manager);

    $payload = [
        'fullname' => 'Simple Admin',
        'contact_number' => '09123456789',
        'email' => 'simple-admin@example.test',
        'password' => 'aaaaa',
        'password_confirmation' => 'aaaaa',
        'is_active' => true,
    ];

    $this->postJson('/api/v1/admin', $payload)
        ->assertUnprocessable()
        ->assertJsonValidationErrors('password');

    $this->postJson('/api/v1/admin', [
        ...$payload,
        'password' => 'aaaaaa',
        'password_confirmation' => 'aaaaaa',
    ])->assertCreated();

    $admin = User::where('email', 'simple-admin@example.test')->firstOrFail();
    expect(Hash::check('aaaaaa', $admin->password))->toBeTrue();

    $this->putJson("/api/v1/admin/{$admin->id}", [
        'fullname' => $admin->fullname,
        'contact_number' => $admin->contact_number,
        'email' => $admin->email,
        'password' => 'bbbbbb',
        'password_confirmation' => 'bbbbbb',
        'is_active' => true,
    ])->assertOk();

    expect(Hash::check('bbbbbb', $admin->fresh()->password))->toBeTrue();
});

test('barber password validation keeps its existing complexity policy', function () {
    $manager = User::factory()->create(['role' => 'manager']);
    Sanctum::actingAs($manager);

    $this->postJson('/api/v1/barber', [
        'fullname' => 'Simple Barber',
        'contact_number' => '09123456789',
        'email' => 'simple-barber@example.test',
        'password' => 'aaaaaa',
        'password_confirmation' => 'aaaaaa',
        'is_active' => true,
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('password');
});
