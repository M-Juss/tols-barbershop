import { CalendarDays, CheckCircle2, Clock, Settings, CalendarPlus } from "lucide-react";
import { StatCard } from "@/components/common/StatCard";

export function Overview() {
  return (
    <div className="w-full h-full bg-slate-100 p-6 font-sans">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's your appointment summary.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <StatCard
          label="Completed"
          value="3"
          icon={CheckCircle2}
          iconContainerClassName="bg-green-100"
          iconClassName="text-green-500"
        />
        <StatCard
          label="Upcoming"
          value="1"
          icon={CalendarDays}
          iconContainerClassName="bg-blue-100"
          iconClassName="text-blue-500"
        />
        <StatCard
          label="Pending"
          value="1"
          icon={Clock}
          iconContainerClassName="bg-yellow-100"
          iconClassName="text-yellow-500"
        />
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
        <h2 className="text-base font-bold text-gray-900">Upcoming Appointments</h2>
        <p className="text-gray-500 text-sm mb-4">Your scheduled appointments</p>

        {/* Appointment Card */}
        <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 rounded-xl p-2.5">
              <CalendarDays className="text-blue-500 w-5 h-5" strokeWidth={2} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-base">Premium Haircut + Beard Trim</p>
              <p className="text-gray-500 text-sm mt-0.5">Barber: Miguel Santos</p>
              <div className="flex items-center gap-4 mt-1.5 text-gray-500 text-sm">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-gray-400" strokeWidth={1.8} />
                  Apr 20, 2026
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-400" strokeWidth={1.8} />
                  10:00 AM
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <p className="font-bold text-gray-900 text-lg">₱350</p>
            <span className="bg-blue-100 text-blue-500 text-xs font-medium px-3 py-1 rounded-full">
              Upcoming
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-base font-bold text-gray-900">Quick Actions</h2>
        <p className="text-gray-500 text-sm mb-4">Manage your account and appointments</p>

        <div className="grid grid-cols-2 gap-4">
          {/* New Appointment */}
          <button className="bg-red-500 hover:bg-red-600 transition-colors rounded-xl px-5 py-4 flex items-center gap-4 text-left">
            <div className="bg-red-400 rounded-lg p-2">
              <CalendarPlus className="text-white w-5 h-5" strokeWidth={2} />
            </div>
            <div>
              <p className="text-white font-bold text-sm">New Appointment</p>
              <p className="text-red-100 text-xs mt-0.5">Book your next visit</p>
            </div>
          </button>

          {/* Profile Settings */}
          <button className="bg-slate-800 hover:bg-slate-700 transition-colors rounded-xl px-5 py-4 flex items-center gap-4 text-left">
            <div className="bg-slate-600 rounded-lg p-2">
              <Settings className="text-white w-5 h-5" strokeWidth={2} />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Profile Settings</p>
              <p className="text-slate-400 text-xs mt-0.5">Update your information</p>
            </div>
          </button>
        </div>
      </div>

    </div>
  );
}
