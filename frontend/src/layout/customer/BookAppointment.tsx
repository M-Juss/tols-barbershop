"use client";

import { NewAppointmentForm } from "@/forms/NewAppointmentForm";

export function BookAppointment() {
  return (
    <div className="w-full h-full bg-slate-100 p-6 font-sans">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">
          Book New Appointment
        </h2>
        <p className="text-gray-500 mt-1">
          Fill in the details to book your appointment
        </p>
      </div>

      <NewAppointmentForm />
    </div>
  );
}
