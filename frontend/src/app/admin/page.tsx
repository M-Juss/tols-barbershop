"use client";

import { useState, type ElementType } from "react";
import {
  User,
  Calendar,
  LayoutDashboard,
  LogOut,
  History
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Overview } from "@/layout/admin/Overview";
import { Appointment } from "@/layout/admin/Appointment";
import { Walkin } from "@/layout/admin/Walkin";
import { Historical } from "@/layout/admin/Historical";

type TabKey = "overview" | "appointment" | "walkin" | "historical";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  const navItems: { key: TabKey; icon: ElementType; label: string }[] = [
    { key: "overview", icon: LayoutDashboard, label: "Overview" },
    { key: "appointment", icon: Calendar, label: "Appointment" },
    { key: "walkin", icon: User, label: "Walk-ins" },
    { key: "historical", icon: History, label: "History" }
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
        {activeTab === "appointment" && <Appointment />}
        {activeTab === "walkin" && <Walkin />}
        {activeTab === "historical" && <Historical />}
      </main>
    </div>
  );
}
