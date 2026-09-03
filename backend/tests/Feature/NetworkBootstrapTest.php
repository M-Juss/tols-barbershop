<?php

use App\Models\GalleryImage;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

test('manager navigation summary returns staff badge data', function () {
    $manager = User::factory()->create(['role' => 'manager']);

    Sanctum::actingAs($manager);

    $this->getJson('/api/v1/navigation-summary')
        ->assertOk()
        ->assertJsonPath('data.pending_appointments', 0)
        ->assertJsonStructure(['data' => ['pending_appointments']]);
});

test('public bootstrap consolidates landing content with short shared caching', function () {
    $service = Service::create([
        'name' => 'Haircut',
        'description' => 'Classic haircut',
        'duration' => 60,
        'price' => 250,
        'is_active' => true,
    ]);
    $galleryImage = GalleryImage::create([
        'category' => 'interior',
        'image_url' => 'https://res.cloudinary.com/demo/image/upload/interior.jpg',
        'cloudinary_public_id' => 'tol/interior',
        'alt_text' => 'Barbershop interior',
        'display_order' => 1,
    ]);

    $this->getJson('/api/v1/public-bootstrap')
        ->assertOk()
        ->assertHeader(
            'Cache-Control',
            'max-age=300, public, s-maxage=300, stale-while-revalidate=600',
        )
        ->assertJsonPath('data.services.0.id', $service->id)
        ->assertJsonPath('data.gallery_images.0.id', $galleryImage->id)
        ->assertJsonStructure([
            'data' => [
                'services',
                'gallery_images',
                'featured_feedback',
                'feedback',
            ],
        ]);
});
