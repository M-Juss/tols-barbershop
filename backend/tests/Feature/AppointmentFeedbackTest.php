<?php

use App\Models\Appointment;
use App\Models\AppointmentFeedback;
use App\Models\BookingCustomer;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

function createFeedbackTestUser(string $role, string $email): User
{
    $user = User::create([
        'fullname' => ucfirst($role).' User',
        'contact_number' => '09170000000',
        'email' => $email,
        'role' => $role,
        'password' => 'password',
        'is_active' => true,
    ]);

    return $user;
}

function createFeedbackTestCustomer(string $email): BookingCustomer
{
    return BookingCustomer::create([
        'fullname' => 'Customer User',
        'contact_number' => '09170000000',
        'email' => $email,
    ]);
}

function createFeedbackTestService(): Service
{
    return Service::create([
        'name' => 'Classic Haircut',
        'description' => 'Clean haircut service',
        'duration' => 45,
        'price' => 250,
        'is_active' => true,
    ]);
}

test('featured five star feedback is available to public landing endpoints', function () {
    $customer = createFeedbackTestCustomer('historical-feedback-customer@example.test');
    $barber = createFeedbackTestUser('barber', 'historical-feedback-barber@example.test');
    $service = createFeedbackTestService();

    $appointment = Appointment::create([
        'booking_customer_id' => $customer->id,
        'service_id' => $service->id,
        'barber_user_id' => $barber->id,
        'appointment_date' => now()->subDay()->toDateString(),
        'appointment_time' => '12:00',
        'duration_minutes' => 45,
        'price' => 250,
        'status' => 'completed',
        'completed_at' => now()->subDay(),
    ]);

    AppointmentFeedback::create([
        'appointment_id' => $appointment->id,
        'booking_customer_id' => $customer->id,
        'rating' => 5,
        'comment' => 'Legacy public feedback',
        'is_featured' => true,
        'customer_name_snapshot' => $customer->fullname,
    ]);

    $this->getJson('/api/v1/public-feedback')
        ->assertOk()
        ->assertJsonCount(1, 'data.feedback');

    $this->getJson('/api/v1/featured-feedback')
        ->assertOk()
        ->assertJsonCount(1, 'data.feedback');
});

test('manager can feature submitted feedback for the landing page', function () {
    $customer = createFeedbackTestCustomer('public-feedback-customer@example.test');
    $customer->update(['fullname' => 'Jamie Marie Rivera']);
    $barber = createFeedbackTestUser('barber', 'public-feedback-barber@example.test');
    $manager = createFeedbackTestUser('manager', 'public-feedback-manager@example.test');
    $service = createFeedbackTestService();

    $appointment = Appointment::create([
        'booking_customer_id' => $customer->id,
        'service_id' => $service->id,
        'barber_user_id' => $barber->id,
        'appointment_date' => now()->toDateString(),
        'appointment_time' => '13:00',
        'duration_minutes' => 45,
        'price' => 250,
        'status' => 'completed',
        'completed_at' => now(),
    ]);

    $feedback = AppointmentFeedback::create([
        'appointment_id' => $appointment->id,
        'booking_customer_id' => $customer->id,
        'rating' => 5,
        'comment' => 'Excellent service from start to finish.',
        'is_featured' => false,
        'customer_name_snapshot' => $customer->fullname,
    ]);

    Sanctum::actingAs($manager);

    $this->putJson("/api/v1/feedback/{$feedback->id}/toggle-feature")
        ->assertOk()
        ->assertJsonPath('data.is_featured', true);

    $this->getJson('/api/v1/featured-feedback')
        ->assertOk()
        ->assertJsonCount(1, 'data.feedback')
        ->assertJsonPath('data.feedback.0.customer_name', 'Jamie Marie Rivera')
        ->assertJsonPath('data.feedback.0.service_name', 'Classic Haircut')
        ->assertJsonPath('data.feedback.0.is_featured', true);

    $this->getJson('/api/v1/public-feedback')
        ->assertOk()
        ->assertJsonCount(1, 'data.feedback')
        ->assertJsonPath('data.feedback.0.customer_name', 'Jamie Marie Rivera');
});

function createFeedbackListRecord(
    BookingCustomer $customer,
    User $barber,
    Service $service,
    int $rating,
    bool $featured,
    string $comment,
    string $createdAt,
): AppointmentFeedback {
    $appointment = Appointment::create([
        'booking_customer_id' => $customer->id,
        'service_id' => $service->id,
        'barber_user_id' => $barber->id,
        'appointment_date' => now()->toDateString(),
        'appointment_time' => '10:00',
        'duration_minutes' => 45,
        'price' => 250,
        'status' => 'completed',
    ]);

    return AppointmentFeedback::forceCreate([
        'appointment_id' => $appointment->id,
        'booking_customer_id' => $customer->id,
        'rating' => $rating,
        'comment' => $comment,
        'is_featured' => $featured,
        'customer_name_snapshot' => $customer->fullname,
        'created_at' => $createdAt,
        'updated_at' => $createdAt,
    ]);
}

