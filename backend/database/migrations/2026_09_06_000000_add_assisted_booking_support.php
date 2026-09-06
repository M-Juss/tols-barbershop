<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('booking_customers', function (Blueprint $table) {
            $table->string('email', 255)->nullable()->change();
            $table->string('contact_number', 11)->nullable()->change();
        });

        Schema::table('appointments', function (Blueprint $table) {
            $table->string('booking_source', 32)->default('public')->after('is_walkin');
            $table->index('booking_source', 'appointments_booking_source_index');
        });

        DB::table('appointments')
            ->where('is_walkin', true)
            ->update(['booking_source' => 'walkin']);
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropIndex('appointments_booking_source_index');
            $table->dropColumn('booking_source');
        });

        DB::table('booking_customers')
            ->whereNull('email')
            ->orderBy('id')
            ->eachById(function (object $customer): void {
                DB::table('booking_customers')
                    ->where('id', $customer->id)
                    ->update(['email' => "assisted-{$customer->id}@invalid.local"]);
            });
        DB::table('booking_customers')
            ->whereNull('contact_number')
            ->update(['contact_number' => '00000000000']);

        Schema::table('booking_customers', function (Blueprint $table) {
            $table->string('email', 255)->nullable(false)->change();
            $table->string('contact_number', 11)->nullable(false)->change();
        });
    }
};
