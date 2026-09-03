<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->string('walkin_customer_name')->nullable()->after('is_walkin');
            $table->string('walkin_customer_contact_number', 11)->nullable()->after('walkin_customer_name');
        });
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn(['walkin_customer_name', 'walkin_customer_contact_number']);
        });
    }
};
