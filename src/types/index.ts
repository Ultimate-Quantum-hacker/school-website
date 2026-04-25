// ─── Database Types ──────────────────────────────────────────

export interface Admin {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image: string | null;
  category: "news" | "announcement";
  published: boolean;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  image_url: string;
  caption: string | null;
  display_order: number;
  created_at: string;
}

export interface Application {
  id: string;
  student_name: string;
  email: string;
  phone: string | null;
  date_of_birth: string | null;
  guardian_name: string | null;
  guardian_phone: string | null;
  grade_applying: string;
  previous_school: string | null;
  message: string | null;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  created_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  category: "event" | "holiday" | "exam" | "meeting";
  published: boolean;
  created_at: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  department: string;
  is_leadership: boolean;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface AcademicCalendar {
  id: string;
  academic_year: string;
  term: 1 | 2 | 3;
  title: string | null;
  pdf_url: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string | null;
  email: string | null;
  status: "pending" | "approved" | "rejected";
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface SiteSettingsRow {
  id: number;
  contact_email: string | null;
  contact_phone: string | null;
  contact_phone2: string | null;
  contact_address: string | null;
  contact_map_embed_url: string | null;
  social_facebook: string | null;
  social_twitter: string | null;
  social_instagram: string | null;
  social_youtube: string | null;
  social_linkedin: string | null;
  social_tiktok: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteContact {
  email: string;
  phone: string;
  phone2: string;
  address: string;
  mapEmbedUrl: string;
}

export interface SiteSocial {
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  tiktok: string;
}

export interface SiteSettings {
  contact: SiteContact;
  social: SiteSocial;
}

// ─── Form / UI Types ────────────────────────────────────────

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ApplicationFormData {
  student_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  guardian_name: string;
  guardian_phone: string;
  grade_applying: string;
  previous_school: string;
  message: string;
}

export interface DashboardStats {
  totalPosts: number;
  totalApplications: number;
  totalMessages: number;
  totalGalleryImages: number;
  pendingApplications: number;
  unreadMessages: number;
}

// ─── Server Action Results ──────────────────────────────────

export interface ActionResult {
  success: boolean;
  message: string;
  data?: unknown;
}
