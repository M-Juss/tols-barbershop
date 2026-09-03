<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('modules')
            ->where('key', 'appointment')
            ->update(['name' => 'Schedules']);

        DB::table('notifications')
            ->orderBy('id')
            ->chunkById(100, function ($notifications): void {
                foreach ($notifications as $notification) {
                    $payload = $notification->payload
                        ? json_decode($notification->payload, true, 512, JSON_THROW_ON_ERROR)
                        : null;

                    $payload = $this->replacePrefix($payload);

                    DB::table('notifications')
                        ->where('id', $notification->id)
                        ->update([
                            'message' => str_replace('APT-', 'REF-', $notification->message),
                            'payload' => $payload === null
                                ? null
                                : json_encode($payload, JSON_THROW_ON_ERROR),
                        ]);
                }
            });
    }

    public function down(): void
    {
        DB::table('modules')
            ->where('key', 'appointment')
            ->update(['name' => 'Appointments']);

        DB::table('notifications')
            ->orderBy('id')
            ->chunkById(100, function ($notifications): void {
                foreach ($notifications as $notification) {
                    $payload = $notification->payload
                        ? json_decode($notification->payload, true, 512, JSON_THROW_ON_ERROR)
                        : null;

                    $payload = $this->replacePrefix($payload, 'REF-', 'APT-');

                    DB::table('notifications')
                        ->where('id', $notification->id)
                        ->update([
                            'message' => str_replace('REF-', 'APT-', $notification->message),
                            'payload' => $payload === null
                                ? null
                                : json_encode($payload, JSON_THROW_ON_ERROR),
                        ]);
                }
            });
    }

    private function replacePrefix(mixed $value, string $from = 'APT-', string $to = 'REF-'): mixed
    {
        if (is_string($value)) {
            return str_replace($from, $to, $value);
        }

        if (is_array($value)) {
            foreach ($value as $key => $item) {
                $value[$key] = $this->replacePrefix($item, $from, $to);
            }
        }

        return $value;
    }
};
