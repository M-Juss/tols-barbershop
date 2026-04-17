import { Plus } from "lucide-react";
import { TimeSlots } from "@/components/common/TimeSlots";
import { CloseDates } from "@/components/common/ClosedDates";
import { ActivityLog } from "@/components/common/ActivityLog";

export function Slots() {
  const MOCK_CLOSED_DATES = [
    { label: "April 17, 2026" },
    { label: "April 18, 2026" },
    { label: "April 19, 2026" },
  ];

  const MOCK_TIME = [
    { label: "9:00 AM" },
    { label: "10:00 AM" },
    { label: "11:00 AM" },
    { label: "1:00 AM" },
    { label: "2:00 AM" },
    { label: "3:00 AM" },
    { label: "4:00 AM" },
    { label: "5:00 AM" },
    { label: "6:00 AM" },
    { label: "7:00 AM" },
  ];

  const MOCK_ACTIVITY_LOGS = [
    {
      action: "Closed date added",
      details: "Manager marked April 17, 2026 as unavailable.",
      time: "8:15 AM",
    },
    {
      action: "Time slot removed",
      details: "The 10:00 AM slot was removed from weekday schedule.",
      time: "9:40 AM",
    },
    {
      action: "Time slot added",
      details: "Added a new 6:00 PM appointment slot.",
      time: "11:05 AM",
    },
    {
      action: "Closed date removed",
      details: "April 19, 2026 was reopened for bookings.",
      time: "1:20 PM",
    },
    {
      action: "Schedule updated",
      details: "Adjusted afternoon slots for weekend availability.",
      time: "3:45 PM",
    },
  ];

  return (
    <div className="w-full h-full bg-slate-100 p-4 sm:p-6 font-sans">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Appointment Slots
          </h1>
          <p className="text-gray-700 mt-1 text-sm sm:text-base">
            Manage your calendar availablity and time slots
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between mb-6">
            <div className="flex flex-col">
              <p className="font-semibold">Closed Dates</p>
              <p className="text-gray-700">Mark days when the shop is closed</p>
            </div>
            <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 transition-colors text-white font-semibold rounded-xl px-5 py-3 text-sm">
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Close Dates
            </button>
          </div>
          <div className="space-y-2">
            {MOCK_CLOSED_DATES.map((date) => (
              <CloseDates key={date.label} label={date.label} />
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between mb-6">
            <div className="flex flex-col">
              <p className="font-semibold">Time Slots</p>
              <p className="text-gray-700">
                Configure available appointment times
              </p>
            </div>
            <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 transition-colors text-white font-semibold rounded-xl px-5 py-3 text-sm">
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Add Slot
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 overflow-y-auto">
            {MOCK_TIME.map((time) => (
              <TimeSlots key={time.label} label={time.label} />
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
        <p className="font-semibold">Activity Log</p>
        <p className="text-gray-700 mb-6">Recent changes to appointment slots</p>
        <div className="space-y-3 overflow-y-auto">
          {MOCK_ACTIVITY_LOGS.map((log, index) => (
            <ActivityLog
              key={`${log.action}-${index}`}
              action={log.action}
              details={log.details}
              time={log.time}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
