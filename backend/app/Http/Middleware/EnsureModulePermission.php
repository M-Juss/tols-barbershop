<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureModulePermission
{
    public function handle(Request $request, Closure $next, string ...$moduleKeys): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized.',
            ], 401);
        }

        if ($user->role !== 'admin') {
            return $next($request);
        }

        $hasPermission = false;

        if ($moduleKeys !== []) {
            $hasPermission = $user->roleModel()
                ->whereHas('modules', function ($query) use ($moduleKeys): void {
                    $query->whereIn('key', $moduleKeys);

                    if ($moduleKeys === ['management']) {
                        $query->orWhere('key', 'like', 'management-%');
                    }

                    if (count($moduleKeys) === 1 && str_starts_with($moduleKeys[0], 'management-')) {
                        $query->orWhere('key', 'management');
                    }
                })
                ->exists();
        }

        if (! $hasPermission) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden: module permission is required.',
            ], 403);
        }

        return $next($request);
    }
}
