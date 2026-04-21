import { getApplications } from "@/actions/admin";
import { ApplicationsManager } from "@/components/admin/ApplicationsManager";
import type { Application } from "@/types";

export default async function AdminApplicationsPage() {
  const applications = (await getApplications()) as Application[];

  return <ApplicationsManager applications={applications} />;
}
