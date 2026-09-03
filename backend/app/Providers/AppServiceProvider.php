<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $normalizedEmail = fn (Request $request, string $field): string => Str::lower(
            trim((string) $request->input($field, $request->query($field)))
        );
        $emailKey = fn (Request $request, string $field): string => hash(
            'sha256',
            $normalizedEmail($request, $field),
        );
        $sessionKey = fn (Request $request): string => hash(
            'sha256',
            $request->hasSession() ? $request->session()->getId() : 'stateless',
        );
        $userId = fn (Request $request): string => (string) $request->user()->getAuthIdentifier();
        $routeKey = fn (Request $request): string => (string) (
            $request->route()?->getName()
            ?? $request->route()?->uri()
            ?? 'unknown'
        );
        $rateLimited = fn (string $policy) => fn (Request $_request, array $headers) => response()
            ->json([
                'success' => false,
                'message' => 'Too many attempts. Please try again later.',
                'code' => 'RATE_LIMITED',
                'data' => [
                    'source' => 'laravel',
                    'policy' => $policy,
                ],
            ], 429, $headers)
            ->header('X-RateLimit-Policy', $policy)
            ->header('X-Response-Source', 'laravel');
        $limit = fn (int $attempts, string $key, string $policy): Limit => Limit::perMinute($attempts)
            ->by($key)
            ->response($rateLimited($policy));

        RateLimiter::for('login', fn (Request $request): array => [
            $limit(10, 'login-email:'.$emailKey($request, 'email'), 'login-email'),
            $limit(30, 'login-session:'.$sessionKey($request), 'login-session'),
            $limit(300, 'login-global', 'login-global'),
        ]);
        RateLimiter::for('public-read', fn (Request $request): Limit => $limit(
            600,
            'public-read:'.$routeKey($request),
            'public-read',
        ));
        RateLimiter::for('public-booking-otp', fn (Request $request): array => [
            $limit(1, 'booking-otp-email:'.$emailKey($request, 'email'), 'public-booking-otp-email'),
            $limit(10, 'booking-otp-session:'.$sessionKey($request), 'public-booking-otp-session'),
            $limit(120, 'booking-otp-global', 'public-booking-otp-global'),
        ]);
        RateLimiter::for('public-booking-verify', fn (Request $request): array => [
            $limit(10, 'booking-verify-token:'.hash('sha256', (string) $request->input('request_token')), 'public-booking-verify-token'),
            $limit(30, 'booking-verify-session:'.$sessionKey($request), 'public-booking-verify-session'),
            $limit(300, 'booking-verify-global', 'public-booking-verify-global'),
        ]);
        RateLimiter::for('public-feedback', fn (Request $request): array => [
            $limit(10, 'public-feedback-token:'.hash('sha256', (string) $request->input('token', $request->query('token'))), 'public-feedback-token'),
            $limit(30, 'public-feedback-session:'.$sessionKey($request), 'public-feedback-session'),
        ]);

        RateLimiter::for('polling', fn (Request $request): Limit => $limit(
            600,
            'poll:'.$userId($request).':'.$routeKey($request),
            'polling',
        ));

        RateLimiter::for('authenticated-read', fn (Request $request): Limit => $limit(
            600,
            'read:'.$userId($request).':'.$routeKey($request),
            'authenticated-read',
        ));

        RateLimiter::for('authenticated-write', fn (Request $request): Limit => $limit(
            30,
            'write:'.$userId($request),
            'authenticated-write',
        ));

        RateLimiter::for('booking-action', fn (Request $request): Limit => $limit(
            30,
            'booking:'.$userId($request),
            'booking-action',
        ));

        RateLimiter::for('logout', fn (Request $request): Limit => $limit(
            30,
            'logout:'.$userId($request),
            'logout',
        ));

        RateLimiter::for('forgot-password', fn (Request $request): array => [
            $limit(10, 'forgot-password-email:'.$emailKey($request, 'email'), 'forgot-password-email'),
            $limit(60, 'forgot-password-global', 'forgot-password-global'),
        ]);
        RateLimiter::for('reset-password', fn (Request $request): array => [
            $limit(30, 'reset-password-email:'.$emailKey($request, 'email'), 'reset-password-email'),
            $limit(120, 'reset-password-global', 'reset-password-global'),
        ]);
        RateLimiter::for('validate-reset-token', fn (Request $request): array => [
            $limit(30, 'validate-reset-token-email:'.$emailKey($request, 'email'), 'validate-reset-token-email'),
            $limit(120, 'validate-reset-token-global', 'validate-reset-token-global'),
        ]);

        $emailViews = [
            'html' => 'emails.auth-action',
            'text' => 'emails.auth-action-text',
        ];

        $resetPasswordUrl = function (User $user, string $token): string {
            $query = http_build_query([
                'email' => $user->getEmailForPasswordReset(),
                'token' => $token,
            ]);

            return rtrim((string) config('app.frontend_url'), '/').'/reset-password#'.$query;
        };

        ResetPassword::createUrlUsing($resetPasswordUrl);

        ResetPassword::toMailUsing(function (User $user, string $token) use ($emailViews, $resetPasswordUrl): MailMessage {
            return (new MailMessage)
                ->subject('Reset your TOL Barbershop password')
                ->view($emailViews, [
                    'preheader' => 'Use this secure link to reset your TOL Barbershop password.',
                    'heading' => 'Reset Password',
                    'customerName' => trim((string) $user->fullname) ?: 'there',
                    'intro' => 'We received a request to reset your TOL Barbershop password. Use the button below to choose a new one.',
                    'actionText' => 'Reset Password',
                    'actionUrl' => $resetPasswordUrl($user, $token),
                    'expiresIn' => (int) config('auth.passwords.'.config('auth.defaults.passwords').'.expire', 60),
                    'securityMessage' => "If you didn't request a password reset, you can safely ignore this email.",
                ]);
        });
    }
}
