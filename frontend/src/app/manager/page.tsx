"use client";

import { useState, type ElementType } from "react";
import {
  User,
  Calendar,
  LayoutDashboard,
  LogOut,
  Scissors,
  BriefcaseBusiness,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Overview } from "@/layout/manager/Overview";
import { Service } from "@/layout/manager/Service";
import { Barber } from "@/layout/manager/Barber";
import { Admin } from "@/layout/manager/Admin";
import { Slots } from "@/layout/manager/Slots";

type TabKey = "overview" | "service" | "barber" | "admin" | "slots";

export default function ClientPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  const navItems: { key: TabKey; icon: ElementType; label: string }[] = [
    { key: "overview", icon: LayoutDashboard, label: "Overview" },
    { key: "service", icon: BriefcaseBusiness, label: "Service" },
    { key: "barber", icon: Scissors, label: "Barber" },
    { key: "admin", icon: User, label: "Admin" },
    { key: "slots", icon: Calendar, label: "Appointment Slots" },
  ];

  return (
    <div className="h-screen w-full flex overflow-hidden">
      <aside className="w-80 shrink-0 h-screen bg-primary flex flex-col justify-between text-sm sticky top-0">
        <div className="flex space-x-2 items-center p-4 border-b border-slate-600">
          <Image src="/logo.svg" alt="Logo" height={40} width={40} />
          <h1 className="font-bold text-primary-foreground text-xl">
            Tols Barbershop
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
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
      </aside>

      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        {activeTab === "overview" && <Overview />}
        {activeTab === "service" && <Service />}
        {activeTab === "barber" && <Barber />}
        {activeTab === "admin" && <Admin />}
        {activeTab === "slots" && <Slots />}
      </main>
    </div>
  );
}
