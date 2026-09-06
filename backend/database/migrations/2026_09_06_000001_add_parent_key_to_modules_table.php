<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('modules', function (Blueprint $table): void {
            $table->string('parent_key')->nullable()->after('name');
            $table->index('parent_key');
        });

        foreach ([
            ['key' => 'management-services', 'name' => 'Services & Add-ons'],
            ['key' => 'management-admins', 'name' => 'Admins & Roles'],
            ['key' => 'management-barbers', 'name' => 'Barbers'],
            ['key' => 'management-schedule', 'name' => 'Booking Schedule'],
            ['key' => 'management-gallery', 'name' => 'Gallery'],
        ] as $module) {
            DB::table('modules')->updateOrInsert(
                ['key' => $module['key']],
                [
                    'name' => $module['name'],
                    'parent_key' => 'management',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            );
        }
    }

    public function down(): void
    {
        Schema::table('modules', function (Blueprint $table): void {
            $table->dropIndex(['parent_key']);
            $table->dropColumn('parent_key');
        });
    }
};
