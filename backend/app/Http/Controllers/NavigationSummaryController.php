<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NavigationSummaryController extends Controller
{
    use ApiResponseTrait;

    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();

        return $this->success('Navigation summary retrieved', [
            'pending_appointments' => $user->canAccessModule('appointment')
                ? Appointment::query()->where('status', 'pending')->count()
                : null,
        ]);
    }
}
