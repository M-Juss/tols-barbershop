<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('booking_customers', function (Blueprint $table) {
            $table->id();
            $table->string('fullname', 255);
            $table->string('email', 255)->unique();
            $table->string('contact_number', 11);
            $table->timestamps();
        });

        Schema::table('appointments', function (Blueprint $table) {
            $table->foreignId('booking_customer_id')
                ->nullable()
                ->after('id')
                ->constrained('booking_customers')
                ->nullOnDelete();
            $table->string('customer_email_snapshot', 255)->nullable()->after('customer_name_snapshot');
            $table->string('customer_contact_number_snapshot', 11)->nullable()->after('customer_email_snapshot');
        });

        Schema::create('booking_verifications', function (Blueprint $table) {
            $table->id();
            $table->string('request_token_hash', 64)->unique();
            $table->string('email', 255)->index();
            $table->string('otp_hash', 255);
            $table->longText('payload');
            $table->unsignedTinyInteger('attempts')->default(0);
            $table->timestamp('expires_at');
            $table->timestamp('resend_available_at');
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
        });

        Schema::create('booking_email_deliveries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_customer_id')->nullable()->constrained('booking_customers')->nullOnDelete();
            $table->foreignId('appointment_id')->nullable()->constrained('appointments')->nullOnDelete();
            $table->string('batch_id', 255)->nullable()->index();
            $table->string('type', 50);
            $table->string('recipient_email', 255);
            $table->enum('status', ['pending', 'sent', 'failed'])->default('pending');
            $table->unsignedSmallInteger('attempts')->default(0);
            $table->json('payload')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('failed_at')->nullable();
            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['appointment_id', 'created_at']);
            $table->index(['batch_id', 'created_at']);
        });

        Schema::create('feedback_tokens', function (Blueprint $table) {
            $table->id();
            $table->string('token_hash', 64)->unique();
            $table->foreignId('booking_customer_id')->constrained('booking_customers')->cascadeOnDelete();
            $table->foreignId('appointment_id')->nullable()->unique()->constrained('appointments')->cascadeOnDelete();
            $table->string('batch_id', 255)->nullable()->unique();
            $table->timestamp('expires_at');
            $table->timestamp('used_at')->nullable();
            $table->timestamps();
        });

        Schema::table('appointment_feedback', function (Blueprint $table) {
            $table->foreignId('booking_customer_id')
                ->nullable()
                ->after('appointment_id')
                ->constrained('booking_customers')
                ->nullOnDelete();
            $table->string('batch_id', 255)->nullable()->unique()->after('appointment_id');
        });

    }

    public function down(): void
    {
        Schema::table('appointment_feedback', function (Blueprint $table) {
            $table->dropConstrainedForeignId('booking_customer_id');
            $table->dropColumn('batch_id');
        });

        Schema::dropIfExists('feedback_tokens');
        Schema::dropIfExists('booking_email_deliveries');
        Schema::dropIfExists('booking_verifications');

        Schema::table('appointments', function (Blueprint $table) {
            $table->dropConstrainedForeignId('booking_customer_id');
            $table->dropColumn(['customer_email_snapshot', 'customer_contact_number_snapshot']);
        });

        Schema::dropIfExists('booking_customers');
    }
};
