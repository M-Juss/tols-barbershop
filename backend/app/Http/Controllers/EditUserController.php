<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChangeInformationRequest;
use App\Http\Requests\ChangePasswordRequest;
use App\Http\Resources\UserResource;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Laravel\Sanctum\PersonalAccessToken;

class EditUserController extends Controller
{
    use ApiResponseTrait;

    public function currentUser(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user) {
            return $this->error('Not authenticated.', [], 401);
        }

        return $this->success('User retrieved successfully.', new UserResource($user));
    }

    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();
        $currentAccessToken = $user->currentAccessToken();
        $currentSessionId = $request->hasSession() ? $request->session()->getId() : null;

        DB::transaction(function () use ($currentAccessToken, $currentSessionId, $user, $validated): void {
            $user->forceFill([
                'password' => $validated['password'],
                'remember_token' => Str::random(60),
            ])->save();

            $tokens = $user->tokens();
            if ($currentAccessToken instanceof PersonalAccessToken) {
                $tokens->whereKeyNot($currentAccessToken->getKey());
            }
            $tokens->delete();

            if (config('session.driver') === 'database') {
                $sessions = DB::table((string) config('session.table', 'sessions'))
                    ->where('user_id', $user->id);

                if ($currentSessionId) {
                    $sessions->where('id', '!=', $currentSessionId);
                }

                $sessions->delete();
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Password updated successfully.',
            'data' => null,
        ]);
    }

    public function changeInformation(ChangeInformationRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();
        $updates = [
            'fullname' => $validated['fullname'],
            'email' => $validated['email'],
            'contact_number' => array_key_exists('contact_number', $validated)
                ? $validated['contact_number']
                : $user->contact_number,
        ];

        $user->forceFill($updates)->save();

        return response()->json([
            'success' => true,
            'message' => 'Information updated successfully.',
            'data' => new UserResource($user),
        ]);
    }
}
