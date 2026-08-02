import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp, MousePointerClick, Users } from "lucide-react";

/**
 * Premium, minimal digital-marketing dashboard visual for the hero.
 * Growth chart + KPI tiles + channel performance bars. Pure SVG/CSS, no images.
 */

const points = [4, 18, 12, 30, 26, 44, 38, 58, 66, 84];

const kpis = [
  { Icon: TrendingUp, label: "Revenue", value: "+142%" },
  { Icon: Users, label: "Leads / mo", value: "1,284" },
  { Icon: MousePointerClick, label: "Cost / lead", value: "-38%" },
];

const channels = [
  { name: "Search", pct: 82 },
  { name: "Social", pct: 64 },
  { name: "Paid Ads", pct: 71 },
];

function LineChart() {
  const w = 320;
  const h = 96;
  const max = Math.max(...points);
  const coords = points.map((p, i) => [
    (i / (points.length - 1)) * w,
    h - (p / max) * (h - 10) - 5,
  ]);
  const path = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${path} L${w},${h} L0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-24 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="mv-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1="0" x2={w} y1={h * g} y2={h * g} stroke="currentColor" className="text-border" strokeWidth="1" />
      ))}
      <motion.path
        d={area}
        fill="url(#mv-area)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      />
      <motion.circle
        cx={coords[coords.length - 1][0] - 3}
        cy={coords[coords.length - 1][1]}
        r="3.5"
        fill="var(--accent)"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

export function MarketingVisual() {
  return (
    <div className="relative w-full max-w-[440px]">
      <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-accent/5 blur-[64px]" />

      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="relative rounded-2xl border border-border bg-glass p-4 backdrop-blur-xl sm:p-5"
      >
        {/* header */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Growth overview</div>
            <div className="mt-1 truncate text-lg font-medium">Last 90 days</div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
            <ArrowUpRight className="h-3 w-3" />
            +142%
          </span>
        </div>

        <div className="mt-4">
          <LineChart />
        </div>

        {/* KPI tiles */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {kpis.map(({ Icon, label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
              className="rounded-xl border border-border bg-background/40 p-2.5"
            >
              <Icon className="h-3.5 w-3.5 text-accent" />
              <div className="mt-2 text-sm font-medium leading-none">{value}</div>
              <div className="mt-1 truncate text-[10px] text-muted-foreground">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* channels */}
        <div className="mt-4 space-y-2.5">
          {channels.map((c, i) => (
            <div key={c.name}>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{c.name}</span>
                <span className="text-foreground/80">{c.pct}%</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  className="h-full rounded-full bg-accent/70"
                  initial={{ width: 0 }}
                  animate={{ width: `${c.pct}%` }}
                  transition={{ duration: 1.1, delay: 0.7 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* floating leads pill */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute -bottom-4 left-2 hidden items-center gap-2 rounded-xl border border-border bg-background/80 px-3 py-2 backdrop-blur-xl sm:flex"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        <span className="text-[11px] text-muted-foreground">New lead from Google Search</span>
      </motion.div>
    </div>
  );
}
