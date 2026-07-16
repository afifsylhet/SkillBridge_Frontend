'use client';

import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const CHART_COLORS = [
  'var(--color-brand-600)',
  'var(--color-brand-400)',
  'var(--color-accent)',
  'var(--color-success)',
  'var(--color-warning)',
  'var(--color-danger)',
];

type ChartDatum = Record<string, string | number>;

interface SimpleBarChartProps {
  data: ChartDatum[];
  xKey: string;
  yKey: string;
  title?: string;
}

interface SimpleLineChartProps {
  data: ChartDatum[];
  xKey: string;
  yKey: string;
  title?: string;
}

interface SimplePieChartProps {
  data: Array<{ name: string; value: number }>;
  title?: string;
}

function ChartShell({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-surface-border bg-surface p-5 shadow-card md:p-6">
      {title && (
        <h3 className="mb-4 font-display text-base font-semibold tracking-tight text-ink md:text-lg">
          {title}
        </h3>
      )}
      <div className="h-64 w-full">{children}</div>
    </div>
  );
}

export function SimpleBarChart({ data, xKey, yKey, title }: SimpleBarChartProps) {
  if (data.length === 0) {
    return (
      <ChartShell title={title}>
        <p className="flex h-full items-center justify-center text-sm text-ink-muted">No data yet.</p>
      </ChartShell>
    );
  }

  return (
    <ChartShell title={title}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <XAxis
            dataKey={xKey}
            tick={{ fill: 'var(--color-ink-muted)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--color-surface-border)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--color-ink-muted)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--color-surface-border)' }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-surface-border)',
              borderRadius: '8px',
              color: 'var(--color-ink)',
            }}
          />
          <Bar dataKey={yKey} fill="var(--color-brand-600)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function SimpleLineChart({ data, xKey, yKey, title }: SimpleLineChartProps) {
  if (data.length === 0) {
    return (
      <ChartShell title={title}>
        <p className="flex h-full items-center justify-center text-sm text-ink-muted">No data yet.</p>
      </ChartShell>
    );
  }

  return (
    <ChartShell title={title}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <XAxis
            dataKey={xKey}
            tick={{ fill: 'var(--color-ink-muted)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--color-surface-border)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--color-ink-muted)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--color-surface-border)' }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-surface-border)',
              borderRadius: '8px',
              color: 'var(--color-ink)',
            }}
          />
          <Line
            type="monotone"
            dataKey={yKey}
            stroke="var(--color-brand-600)"
            strokeWidth={2}
            dot={{ fill: 'var(--color-brand-600)', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function SimplePieChart({ data, title }: SimplePieChartProps) {
  const filtered = data.filter((d) => d.value > 0);

  if (filtered.length === 0) {
    return (
      <ChartShell title={title}>
        <p className="flex h-full items-center justify-center text-sm text-ink-muted">No data yet.</p>
      </ChartShell>
    );
  }

  return (
    <ChartShell title={title}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filtered}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={({ name, percent }) =>
              `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
            }
            labelLine={{ stroke: 'var(--color-ink-muted)' }}
          >
            {filtered.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-surface-border)',
              borderRadius: '8px',
              color: 'var(--color-ink)',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}
