"use client";

import { ArrowLeft } from "lucide-react";

import { DatePickerWithLabel } from "@/components/common/DatePickerWithLabel";
import { InputWithLabel } from "@/components/common/InputWithLabel";
import { SelectWithLabel } from "@/components/common/SelectWithLabel";

type NewAppointmentFormProps = {
  onBack: () => void;
};

const serviceOptions = [
  { value: "classic-haircut", label: "Classic Haircut" },
  { value: "premium-haircut-beard-trim", label: "Premium Haircut + Beard Trim" },
  { value: "beard-styling", label: "Beard Styling" },
  { value: "hair-color-treatment", label: "Hair Color + Treatment" },
];

const barberOptions = [
  { value: "miguel-santos", label: "Miguel Santos" },
  { value: "ramon-villanueva", label: "Ramon Villanueva" },
  { value: "carlo-reyes", label: "Carlo Reyes" },
];

const timeOptions = [
  { value: "09:00-am", label: "9:00 AM" },
  { value: "10:00-am", label: "10:00 AM" },
  { value: "11:00-am", label: "11:00 AM" },
  { value: "01:00-pm", label: "1:00 PM" },
  { value: "02:00-pm", label: "2:00 PM" },
  { value: "03:30-pm", label: "3:30 PM" },
];

export function NewAppointmentForm({ onBack }: NewAppointmentFormProps) {
  return (
    <div className="w-full h-full bg-slate-100 p-6 font-sans">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-gray-700 font-medium text-sm mb-6 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2} />
        Back to Appointments
      </button>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-base font-bold text-gray-900">New Appointment</h2>
        <p className="text-gray-500 text-sm mt-0.5 mb-6">
          Fill in the details to book your appointment
        </p>

        <form className="grid grid-cols-2 gap-x-6 gap-y-5">
          <div className="col-span-2">
            <InputWithLabel
              id="full-name"
              label="Full Name"
              value="John Dela Cruz"
              disabled
              className="h-10 bg-gray-100 border-gray-200 text-gray-500"
            />
          </div>

          <InputWithLabel
            id="email"
            type="email"
            label="Email"
            value="john.delacruz@email.com"
            disabled
            className="h-10 bg-gray-100 border-gray-200 text-gray-500"
          />

          <InputWithLabel
            id="contact-number"
            label="Contact Number"
            value="+63 912 345 6789"
            disabled
            className="h-10 bg-gray-100 border-gray-200 text-gray-500"
          />

          <SelectWithLabel
            id="service"
            label="Service"
            placeholder="Select a service"
            options={serviceOptions}
          />

          <SelectWithLabel
            id="barber"
            label="Barber"
            placeholder="Select a barber"
            options={barberOptions}
          />

          <DatePickerWithLabel id="date" label="Date" placeholder="Pick a date" />

          <SelectWithLabel
            id="time"
            label="Time"
            placeholder="Select time"
            options={timeOptions}
          />
        </form>

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

      <div className="flex justify-end mt-4">
        <button className="bg-gray-700 hover:bg-gray-600 transition-colors text-white rounded-full w-9 h-9 flex items-center justify-center text-base font-bold shadow-md">
          ?
        </button>
      </div>
    </div>
  );
}
