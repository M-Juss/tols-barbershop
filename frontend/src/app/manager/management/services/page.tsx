import dynamic from "next/dynamic";

import { ManagementModulePage } from "@/layout/manager/ManagementModulePage";

const Service = dynamic(() =>
  import("@/layout/manager/Service").then((module) => module.Service),
);

export default function ServicesManagementPage() {
  return (
    <ManagementModulePage
      title="Services & Add-ons"
      description="Manage the services and optional extras customers can book."
    >
      <Service />
    </ManagementModulePage>
  );
}
