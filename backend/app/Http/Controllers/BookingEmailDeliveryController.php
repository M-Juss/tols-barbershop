<?php

namespace App\Http\Controllers;

use App\Models\BookingEmailDelivery;
use App\Services\BookingEmailService;
use App\Traits\ApiResponseTrait;

class BookingEmailDeliveryController extends Controller
{
    use ApiResponseTrait;

    public function resend(BookingEmailDelivery $delivery, BookingEmailService $emailService)
    {
        if ($delivery->status !== 'failed') {
            return $this->error('Only failed emails can be resent.', [], 422);
        }

        $sent = $emailService->send($delivery);

        return $sent
            ? $this->success('Email sent successfully.', ['delivery' => $delivery->refresh()])
            : $this->error('Email delivery failed again.', ['delivery' => $delivery->refresh()], 502);
    }
}
