import type { DailyActivityPoint } from "@/actions/admin";

interface ActivityChartProps {
  data: DailyActivityPoint[];
  days: number;
}

/**
 * Compact 30-day bar chart of applications + messages activity.
 *
 * Pure inline SVG — no chart library — so the admin bundle stays
 * small. Bars are grouped per day: applications (primary) and
 * messages (accent). Renders its own axis + legend.
 */
export function ActivityChart({ data, days }: ActivityChartProps) {
  const width = 720;
  const height = 180;
  const padding = { top: 16, right: 12, bottom: 28, left: 28 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = Math.max(
    1,
    ...data.map((d) => Math.max(d.applications, d.messages)),
  );

  // Nice tick max (ceil to next multiple of ~5)
  const tickMax = Math.ceil(maxVal / 5) * 5 || 5;

  const totalApps = data.reduce((a, d) => a + d.applications, 0);
  const totalMsgs = data.reduce((a, d) => a + d.messages, 0);

  const groupW = chartW / data.length;
  const barW = Math.max(2, (groupW - 4) / 2);

  // X labels: show ~6 evenly spaced.
  const labelStride = Math.max(1, Math.floor(data.length / 6));

  return (
    <div className="bg-surface rounded-xl border border-border p-5">
      <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="font-semibold text-text">
            Activity — last {days} days
          </h2>
          <p className="text-xs text-muted mt-0.5">
            {totalApps} applications · {totalMsgs} messages received
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm bg-primary" />
            Applications
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm bg-accent" />
            Messages
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        role="img"
        aria-label={`Bar chart showing daily applications and messages over the last ${days} days`}
      >
        {/* y grid + ticks */}
        {[0, 0.5, 1].map((t) => {
          const y = padding.top + chartH - chartH * t;
          const value = Math.round(tickMax * t);
          return (
            <g key={t}>
              <line
                x1={padding.left}
                x2={padding.left + chartW}
                y1={y}
                y2={y}
                stroke="var(--color-border)"
                strokeDasharray="2 3"
              />
              <text
                x={padding.left - 6}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill="var(--color-muted)"
              >
                {value}
              </text>
            </g>
          );
        })}

        {/* bars */}
        {data.map((d, i) => {
          const xBase = padding.left + i * groupW + (groupW - barW * 2) / 2;
          const hApp = (d.applications / tickMax) * chartH;
          const hMsg = (d.messages / tickMax) * chartH;
          const showLabel = i % labelStride === 0 || i === data.length - 1;
          return (
            <g key={d.date}>
              <rect
                x={xBase}
                y={padding.top + chartH - hApp}
                width={barW}
                height={hApp}
                fill="var(--color-primary)"
                rx={1}
              >
                <title>
                  {d.label}: {d.applications} applications
                </title>
              </rect>
              <rect
                x={xBase + barW}
                y={padding.top + chartH - hMsg}
                width={barW}
                height={hMsg}
                fill="var(--color-accent)"
                rx={1}
              >
                <title>
                  {d.label}: {d.messages} messages
                </title>
              </rect>
              {showLabel && (
                <text
                  x={xBase + barW}
                  y={padding.top + chartH + 14}
                  textAnchor="middle"
                  fontSize="9"
                  fill="var(--color-muted)"
                >
                  {d.label}
                </text>
              )}
            </g>
          );
        })}

        {/* x axis */}
        <line
          x1={padding.left}
          x2={padding.left + chartW}
          y1={padding.top + chartH}
          y2={padding.top + chartH}
          stroke="var(--color-border)"
        />
      </svg>
    </div>
  );
}
