// ============================================================
// School Configuration — Edit this file per school deployment
// ============================================================

export const schoolConfig = {
  // ─── Branding ───────────────────────────────────────────────
  name: "Greenfield Academy",
  shortName: "GFA",
  tagline: "Nurturing Excellence, Inspiring Futures",
  description:
    "Greenfield Academy is a premier educational institution in Ghana committed to academic excellence, character development, and holistic education. We prepare students to thrive in a rapidly changing world.",
  logo: "/images/logo.png",
  favicon: "/favicon.ico",

  // ─── Theme Colors (HSL values for generating palettes) ─────
  colors: {
    primary: {
      DEFAULT: "#1e3a5f",
      50: "#eef4fb",
      100: "#d5e3f5",
      200: "#aac7eb",
      300: "#7faade",
      400: "#548ed4",
      500: "#3571bf",
      600: "#1e3a5f",
      700: "#1a3354",
      800: "#152a45",
      900: "#0f1f33",
    },
    secondary: {
      DEFAULT: "#c9a84c",
      50: "#fdf9ee",
      100: "#f8edd0",
      200: "#f1dba1",
      300: "#e9c872",
      400: "#d4ae52",
      500: "#c9a84c",
      600: "#a88a3d",
      700: "#886e31",
      800: "#6b5727",
      900: "#4f401d",
    },
    accent: {
      DEFAULT: "#2d6a4f",
      50: "#edf7f2",
      100: "#d1ebdf",
      200: "#a3d7bf",
      300: "#75c39f",
      400: "#47af7f",
      500: "#2d6a4f",
      600: "#265c44",
      700: "#1f4d39",
      800: "#183e2e",
      900: "#112f23",
    },
  },

  // ─── Contact Information ───────────────────────────────────
  contact: {
    email: "info@greenfieldacademy.edu.gh",
    phone: "+233 30 291 0000",
    phone2: "+233 24 000 0000",
    address: "14 Independence Avenue, East Legon, Accra, Ghana",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.5!2d-0.15!3d5.63!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMzgnMDAuMCJOIDDCsDknMDAuMCJX!5e0!3m2!1sen!2sgh!4v1",
  },

  // ─── Social Media ─────────────────────────────────────────
  social: {
    facebook: "https://facebook.com/greenfieldacademy",
    twitter: "https://twitter.com/greenfieldacad",
    instagram: "https://instagram.com/greenfieldacademy",
    youtube: "",
    linkedin: "",
  },

  // ─── Admissions (Ghanaian Structure) ────────────────────────
  admissions: {
    grades: [
      "Pre-School (Nursery)",
      "Kindergarten 1 (KG1)",
      "Kindergarten 2 (KG2)",
      "Basic 1 (Lower Primary)",
      "Basic 2 (Lower Primary)",
      "Basic 3 (Lower Primary)",
      "Basic 4 (Upper Primary)",
      "Basic 5 (Upper Primary)",
      "Basic 6 (Upper Primary)",
      "Basic 7 (JHS 1)",
      "Basic 8 (JHS 2)",
      "Basic 9 (JHS 3)",
    ],
    currentSession: "2026–2027",
  },

  // ─── Academic Programs (Ghanaian Structure) ─────────────────
  programs: [
    {
      title: "Pre-School & KG",
      grades: "Nursery – KG2",
      description:
        "A warm, nurturing environment where young learners build foundational skills through play-based activities, phonics, numeracy, and creative exploration.",
      icon: "🌱",
      image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
    },
    {
      title: "Lower Primary",
      grades: "Basic 1 – Basic 3",
      description:
        "Building strong foundations in literacy, numeracy, science, and social studies through hands-on learning and child-centred teaching methods.",
      icon: "📚",
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80",
    },
    {
      title: "Upper Primary",
      grades: "Basic 4 – Basic 6",
      description:
        "Deepening academic skills and critical thinking, with integrated ICT, French, and creative arts to develop well-rounded learners.",
      icon: "🔬",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    },
    {
      title: "Junior High School",
      grades: "Basic 7 – Basic 9 (JHS)",
      description:
        "Rigorous BECE preparation with emphasis on mathematics, English, science, and social studies. Includes career guidance, ICT labs, and leadership training.",
      icon: "🎓",
      image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80",
    },
  ],

  // ─── About / Leadership (Ghanaian names) ───────────────────
  leadership: [
    {
      name: "Mrs. Abena Mensah",
      role: "Head of School",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
      bio: "Mrs. Mensah brings over 20 years of experience in educational leadership across Ghana. She holds an M.Ed from the University of Cape Coast.",
    },
    {
      name: "Mr. Kwame Asante",
      role: "Assistant Headmaster, Academics",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
      bio: "A passionate educator focused on curriculum innovation and student development. He oversees all academic programmes and teacher training.",
    },
    {
      name: "Mrs. Efua Boateng",
      role: "Head of Admissions",
      image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&q=80",
      bio: "Dedicated to welcoming families and guiding them through the enrollment process with warmth and professionalism.",
    },
  ],

  // ─── Testimonials ─────────────────────────────────────────
  testimonials: [
    {
      quote:
        "Greenfield Academy has given my daughter not just excellent academic results but real confidence. The teachers know her as a person, not just a student.",
      author: "Akosua Boateng",
      role: "Parent, Basic 5",
    },
    {
      quote:
        "The discipline and values instilled here prepared me for senior high school in ways I didn't appreciate until I left. I came back to visit the teachers as soon as I could.",
      author: "Kojo Mensah",
      role: "Alumnus, JHS Class of 2022",
    },
    {
      quote:
        "From the warm admissions process to the regular parent-teacher meetings, the communication has been world-class. We feel like partners in our son's education.",
      author: "Ama & Yaw Asare",
      role: "Parents, KG2",
    },
    {
      quote:
        "My children's ICT and French teachers have sparked interests I didn't even know they had. The BECE results speak for themselves, but the personal growth is what stays with you.",
      author: "Mrs. Efua Owusu",
      role: "Parent, JHS 2 & Basic 4",
    },
  ],

  // ─── Hero Images ──────────────────────────────────────────
  images: {
    heroStudents: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1400&q=80",
    classroom: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1000&q=80",
    students: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1000&q=80",
    campus: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1000&q=80",
    library: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1000&q=80",
    sports: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1000&q=80",
  },

  // ─── Miscellaneous (Realistic for Ghana) ───────────────────
  foundedYear: 2003,
  motto: "Learn. Lead. Inspire.",
  studentCount: "620+",
  staffCount: "45+",
  graduationRate: "98%",
  becePasses: "95%",
  accreditation: "Approved by the Ghana Education Service (GES)",
  developer: "SAGE INNOVATIONS",

  // ─── Site ──────────────────────────────────────────────────
  // Used for absolute metadata/OG URLs + sitemap. Override via
  // NEXT_PUBLIC_SITE_URL in production.
  siteUrl: "https://greenfieldacademy.edu.gh",
} as const;

export type SchoolConfig = typeof schoolConfig;
