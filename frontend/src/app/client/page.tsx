"use client";

import { useState, type ElementType } from "react";
import { Calendar, LayoutDashboard, LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Overview } from "@/layout/client/Overview";
import { Profile } from "@/layout/client/Profile";
import { MyAppointment } from "@/layout/client/MyAppointment";

type TabKey = "overview" | "appointments" | "profile";

export default function ClientPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  const navItems: { key: TabKey; icon: ElementType; label: string }[] = [
    { key: "overview", icon: LayoutDashboard, label: "Overview" },
    { key: "appointments", icon: Calendar, label: "My Appointment" },
    { key: "profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="min-h-screen w-screen flex">
      <div className="w-80 bg-primary flex flex-col justify-between text-sm sticky">
        <div className="flex space-x-2 items-center p-4 border-b border-slate-600">
          <Image src="/logo.svg" alt="Logo" height={40} width={40} />
          <h1 className="font-bold text-primary-foreground text-xl">
            Tols Barbershop
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.key
                  ? "bg-slate-800 text-white"
                  : "text-gray-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-600">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Link>
        </div>
      </div>

    {activeTab === 'overview' && <Overview/>}
    {activeTab === 'appointments' && <MyAppointment/>}
    {activeTab === 'profile' && <Profile/>}

    </div>
  );
}
