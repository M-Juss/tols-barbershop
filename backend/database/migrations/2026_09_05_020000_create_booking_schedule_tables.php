<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('booking_schedules', function (Blueprint $table): void {
            $table->id();
            $table->date('effective_from')->unique();
            $table->unsignedTinyInteger('open_day_from')->default(1);
            $table->unsignedTinyInteger('open_day_to')->default(7);
            $table->unsignedTinyInteger('closed_weekday')->nullable()->default(7);
            $table->time('opening_time')->default('09:00');
            $table->time('closing_time')->default('19:00');
            $table->unsignedTinyInteger('booking_days_ahead')->default(7);
            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('schedule_open_slots', function (Blueprint $table): void {
            $table->id();
            $table->date('slot_date');
            $table->time('slot_time');
            $table->foreignId('barber_user_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['slot_date', 'slot_time', 'barber_user_id']);
            $table->index(['slot_date', 'barber_user_id']);
        });

        DB::table('booking_schedules')->insert([
            'effective_from' => '1970-01-01',
            'open_day_from' => 1,
            'open_day_to' => 7,
            'closed_weekday' => 7,
            'opening_time' => '09:00:00',
            'closing_time' => '19:00:00',
            'booking_days_ahead' => 7,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('schedule_open_slots');
        Schema::dropIfExists('booking_schedules');
    }
};
