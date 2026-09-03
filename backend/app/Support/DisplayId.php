<?php

namespace App\Support;

class DisplayId
{
    public static function booking(int|string|null $id): string
    {
        if ($id === null || ! is_numeric($id)) {
            return '';
        }

        $number = (((int) $id * 12345 + 67890) % 90000) + 10000;

        return "REF-{$number}";
    }

    public static function ticket(int|string|null $id): string
    {
        if ($id === null || ! is_numeric($id)) {
            return '';
        }

        $number = (((int) $id * 54321 + 98765) % 90000) + 10000;

        return "TK-{$number}";
    }

    public static function group(int|string|null $id): string
    {
        if ($id === null || ! is_numeric($id)) {
            return '';
        }

        $number = (((int) $id * 23456 + 78901) % 90000) + 10000;

        return "GRP-{$number}";
    }
}
