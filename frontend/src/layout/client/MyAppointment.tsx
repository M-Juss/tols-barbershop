import { useState } from "react";
import { CalendarDays, ChevronDown, ArrowLeft, Plus, Trash2 } from "lucide-react";

type Status = "Upcoming" | "Pending" | "Completed" | "Rejected";

interface Appointment {
  id: number;
  service: string;
  barber: string;
  price: number;
  status: Status;
  date: string;
  time: string;
  client: string;
}

const mockAppointments: Appointment[] = [
  {
    id: 1,
    service: "Premium Haircut + Beard Trim",
    barber: "Miguel Santos",
    price: 350,
    status: "Upcoming",
    date: "Apr 20, 2026",
    time: "10:00 AM",
    client: "John Dela Cruz",
  },
  {
    id: 2,
    service: "Classic Haircut",
    barber: "Ramon Villanueva",
    price: 200,
    status: "Pending",
    date: "Apr 22, 2026",
    time: "2:00 PM",
    client: "John Dela Cruz",
  },
  {
    id: 3,
    service: "Hair Color + Treatment",
    barber: "Miguel Santos",
    price: 850,
    status: "Completed",
    date: "Mar 15, 2026",
    time: "11:00 AM",
    client: "John Dela Cruz",
  },
  {
    id: 4,
    service: "Beard Styling",
    barber: "Carlo Reyes",
    price: 150,
    status: "Completed",
    date: "Feb 28, 2026",
    time: "3:30 PM",
    client: "John Dela Cruz",
  },
  {
    id: 5,
    service: "Kids Haircut",
    barber: "Ramon Villanueva",
    price: 120,
    status: "Completed",
    date: "Jan 10, 2026",
    time: "9:00 AM",
    client: "John Dela Cruz",
  },
  {
    id: 6,
    service: "Hot Towel Shave",
    barber: "Carlo Reyes",
    price: 250,
    status: "Rejected",
    date: "Apr 18, 2026",
    time: "1:00 PM",
    client: "John Dela Cruz",
  },
];

const statusBadge: Record<Status, string> = {
  Upcoming: "bg-blue-100 text-blue-500",
  Pending: "bg-yellow-100 text-yellow-600",
  Completed: "bg-green-100 text-green-600",
  Rejected: "bg-red-100 text-red-500",
};

const tabs: Status[] = ["Upcoming", "Pending", "Completed", "Rejected"];

function countByStatus(status: Status) {
  return mockAppointments.filter((a) => a.status === status).length;
}

// ── Appointment List View ──────────────────────────────────────────────────
export function AppointmentList({ onNew }: { onNew: () => void }) {
  const [activeTab, setActiveTab] = useState<Status>("Upcoming");

  const filtered = mockAppointments.filter((a) => a.status === activeTab);

  return (
    <div className="w-full bg-slate-100 p-6 font-sans">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-500 mt-1">View and manage your appointments</p>
        </div>
        <button
          onClick={onNew}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 transition-colors text-white font-semibold rounded-xl px-5 py-3 text-sm"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          New Appointment
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl flex p-1 gap-1 mb-4 shadow-sm border border-gray-100 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === tab
                ? "bg-gray-100 text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab} ({countByStatus(tab)})
          </button>
        ))}
      </div>

      {/* Appointment Cards */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center text-gray-400 border border-gray-100 shadow-sm">
            No {activeTab.toLowerCase()} appointments.
          </div>
        ) : (
          filtered.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 rounded-xl p-2.5 shrink-0">
                    <CalendarDays className="text-blue-500 w-5 h-5" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-base">{apt.service}</p>
                    <p className="text-gray-500 text-sm">Barber: {apt.barber}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <p className="font-bold text-gray-900 text-lg">₱{apt.price}</p>
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${statusBadge[apt.status]}`}
                  >
                    {apt.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">Date & Time</p>
                  <p className="text-gray-900 font-semibold text-sm">
                    {apt.date} at {apt.time}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">Client</p>
                  <p className="text-gray-900 font-semibold text-sm">{apt.client}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

// ── New Appointment Form View ──────────────────────────────────────────────
function NewAppointmentForm({ onBack }: { onBack: () => void }) {
  return (
    <div className="w-full bg-slate-100 p-6 font-sans">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-gray-700 font-medium text-sm mb-6 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2} />
        Back to Appointments
      </button>

      {/* Form Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-base font-bold text-gray-900">New Appointment</h2>
        <p className="text-gray-500 text-sm mt-0.5 mb-6">
          Fill in the details to book your appointment
        </p>

        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1.5">Full Name</label>
            <input
              type="text"
              placeholder="John Dela Cruz"
              className="w-full bg-gray-100 rounded-lg px-3 py-2.5 text-gray-400 text-sm outline-none"
              readOnly
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1.5">Email</label>
            <input
              type="email"
              placeholder="john.delacruz@email.com"
              className="w-full bg-gray-100 rounded-lg px-3 py-2.5 text-gray-400 text-sm outline-none"
              readOnly
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1.5">Contact Number</label>
            <input
              type="text"
              placeholder="+63 912 345 6789"
              className="w-full bg-gray-100 rounded-lg px-3 py-2.5 text-gray-400 text-sm outline-none"
              readOnly
            />
          </div>

          {/* Service */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1.5">Service</label>
            <div className="flex items-center justify-between bg-gray-100 rounded-lg px-3 py-2.5 text-gray-400 text-sm cursor-pointer">
              <span>Select a service</span>
              <ChevronDown className="w-4 h-4 shrink-0" strokeWidth={2} />
            </div>
          </div>

          {/* Barber */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1.5">Barber</label>
            <div className="flex items-center justify-between bg-gray-100 rounded-lg px-3 py-2.5 text-gray-400 text-sm cursor-pointer">
              <span>Select a barber</span>
              <ChevronDown className="w-4 h-4 shrink-0" strokeWidth={2} />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1.5">Date</label>
            <div className="flex items-center gap-2.5 bg-gray-100 rounded-lg px-3 py-2.5 text-gray-400 text-sm cursor-pointer">
              <CalendarDays className="w-4 h-4 shrink-0" strokeWidth={1.8} />
              <span>Pick a date</span>
            </div>
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1.5">Time</label>
            <div className="flex items-center justify-between bg-gray-100 rounded-lg px-3 py-2.5 text-gray-400 text-sm cursor-pointer">
              <span>Select time</span>
              <ChevronDown className="w-4 h-4 shrink-0" strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-8">
          <button className="flex-1 bg-red-500 hover:bg-red-600 transition-colors text-white font-semibold rounded-xl py-3 text-sm">
            Book Appointment
          </button>
          <button
            onClick={onBack}
            className="border border-gray-200 rounded-xl px-6 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Help Button */}
      <div className="flex justify-end mt-4">
        <button className="bg-gray-700 hover:bg-gray-600 transition-colors text-white rounded-full w-9 h-9 flex items-center justify-center text-base font-bold shadow-md">
          ?
        </button>
      </div>
    </div>
  );
}

// ── Root Component ─────────────────────────────────────────────────────────
export function MyAppointment() {
  const [view, setView] = useState<"list" | "new">("list");

  return view === "list" ? (
    <AppointmentList onNew={() => setView("new")} />
  ) : (
    <NewAppointmentForm onBack={() => setView("list")} />
  );
}