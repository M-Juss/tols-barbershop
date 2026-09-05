<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointment_add_ons', function (Blueprint $table): void {
            $table->dropUnique('appointment_add_ons_appointment_id_service_add_on_id_unique');
        });
    }

    public function down(): void
    {
        Schema::table('appointment_add_ons', function (Blueprint $table): void {
            $table->unique(['appointment_id', 'service_add_on_id']);
        });
    }
};
