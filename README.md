# 🏫 School Website Template

A production-ready, reusable school website system with an admin CMS. Built to be deployed for multiple schools with minimal configuration changes.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Hosting**: Vercel

---

## Features

### Public Website
- 🏠 **Home** — Hero section, stats, programs preview, CTAs
- 📖 **About** — History, mission/vision, core values, leadership team
- 🎓 **Academics** — Programs, curriculum, extracurriculars
- 📝 **Admissions** — Process steps, requirements, online application form
- 📰 **News** — Dynamic posts with categories and detail pages
- 🖼️ **Gallery** — Image grid with lightbox viewer
- 📞 **Contact** — Contact form, school info, embedded map

### Admin Dashboard
- 📊 **Dashboard** — Stats overview, quick actions
- ✏️ **Posts** — Full CRUD with TipTap rich text editor
- 🖼️ **Gallery** — Upload, manage, delete images
- 📋 **Applications** — View, filter by status, update decisions
- 💬 **Messages** — Inbox with read/unread, detail view, reply link

### Technical
- 🔒 Middleware-protected admin routes
- 🔐 Row-Level Security (RLS) on all tables
- 📱 Fully responsive (mobile-first)
- ⚡ ISR for dynamic content (60s revalidation)
- 🎨 CSS variable theming (swap colors per school)
- 🗺️ Auto-generated sitemap.xml and robots.txt
- 💀 Skeleton loading states, error boundaries, 404 page
- 🔍 SEO meta tags on every page

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm
- A [Supabase](https://supabase.com) account (free tier works)

### 1. Clone & Install

```bash
cd school-website
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Go to **Authentication → Users** → Click **Add user**
4. Create an admin account with email and password
5. Copy the user's UUID from the users list
6. Run in SQL Editor:
   ```sql
   INSERT INTO admins (id, email, full_name)
   VALUES ('YOUR-USER-UUID', 'admin@school.edu', 'Admin User');
   ```

### 3. Configure Environment

Copy the example env file:
```bash
cp .env.local.example .env.local
```

Fill in your Supabase credentials (found in **Project Settings → API**):
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 4. Customize for Your School

Edit `src/config/school.ts` with your school's information:
- Name, tagline, motto
- Contact details
- Social media links
- Colors (update both config AND `src/app/globals.css` CSS variables)
- Programs and leadership data

### 5. Run Development Server

```bash
npm run dev
```

Visit:
- Public site: [http://localhost:3000](http://localhost:3000)
- Admin login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## Deployment (Vercel)

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial school website"
git remote add origin https://github.com/your-user/school-website.git
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Click **Deploy**

### 3. Configure Custom Domain (Optional)
1. In Vercel → **Settings → Domains**
2. Add your school's domain
3. Update DNS records as instructed

---

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public pages with Navbar/Footer
│   │   ├── page.tsx       # Home
│   │   ├── about/         # About page
│   │   ├── academics/     # Academics page
│   │   ├── admissions/    # Admissions + form
│   │   ├── news/          # News listing + [slug]
│   │   ├── gallery/       # Gallery page
│   │   └── contact/       # Contact + form
│   ├── admin/
│   │   ├── login/         # Admin login
│   │   └── (dashboard)/   # Protected admin pages
│   │       ├── page.tsx   # Dashboard
│   │       ├── posts/     # Posts CRUD
│   │       ├── gallery/   # Gallery management
│   │       ├── applications/ # Applications inbox
│   │       └── messages/  # Messages inbox
│   ├── layout.tsx         # Root layout
│   ├── not-found.tsx      # 404 page
│   ├── sitemap.ts         # SEO sitemap
│   └── robots.ts          # SEO robots.txt
├── actions/               # Server actions
├── components/
│   ├── ui/                # Reusable primitives
│   ├── public/            # Public page components
│   └── admin/             # Admin components
├── config/
│   └── school.ts          # ⭐ Per-school configuration
├── lib/
│   ├── supabase/          # Supabase clients
│   └── utils.ts           # Utility functions
└── types/
    └── index.ts           # TypeScript interfaces
```

---

## Deploying for a New School

1. Fork/clone the repository
2. Edit `src/config/school.ts` with the new school's data
3. Update CSS variables in `src/app/globals.css` to match new brand colors
4. Replace logo image in `public/images/`
5. Set up a new Supabase project and run `schema.sql`
6. Deploy to Vercel with new environment variables

**Time to deploy a new school: ~30 minutes**

---

## Database Schema

| Table | Purpose |
|-------|---------|
| `admins` | Admin user profiles (linked to auth.users) |
| `posts` | News articles and announcements |
| `gallery` | Photo gallery images |
| `applications` | Admission form submissions |
| `messages` | Contact form submissions |

All tables have Row-Level Security enabled. See `supabase/schema.sql` for full details.

---

## License

Private — built as a commercial product for school deployments.
