# Legacy Customer Account Flow Reference

This document records the customer-account experience before it is replaced by public guest booking. It is a preservation reference, not the target architecture.

## Current journey

1. A visitor opens `/`.
2. The landing header and hero direct the visitor to `/login` or `/register`.
3. Registration creates a `users` row with role `customer`, records Terms and Privacy acceptance, and sends an email-verification link.
4. The customer verifies the email at `/verify-email` and signs in at `/login`.
5. Sanctum establishes the authenticated SPA session and the frontend stores an `auth_role=customer` routing cookie.
6. The customer is redirected to `/customer` and can use the dashboard, booking, appointment history, notifications, support, feedback, and profile features.
7. Logout, password recovery, profile editing, password changes, push-notification settings, and account deactivation are all account-based.

## Public landing experience

Current public page: `/`

- `frontend/src/app/page.tsx` composes the landing page.
- `frontend/src/components/landing/LandingHeader.tsx` links to login and registration.
- `frontend/src/components/landing/HeroSection.tsx` sends the main booking CTA to login.
- `frontend/src/services/shared/landing.api.ts` loads services, gallery images, and public/featured feedback.
- `backend/app/Http/Controllers/PublicBootstrapController.php` supplies cached public landing content.
- `frontend/src/components/common/RedirectIfAuthenticated.tsx` redirects signed-in users to their role dashboard.

## Registration, verification, login, and recovery

Frontend routes and forms:

- `/register` → `RegisterForm.tsx`
- `/verify-email` → `VerifyEmailForm.tsx`
- `/change-registration-email` → `ChangeRegistrationEmailForm.tsx`
- `/login` → `LoginForm.tsx`
- `/forgot-password` → `ForgotPasswordForm.tsx`
- `/reset-password` → `ResetPasswordForm.tsx`
- Validation is centralized in `frontend/src/validations/auth.validation.ts`.
- Requests are centralized in `frontend/src/services/shared/auth.api.ts`.

Backend endpoints and handlers:

- `POST /api/v1/register` → `RegisterController::register`
- `GET|POST /api/v1/email/verify/{id}/{hash}` → verification handoff and confirmation
- `GET /api/v1/email/verify/status` → verification polling
- `POST /api/v1/email/verification-notification` → resend verification
- `POST /api/v1/email/change-registration-email` → change an unverified registration email
- `POST /api/v1/login` → Sanctum SPA login
- `POST /api/v1/forgot-password` → send password-reset link
- `POST /api/v1/reset-password` → reset password
- `POST /api/v1/reset-password/validate-token` → validate reset token

Important behavior:

- `User` implements `MustVerifyEmail`.
- Only customer login is blocked when email is unverified.
- Forgot/reset password currently works against the shared `users` table and therefore also provides staff account recovery.
- Registration records legal acceptance in `user_policy_acceptances`.
- Registration, login, verification, and reset actions have dedicated backend throttles.
- `frontend/src/proxy.ts` protects `/customer/*` using the `auth_role` cookie.
- `frontend/src/contexts/AuthContext.tsx` restores sessions and routes unauthorized users away from protected areas.

## Customer shell and navigation

`frontend/src/app/customer/layout.tsx` provides:

- Desktop responsive sidebar
- Mobile bottom navigation
- Unread-notification badge
- Support floating action button
- Browser push-notification prompt
- Realtime `EntityChange` polling subscriptions

Customer routes:

| Route | Feature |
|---|---|
| `/customer` | Dashboard and pending-feedback prompts |
| `/customer/appointment` | Single and group booking |
| `/customer/history` | Customer appointment history |
| `/customer/notification` | In-app appointment/support notifications |
| `/customer/support` | Customer support ticket history and chat |
| `/customer/profile` | Profile, password, push settings, logout, and deactivation |

## Dashboard

Main component: `frontend/src/layout/customer/Overview.tsx`

The dashboard derives these values from appointments belonging to the authenticated customer:

- Completed count
- Upcoming approved count
- Pending count
- Total completed-appointment spend
- Approved appointment cards
- Quick links to booking and profile
- Feedback modal for completed appointments without feedback

It refreshes appointment data through version-based realtime polling.

## Single booking

Frontend:

- Route: `/customer/appointment`
- Form: `frontend/src/forms/NewAppointmentForm.tsx`
- Service: `frontend/src/services/customer/appointment.api.ts`
- Validation: `frontend/src/validations/appointment.validation.ts`

The form currently:

- Reads full name, email, and contact number from the authenticated customer and disables those inputs.
- Loads active barbers, active services, booking settings, and occupied slots through authenticated endpoints.
- Allows dates from today through seven days ahead, excluding Sundays and configured closures.
- Uses service duration to prevent overlapping bookings.
- Sends `user_id`, service, barber, date, time, price, and optional notes.
- Forces customer-created appointments to `pending` on the backend.
- Redirects successful bookings to `/customer/history`.

Backend:

- `POST /api/v1/appointments`
- `AppointmentRequest`
- `AppointmentController::store`
- `AppointmentBookingService`

Integrity rules include:

- Authenticated customers may book only for their own `user_id`.
- Staff may create managed appointments or walk-ins.
- Only active customer, barber, and service records are accepted.
- Appointment date, opening hours, service duration, closures, and occupied intervals are revalidated server-side.
- Pending quota is enforced per customer.
- `active_slot_key` and a unique database index prevent concurrent double booking.
- Price and duration are taken from the service record rather than trusted from the client.
- Customer, service, and barber names are snapshotted on the appointment.

## Group booking