test('authenticated feedback list paginates and sorts deterministically', function () {
    $customer = createFeedbackTestCustomer('feedback-list-customer@example.test');
    $barber = createFeedbackTestUser('barber', 'feedback-list-barber@example.test');
    $manager = createFeedbackTestUser('manager', 'feedback-list-manager@example.test');
    $service = createFeedbackTestService();
    $first = createFeedbackListRecord($customer, $barber, $service, 5, false, 'First', '2026-07-15 10:00:00');
    $second = createFeedbackListRecord($customer, $barber, $service, 3, false, 'Second', '2026-07-15 11:00:00');
    $third = createFeedbackListRecord($customer, $barber, $service, 3, false, 'Third', '2026-07-15 11:00:00');
    $fourth = createFeedbackListRecord($customer, $barber, $service, 4, false, 'Fourth', '2026-07-15 09:00:00');
    Sanctum::actingAs($manager);

    $pageOne = $this->getJson('/api/v1/feedback?per_page=2&page=1')
        ->assertOk()
        ->assertJsonPath('data.meta.current_page', 1)
        ->assertJsonPath('data.meta.last_page', 2)
        ->assertJsonPath('data.meta.per_page', 2)
        ->assertJsonPath('data.meta.total', 4);

    $pageTwo = $this->getJson('/api/v1/feedback?per_page=2&page=2')->assertOk();
    $pageOneIds = collect($pageOne->json('data.feedback'))->pluck('id')->all();
    $pageTwoIds = collect($pageTwo->json('data.feedback'))->pluck('id')->all();

    expect($pageOneIds)->toBe([$third->id, $second->id]);
    expect($pageTwoIds)->toBe([$first->id, $fourth->id]);
    expect(array_intersect($pageOneIds, $pageTwoIds))->toBe([]);

    $sorted = $this->getJson('/api/v1/feedback?sort=rating&dir=asc')->assertOk();
    expect(collect($sorted->json('data.feedback'))->pluck('id')->all())
        ->toBe([$second->id, $third->id, $fourth->id, $first->id]);
});

test('authenticated feedback list applies filters and literal wildcard search', function () {
    $customer = createFeedbackTestCustomer('feedback-filter-customer@example.test');
    $barber = createFeedbackTestUser('barber', 'feedback-filter-barber@example.test');
    $manager = createFeedbackTestUser('manager', 'feedback-filter-manager@example.test');
    $service = createFeedbackTestService();
    $matching = createFeedbackListRecord($customer, $barber, $service, 5, true, 'Precision % result', '2026-07-15 10:00:00');
    createFeedbackListRecord($customer, $barber, $service, 5, false, 'Ordinary result', '2026-07-15 11:00:00');
    createFeedbackListRecord($customer, $barber, $service, 4, true, 'Another result', '2026-07-15 12:00:00');
    Sanctum::actingAs($manager);

    $this->getJson('/api/v1/feedback?rating=5&featured=featured&search=%25')
        ->assertOk()
        ->assertJsonPath('data.meta.total', 1)
        ->assertJsonPath('data.feedback.0.id', $matching->id);

    $this->getJson('/api/v1/feedback?featured=not_featured')
        ->assertOk()
        ->assertJsonPath('data.meta.total', 1);
});

test('authenticated feedback list rejects invalid list parameters', function () {
    $manager = createFeedbackTestUser('manager', 'feedback-validation-manager@example.test');
    Sanctum::actingAs($manager);

    $query = http_build_query([
        'rating' => 6,
        'featured' => 'yes',
        'sort' => 'comment',
        'dir' => 'sideways',
        'page' => 0,
        'per_page' => 51,
    ]);

    $this->getJson('/api/v1/feedback?'.$query)
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['rating', 'featured', 'sort', 'dir', 'page', 'per_page']);
});

test('featured feedback minimum and maximum are enforced without partial toggles', function () {
    $customer = createFeedbackTestCustomer('featured-boundary-customer@example.test');
    $barber = createFeedbackTestUser('barber', 'featured-boundary-barber@example.test');
    $manager = createFeedbackTestUser('manager', 'featured-boundary-manager@example.test');
    $service = createFeedbackTestService();
    $feedback = collect(range(1, 6))->map(fn (int $index) => createFeedbackListRecord(
        $customer,
        $barber,
        $service,
        5,
        $index <= 5,
        "Featured boundary {$index}",
        "2026-07-15 1{$index}:00:00",
    ));
    Sanctum::actingAs($manager);

    $this->putJson("/api/v1/feedback/{$feedback[5]->id}/toggle-feature")
        ->assertUnprocessable()
        ->assertJsonPath('message', 'You can feature up to 5 items. Unfeature one first.');

    expect(AppointmentFeedback::where('is_featured', true)->count())->toBe(5);
    expect($feedback[5]->fresh()->is_featured)->toBeFalse();

    AppointmentFeedback::whereKeyNot($feedback[0]->id)->update(['is_featured' => false]);
    $this->putJson("/api/v1/feedback/{$feedback[0]->id}/toggle-feature")
        ->assertUnprocessable()
        ->assertJsonPath('message', 'At least 1 feedback must remain featured.');

    expect($feedback[0]->fresh()->is_featured)->toBeTrue();
});
