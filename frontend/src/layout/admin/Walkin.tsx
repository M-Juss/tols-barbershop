import { UserPlus, Phone, User, CalendarDays, CircleCheckBig } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

type WalkIn = {
  id: number;
  name: string;
  phone: string;
  service: string;
  barber: string;
  price: string;
  completedAt: Date;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const SERVICES = [
  { label: "Regular Haircut", price: "₱200" },
  { label: "Premium Haircut", price: "₱350" },
  { label: "Beard Trim",      price: "₱150" },
  { label: "Hair + Beard",    price: "₱450" },
  { label: "Kids Haircut",    price: "₱150" },
];

const BARBERS = [
  "Miguel Santos",
  "Carlos Reyes",
  "Ramon Cruz",
  "Jose Dela Cruz",
];

const MOCK_HISTORY: WalkIn[] = [
  { id: 1, name: "Michael Reyes",    phone: "+63 912 345 6789", service: "Regular Haircut", barber: "Miguel Santos",  price: "₱200", completedAt: new Date(Date.now() - 2  * 60 * 60 * 1000) },
  { id: 2, name: "John Santos",      phone: "+63 923 456 7890", service: "Premium Haircut", barber: "Carlos Reyes",  price: "₱350", completedAt: new Date(Date.now() - 3  * 60 * 60 * 1000) },
  { id: 3, name: "Ramon Villanueva", phone: "+63 934 567 8901", service: "Beard Trim",      barber: "Ramon Cruz",    price: "₱150", completedAt: new Date(Date.now() - 5  * 60 * 60 * 1000) },
  { id: 4, name: "Carlo Mendoza",    phone: "+63 945 678 9012", service: "Hair + Beard",    barber: "Miguel Santos", price: "₱450", completedAt: new Date(Date.now() - 7  * 60 * 60 * 1000) },
  { id: 5, name: "Luis Garcia",      phone: "+63 956 789 0123", service: "Kids Haircut",    barber: "Jose Dela Cruz", price: "₱150", completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60)    return "just now";
  if (diff < 3600)  return `about ${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `about ${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

// ─── Walk-in History Card ─────────────────────────────────────────────────────

function WalkInCard({ walkin }: { walkin: WalkIn }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-5 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-gray-400" />
              <span className="font-semibold text-gray-900 text-sm">{walkin.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-sm text-gray-500">{walkin.phone}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
            <span>Service: {walkin.service}</span>
            <span className="text-gray-300">•</span>
            <span>Barber: {walkin.barber}</span>
            <span className="text-gray-300">•</span>
            <span>$ {walkin.price}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Completed {timeAgo(walkin.completedAt)}</span>
          </div>
        </div>
        <span className="flex-shrink-0 text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-600">
          Completed
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Walkin() {
  return (
    <div className="w-full bg-slate-100 p-6 font-sans min-h-screen">

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Walk-ins</h1>
        <p className="text-gray-500 mt-1">Record walk-in appointments and view history</p>
      </div>

      {/* ── New Walk-in Form ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <UserPlus className="w-5 h-5 text-gray-700" />
          <h2 className="text-base font-bold text-gray-900">New Walk-in Appointment</h2>
        </div>
        <p className="text-sm text-gray-400 mb-6">Create a walk-in appointment with auto-completed status</p>

        <div className="grid grid-cols-2 gap-x-6 gap-y-5">

          {/* Client Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="client-name" className="text-sm font-medium text-gray-700">
              Client Name <span className="text-red-500">*</span>
            </Label>
            <Input id="client-name" placeholder="Enter client name" />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input id="phone" placeholder="+63 XXX XXX XXXX" />
          </div>

          {/* Service */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Service <span className="text-red-500">*</span>
            </Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {SERVICES.map(s => (
                  <SelectItem key={s.label} value={s.label}>
                    {s.label} — {s.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Barber */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Barber <span className="text-red-500">*</span>
            </Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a barber" />
              </SelectTrigger>
              <SelectContent>
                {BARBERS.map(b => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

        </div>

        <div className="flex justify-end mt-6">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 gap-2">
            <CircleCheckBig className="w-4 h-4" />
            Complete Walk-in
          </Button>
        </div>
      </div>

      {/* ── Walk-in History ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-900">Walk-in History</h2>
        <p className="text-sm text-gray-400 mb-4">
          Recent walk-in appointments ({MOCK_HISTORY.length} total)
        </p>
        <div className="flex flex-col gap-3">
          {MOCK_HISTORY.map(w => (
            <WalkInCard key={w.id} walkin={w} />
          ))}
        </div>
      </div>

    </div>
  );
}