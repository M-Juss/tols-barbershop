import { useState } from "react";
import { Plus } from "lucide-react";
import { AppointmentCard, type AppointmentStatus } from "@/components/common/AppointmentCard";
import { NewAppointmentForm } from "@/forms/NewAppointmentForm";

type Status = AppointmentStatus;

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

const tabs: Status[] = ["Upcoming", "Pending", "Completed", "Rejected"];

function countByStatus(status: Status) {
  return mockAppointments.filter((a) => a.status === status).length;
}

// ── Appointment List View ──────────────────────────────────────────────────
export function AppointmentList({ onNew }: { onNew: () => void }) {
  const [activeTab, setActiveTab] = useState<Status>("Upcoming");

  const filtered = mockAppointments.filter((a) => a.status === activeTab);

  return (
    <div className="w-full h-full bg-slate-100 p-6 font-sans">
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
            <AppointmentCard
              key={apt.id}
              service={apt.service}
              barber={apt.barber}
              price={apt.price}
              status={apt.status}
              date={apt.date}
              time={apt.time}
              client={apt.client}
            />
          ))
        )}
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
