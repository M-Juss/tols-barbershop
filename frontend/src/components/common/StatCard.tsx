import type { ElementType, ReactNode } from "react";

interface StatCardProps {
  label: ReactNode;
  value: ReactNode;
  icon: ElementType;
  iconContainerClassName?: string;
  iconClassName?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconContainerClassName = "bg-green-100",
  iconClassName = "text-green-500",
  className = "",
}: StatCardProps) {
  return (
    <div
      className={`bg-white rounded-xl p-5 flex items-center justify-between shadow-sm border border-gray-100 ${className}`}
    >
      <div>
        <p className="text-gray-500 text-sm mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`rounded-2xl p-3 ${iconContainerClassName}`}>
        <Icon className={`w-7 h-7 ${iconClassName}`} strokeWidth={2} />
      </div>
    </div>
  );
}
