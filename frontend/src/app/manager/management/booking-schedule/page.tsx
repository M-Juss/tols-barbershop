import dynamic from "next/dynamic";

import { ManagementModulePage } from "@/layout/manager/ManagementModulePage";

const Slots = dynamic(() =>
  import("@/layout/manager/Slots").then((module) => module.Slots),
);

export default function BookingScheduleManagementPage() {
  return (
    <ManagementModulePage
      title="Booking Schedule"
      description="Configure business hours, closures, and custom open slots."
    >
      <Slots />
    </ManagementModulePage>
  );
}
