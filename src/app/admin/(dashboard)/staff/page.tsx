import { getAllStaffAdmin } from "@/actions/staff";
import { StaffManager } from "@/components/admin/StaffManager";

export default async function AdminStaffPage() {
  const members = await getAllStaffAdmin();
  return <StaffManager members={members} />;
}