The same booking form supports a group mode.

- The authenticated customer is the booking contact and owner of every appointment in the batch.
- The number of slots is configurable up to the public booking-setting limit.
- Each group member selects a service and time; additional members have per-slot names.
- Every appointment shares a random `BATCH-*` identifier.
- Contact email and phone come from the authenticated booker.
- The server validates the entire batch atomically, including customer pending quota and slot collisions.
- Staff can approve or reject the batch together.

## Appointment history

Frontend:

- Route: `/customer/history`
- Component: `frontend/src/layout/customer/MyAppointment.tsx`
- Hook: `frontend/src/hooks/useAppointmentHistory.ts`

Backend:

- `GET /api/v1/appointments/history`
- `AppointmentHistoryRequest`
- `AppointmentController::history`

Customer history is scoped by authenticated `user_id` and supports search, status filtering, pagination, booking display IDs, batch member names, and feedback display.

## Notifications and push

Customer notification UI: `frontend/src/layout/customer/Notification.tsx`

Related endpoints:

- `GET /api/v1/notifications`
- `PATCH /api/v1/notifications/{id}/read`
- `PATCH /api/v1/notifications/read-all`
- `POST /api/v1/push/subscribe`
- `POST /api/v1/push/unsubscribe`
- `POST /api/v1/push/unsubscribe-all`
- `GET /api/v1/navigation-summary`

`AppointmentNotificationService` creates account-bound in-app notifications and browser pushes for pending, approved, rejected, cancelled, completed, no-show, rescheduled, and group-booking updates. Push links point to `/customer/notification`.

Staff notifications for new pending bookings are separate and should not be confused with customer notifications. They appear in admin/manager navigation and link to the staff appointment module.

Closed-date management also broadcasts account notifications to every active customer.

## Feedback and ratings

Customer flow:

- The dashboard requests `GET /api/v1/pending-feedback`.
- A completed appointment without feedback opens a rating dialog.
- `POST /api/v1/appointment-feedback` accepts a 1–5 rating and optional comment.
- Ownership is proven by the authenticated user matching `appointments.user_id`.
- One feedback row is maintained per appointment.

Staff/public flow:

- Admin and manager can list feedback and toggle featured status.
- Reports calculate overall, service, and barber rating metrics.
- Public landing testimonials read featured feedback or qualifying five-star feedback.
- Feedback stores `user_id`, `appointment_id`, and a customer-name snapshot.

## Customer support

Customer UI:

- `/customer/support`
- `SupportFab`
- `frontend/src/layout/customer/SupportHistory.tsx`
- `frontend/src/services/customer/support.api.ts`

Staff UI:

- `/admin/customer-service`
- `/manager/customer-service`
- Customer-service permission module
- Queue count in staff navigation

Support tickets are owned by `customer_id` referencing `users`. Authenticated ownership controls ticket viewing, creation, messaging, cancellation, and history. Notifications and assignment events also target customer user IDs.

## Profile and account lifecycle

Route: `/customer/profile`

Features:

- Edit name, email, and contact number
- Reverify a changed customer email
- Change password
- Manage browser push subscription
- Logout
- Deactivate account after active booking checks

Deactivation soft-deletes the customer user and removes sessions, tokens, password-reset rows, and push subscriptions. Historical appointments, feedback, support, notifications, and legal acceptance records may be retained through snapshots and soft-delete-aware relationships.

## Database ownership model

The current design treats a customer as a `users` record.

- `appointments.user_id` identifies the booking owner; it is nullable only for walk-ins.
- `appointment_feedback.user_id` identifies the reviewer.
- `support_tickets.customer_id` identifies the customer.
- `notifications.user_id` identifies the recipient.
- `push_subscriptions.user_id` identifies the browser-push recipient.
- `user_policy_acceptances.user_id` records account registration consent.
- Customer analytics and CRM group activity by `users.id` / `appointments.user_id`.

Appointment snapshots preserve display names after related records change or are soft-deleted, but email and phone are still normally read from the user relationship.

## Staff-side dependencies on customer accounts

The following staff features currently depend directly on customer `users` rows or appointment `user_id`:

- CRM customer directory and detail pages
- Dashboard total-customer count
- Reports: customers served, new customers, returning customers, repeat rate, and report PDF wording
- Appointment request cards and dialogs showing customer name, email, and phone
- Reschedule payloads requiring the appointment owner's `user_id`
- Appointment history customer search
- Customer-service queues and ticket ownership
- Feedback list customer lookup and search
- Rating analytics
- Customer in-app/push status notifications
- Closed-date broadcasts to all active customers

Staff appointment approval, rejection, cancellation, scheduling, service management, barber management, walk-ins, revenue reporting, and operational appointment history are not inherently dependent on customer login, but several serializers and forms still expect a customer user ID and must be adapted.

## Existing tests that preserve the flow

Relevant backend feature coverage includes:

- `EmailVerificationAndPasswordResetTest.php`
- `RegistrationConsentTest.php`
- `PasswordPolicyTest.php`
- `AccountDeactivationTest.php`
- `AppointmentIntegrityTest.php`
- `BookingConcurrencyTest.php`
- `GroupBookingCustomerNameTest.php`
- `AppointmentHistoryTest.php`
- `AppointmentFeedbackTest.php`
- `AppointmentNotificationTest.php`
- `CustomerListTest.php`
- `SupportPollingTest.php`
- `AnalyticsReportTest.php`
- `RateLimitingTest.php`

These tests describe behavior that must either be migrated to guest-booking equivalents or intentionally retired during the refactor.

