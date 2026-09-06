<?php

namespace Database\Seeders;

use App\Models\Module;
use Illuminate\Database\Seeder;

class ModuleSeeder extends Seeder
{
    public function run(): void
    {
        $modules = [
            ['key' => 'dashboard', 'name' => 'Dashboard'],
            ['key' => 'management', 'name' => 'Management'],
            ['key' => 'management-services', 'name' => 'Services & Add-ons', 'parent_key' => 'management'],
            ['key' => 'management-admins', 'name' => 'Admins & Roles', 'parent_key' => 'management'],
            ['key' => 'management-barbers', 'name' => 'Barbers', 'parent_key' => 'management'],
            ['key' => 'management-schedule', 'name' => 'Booking Schedule', 'parent_key' => 'management'],
            ['key' => 'management-gallery', 'name' => 'Gallery', 'parent_key' => 'management'],
            ['key' => 'appointment', 'name' => 'Schedules'],
            ['key' => 'walkin', 'name' => 'Walk-in'],
            ['key' => 'history', 'name' => 'History'],
            ['key' => 'reports', 'name' => 'Reports'],
            ['key' => 'feedback', 'name' => 'Feedback'],
            ['key' => 'crm', 'name' => 'Customers'],
        ];

        foreach ($modules as $module) {
            Module::updateOrCreate(
                ['key' => $module['key']],
                [
                    'name' => $module['name'],
                    'parent_key' => $module['parent_key'] ?? null,
                ]
            );
        }
    }
}
