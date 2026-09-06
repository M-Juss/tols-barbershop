import dynamic from "next/dynamic";

import { ManagementModulePage } from "@/layout/manager/ManagementModulePage";

const Admin = dynamic(() =>
  import("@/layout/manager/Admin").then((module) => module.Admin),
);

export default function AdminsManagementPage() {
  return (
    <ManagementModulePage
      title="Admins & Roles"
      description="Manage administrator accounts, roles, and module access."
    >
      <Admin />
    </ManagementModulePage>
  );
}
