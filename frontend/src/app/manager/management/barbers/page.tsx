import dynamic from "next/dynamic";

import { ManagementModulePage } from "@/layout/manager/ManagementModulePage";

const Barber = dynamic(() =>
  import("@/layout/manager/Barber").then((module) => module.Barber),
);

export default function BarbersManagementPage() {
  return (
    <ManagementModulePage
      title="Barbers"
      description="Manage barber profiles and account access."
    >
      <Barber />
    </ManagementModulePage>
  );
}
