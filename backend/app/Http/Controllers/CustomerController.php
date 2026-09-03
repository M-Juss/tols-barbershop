<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerListRequest;
use App\Http\Resources\CustomerResource;
use App\Http\Resources\CustomerResourceDetail;
use App\Models\Appointment;
use App\Models\BookingCustomer;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
    use ApiResponseTrait;

    public function index(CustomerListRequest $request)
    {
        $validated = $request->validated();
        $baseQuery = BookingCustomer::query();
        $totalCustomers = (clone $baseQuery)->count();
        $newThisMonth = (clone $baseQuery)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        $recentCutoff = now()->subDays(60)->toDateString();
        $activeCount = (clone $baseQuery)
            ->where(function ($query) use ($recentCutoff): void {
                $query->whereDoesntHave('appointments', fn ($appointments) => $appointments->withTrashed()->where('status', 'completed'))
                    ->orWhereHas('appointments', fn ($appointments) => $appointments->withTrashed()->where('status', 'completed')->where('appointment_date', '>=', $recentCutoff));
            })
            ->count();

        $query = $this->customerMetricsQuery();

        if (! empty($validated['search'])) {
            $like = '%'.str_replace(['!', '%', '_'], ['!!', '!%', '!_'], $validated['search']).'%';
            $query->where(function ($customerQuery) use ($like): void {
                $customerQuery->whereRaw("fullname LIKE ? ESCAPE '!'", [$like])
                    ->orWhereRaw("email LIKE ? ESCAPE '!'", [$like])
                    ->orWhereRaw("contact_number LIKE ? ESCAPE '!'", [$like]);
            });
        }

        if (($validated['status'] ?? null) === 'active') {
            $query->where(function ($customerQuery) use ($recentCutoff): void {
                $customerQuery->whereDoesntHave('appointments', fn ($appointments) => $appointments->withTrashed()->where('status', 'completed'))
                    ->orWhereHas('appointments', fn ($appointments) => $appointments->withTrashed()->where('status', 'completed')->where('appointment_date', '>=', $recentCutoff));
            });
        } elseif (($validated['status'] ?? null) === 'inactive') {
            $query->whereHas('appointments', fn ($appointments) => $appointments->withTrashed()->where('status', 'completed'))
                ->whereDoesntHave('appointments', fn ($appointments) => $appointments->withTrashed()->where('status', 'completed')->where('appointment_date', '>=', $recentCutoff));
        }

        $sortField = $validated['sort'] ?? 'fullname';
        $sortDirection = $validated['dir'] ?? 'asc';
        $customers = $query
            ->orderBy($sortField, $sortDirection)
            ->orderBy('id', $sortDirection)
            ->paginate($validated['per_page'] ?? 15, ['*'], 'page', $validated['page'] ?? 1);

        return $this->success('Customers retrieved successfully.', [
            'customers' => CustomerResource::collection($customers),
            'meta' => [
                'current_page' => $customers->currentPage(),
                'last_page' => $customers->lastPage(),
                'per_page' => $customers->perPage(),
                'total' => $customers->total(),
            ],
            'stats' => [
                'total_customers' => $totalCustomers,
                'new_this_month' => $newThisMonth,
                'active_count' => $activeCount,
                'inactive_count' => $totalCustomers - $activeCount,
            ],
        ]);
    }

    public function show(string $id)
    {
        $customer = $this->customerMetricsQuery()->findOrFail($id);

        $servicePreferences = Appointment::withTrashed()
            ->select([DB::raw('services.name as service_name'), DB::raw('COUNT(*) as count')])
            ->join('services', 'services.id', '=', 'appointments.service_id')
            ->where('appointments.booking_customer_id', $customer->id)
            ->where('appointments.status', 'completed')
            ->groupBy('services.name')
            ->orderByDesc('count')
            ->get();
        $customer->setRelation('servicePreferences', $servicePreferences);

        $barberPreferences = Appointment::withTrashed()
            ->select([DB::raw('barbers.fullname as barber_name'), DB::raw('COUNT(*) as count')])
            ->join('users as barbers', 'barbers.id', '=', 'appointments.barber_user_id')
            ->where('appointments.booking_customer_id', $customer->id)
            ->where('appointments.status', 'completed')
            ->groupBy('barbers.fullname')
            ->orderByDesc('count')
            ->get();
        $customer->setRelation('barberPreferences', $barberPreferences);

        $customer->setRelation('recentAppointments', Appointment::with(['service:id,name', 'barber:id,fullname'])
            ->where('booking_customer_id', $customer->id)
            ->latest('appointment_date')
            ->latest('appointment_time')
            ->limit(3)
            ->get());

        return $this->success('Customer retrieved successfully.', [
            'customer' => new CustomerResourceDetail($customer),
        ]);
    }

    private function customerMetricsQuery()
    {
        return BookingCustomer::query()
            ->withCount(['appointments as total_visits' => fn ($query) => $query->withTrashed()->where('status', 'completed')])
            ->withCount(['appointments as no_show_count' => fn ($query) => $query->withTrashed()->where('status', 'no_show')])
            ->withCount(['appointments as cancelled_count' => fn ($query) => $query->withTrashed()->where('status', 'cancelled')])
            ->withSum(['appointments as lifetime_value' => fn ($query) => $query->withTrashed()->where('status', 'completed')], 'price')
            ->withAvg('feedback as average_rating', 'rating')
            ->addSelect([
                'last_visit_date' => Appointment::withTrashed()->select('appointment_date')
                    ->whereColumn('booking_customer_id', 'booking_customers.id')
                    ->where('status', 'completed')
                    ->latest('appointment_date')
                    ->limit(1),
            ]);
    }
}
