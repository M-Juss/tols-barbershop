# Customer Module Legacy Reference

This document preserves the staff-facing Customer/CRM module while it is temporarily disabled. The module is hidden from the admin and manager UI because customer data may currently be inconsistent. Customer records and the backend implementation are intentionally retained so the module can be restored without redesigning the booking flow.

## Current status

The following staff-facing routes are disabled by removing their Next.js route files:

- `/admin/customers`
- `/admin/customers/{id}`
- `/manager/customers`
- `/manager/customers/{id}`

The Customers item and Relations navigation group were removed from both staff sidebars. The Customer module is also omitted from the role-permission editor categories.

No customer records, booking relationships, feedback records, or analytics data were deleted.

## Preserved frontend implementation

- `frontend/src/layout/manager/CustomerDirectory.tsx` — paginated customer directory with search, active/inactive filtering, summary cards, sorting, and responsive list/table views.
- `frontend/src/layout/manager/CustomerDetail.tsx` — customer profile, visit metrics, service/barber preferences, and recent appointments.
- `frontend/src/services/manager/customers.api.ts` — list and detail API clients and their TypeScript types.

The deleted route files were thin wrappers around these preserved components and can be recreated when the module is ready to return.

## Preserved backend implementation

- `backend/app/Http/Controllers/CustomerController.php`
- `backend/app/Http/Requests/CustomerListRequest.php`
- `backend/app/Http/Resources/CustomerResource.php`
- `backend/app/Http/Resources/CustomerResourceDetail.php`
- `backend/app/Models/BookingCustomer.php`

The existing staff endpoints remain available for controlled restoration/testing:

- `GET /api/v1/customers`
- `GET /api/v1/customers/{id}`

They remain protected by `auth:sanctum`, staff role checks, the `crm` module permission, and authenticated-read throttling. They are not called by the current frontend because the routes and navigation entry are disabled.

## Data and dependencies that must remain

Do not remove or rename these records while the module is disabled:

- `booking_customers` — the email-based customer identity used by public booking.
- `appointments.booking_customer_id` — booking ownership and customer snapshots.
- `appointment_feedback.booking_customer_id` — the one-rating-per-booking relationship.
- Customer fields in appointment snapshots — used by appointment cards, history search, exports, and reports.
- Customer metrics in dashboard and Reports & Analytics — these are not the staff Customer directory and remain active.

Public booking, appointment management, history, feedback, email delivery, and reporting must continue to work without the Customer pages.

## Restoration checklist

1. Recreate the four route wrappers under `frontend/src/app/admin/customers` and `frontend/src/app/manager/customers` using the preserved components.
2. Restore the Customers items and Relations group in `frontend/src/app/admin/layout.tsx` and `frontend/src/app/manager/layout.tsx`.
3. Restore the `Relations`/`crm` category in `frontend/src/layout/manager/Admin.tsx` so managers can assign the permission again.
4. Confirm the `crm` module exists in `backend/database/seeders/ModuleSeeder.php` and that the CustomerController routes are present in `backend/routes/api.php`.
5. Reconcile `booking_customers` using verified email and appointment snapshots before showing the directory again.
6. Run frontend lint, typecheck, and build, then backend Pint and the CustomerList feature tests.

## Related references

- `CUSTOMER_FLOW_LEGACY_REFERENCE.md` — retired customer account/portal flow and its migration to public guest booking.
- `backend/tests/Feature/CustomerListTest.php` — endpoint coverage for the preserved CRM API.
