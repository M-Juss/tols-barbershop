import type { ReactNode } from "react";

type ManagementModulePageProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function ManagementModulePage({
  title,
  description,
  children,
}: ManagementModulePageProps) {
  return (
    <div className="min-h-full w-full bg-slate-100 font-sans">
      <header className="px-4 pt-4 sm:px-6 sm:pt-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Management
        </p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </header>
      {children}
    </div>
  );
}
