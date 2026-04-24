import Link from "next/link";
import { getDashboardStats, getActivityTimeSeries } from "@/actions/admin";
import { schoolConfig } from "@/config/school";
import { ActivityChart } from "@/components/admin/ActivityChart";

export default async function AdminDashboardPage() {
  const ACTIVITY_DAYS = 30;
  const [stats, activity] = await Promise.all([
    getDashboardStats(),
    getActivityTimeSeries(ACTIVITY_DAYS),
  ]);

  const statCards = [
    {
      label: "Total Posts",
      value: stats.totalPosts,
      icon: "📝",
      href: "/admin/posts",
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Applications",
      value: stats.totalApplications,
      subtitle: `${stats.pendingApplications} pending`,
      icon: "📋",
      href: "/admin/applications",
      color: "bg-purple-50 text-purple-700",
    },
    {
      label: "Messages",
      value: stats.totalMessages,
      subtitle: `${stats.unreadMessages} unread`,
      icon: "✉️",
      href: "/admin/messages",
      color: "bg-green-50 text-green-700",
    },
    {
      label: "Gallery Images",
      value: stats.totalGalleryImages,
      icon: "🖼️",
      href: "/admin/gallery",
      color: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">
          Dashboard
        </h1>
        <p className="text-sm text-muted mt-1">
          Welcome to the {schoolConfig.name} admin panel
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="bg-surface rounded-xl border border-border p-6 hover:shadow-md hover:border-border transition-all duration-200 group">
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-lg ${stat.color}`}
                >
                  {stat.icon}
                </span>
                <svg
                  className="w-4 h-4 text-muted group-hover:text-muted transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <p className="text-3xl font-bold text-text">{stat.value}</p>
              <p className="text-sm text-muted mt-1">{stat.label}</p>
              {stat.subtitle && (
                <p className="text-xs text-primary mt-1 font-medium">
                  {stat.subtitle}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Activity Chart */}
      <div className="mb-8">
        <ActivityChart data={activity} days={ACTIVITY_DAYS} />
      </div>

      {/* Quick Actions */}
      <div className="bg-surface rounded-xl border border-border p-6">
        <h2 className="font-semibold text-text mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            href="/admin/posts?new=true"
            className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary-200 hover:bg-primary-50 transition-all duration-200 group"
          >
            <span className="text-xl">✏️</span>
            <div>
              <p className="text-sm font-medium text-text group-hover:text-primary">
                New Post
              </p>
              <p className="text-xs text-muted">Create news or announcement</p>
            </div>
          </Link>
          <Link
            href="/admin/gallery"
            className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary-200 hover:bg-primary-50 transition-all duration-200 group"
          >
            <span className="text-xl">📸</span>
            <div>
              <p className="text-sm font-medium text-text group-hover:text-primary">
                Upload Photo
              </p>
              <p className="text-xs text-muted">Add to gallery</p>
            </div>
          </Link>
          <Link
            href="/admin/applications"
            className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary-200 hover:bg-primary-50 transition-all duration-200 group"
          >
            <span className="text-xl">📋</span>
            <div>
              <p className="text-sm font-medium text-text group-hover:text-primary">
                Review Applications
              </p>
              <p className="text-xs text-muted">
                {stats.pendingApplications} pending
              </p>
            </div>
          </Link>
          <Link
            href="/admin/messages"
            className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary-200 hover:bg-primary-50 transition-all duration-200 group"
          >
            <span className="text-xl">💬</span>
            <div>
              <p className="text-sm font-medium text-text group-hover:text-primary">
                Read Messages
              </p>
              <p className="text-xs text-muted">
                {stats.unreadMessages} unread
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
