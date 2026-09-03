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
                ['name' => $module['name']]
            );
        }
    }
}
