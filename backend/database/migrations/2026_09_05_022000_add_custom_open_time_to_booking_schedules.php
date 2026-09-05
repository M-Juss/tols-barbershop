<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('booking_schedules', function (Blueprint $table): void {
            $table->time('custom_open_time')->default('12:30');
        });
    }

    public function down(): void
    {
        Schema::table('booking_schedules', function (Blueprint $table): void {
            $table->dropColumn('custom_open_time');
        });
    }
};
