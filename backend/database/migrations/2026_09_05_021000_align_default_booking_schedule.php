<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('booking_schedules')
            ->where('effective_from', '1970-01-01')
            ->update([
                'opening_time' => '09:00:00',
                'closing_time' => '19:00:00',
                'updated_at' => now(),
            ]);
    }

    public function down(): void {}
};
