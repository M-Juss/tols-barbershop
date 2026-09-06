import dynamic from "next/dynamic";

import { ManagementModulePage } from "@/layout/manager/ManagementModulePage";

const Gallery = dynamic(() =>
  import("@/layout/manager/Gallery").then((module) => module.Gallery),
);

export default function GalleryManagementPage() {
  return (
    <ManagementModulePage
      title="Gallery"
      description="Manage the images displayed on the public website."
    >
      <Gallery />
    </ManagementModulePage>
  );
}
