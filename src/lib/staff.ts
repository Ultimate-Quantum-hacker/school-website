import { schoolConfig } from "@/config/school";
import type { StaffMember } from "@/types";

export interface PublicStaffMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface StaffDepartmentGroup {
  department: string;
  members: PublicStaffMember[];
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80";

function toPublic(member: StaffMember): PublicStaffMember {
  return {
    name: member.name,
    role: member.role,
    bio: member.bio ?? "",
    image: member.image_url || FALLBACK_IMAGE,
  };
}

/**
 * Group DB-backed staff rows by department, preserving the order in which
 * departments first appear in the input (which is the configured display
 * order from the action).
 */
export function groupStaffByDepartment(
  rows: StaffMember[],
): StaffDepartmentGroup[] {
  const map = new Map<string, PublicStaffMember[]>();
  for (const row of rows) {
    const list = map.get(row.department) ?? [];
    list.push(toPublic(row));
    map.set(row.department, list);
  }
  return Array.from(map.entries()).map(([department, members]) => ({
    department,
    members,
  }));
}

/**
 * Build the leadership grid from DB rows. Falls back to the schoolConfig
 * leadership array if no rows are flagged as leadership (e.g. before the
 * migration is run, or while the table is empty).
 */
export function leadershipFromRows(rows: StaffMember[]): PublicStaffMember[] {
  const leaders = rows
    .filter((r) => r.is_leadership)
    .map(toPublic);
  if (leaders.length > 0) return leaders;
  return schoolConfig.leadership.map((l) => ({
    name: l.name,
    role: l.role,
    bio: l.bio,
    image: l.image,
  }));
}

/**
 * Build the full staff directory (grouped by department) from DB rows.
 * Falls back to the schoolConfig staff structure if no rows exist yet.
 */
export function staffDirectoryFromRows(
  rows: StaffMember[],
): StaffDepartmentGroup[] {
  const directory = groupStaffByDepartment(rows);
  if (directory.length > 0) return directory;
  return schoolConfig.staff.map((dept) => ({
    department: dept.department,
    members: dept.members.map((m) => ({
      name: m.name,
      role: m.role,
      bio: m.bio,
      image: m.image,
    })),
  }));
}
