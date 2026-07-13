import React, { useState, useEffect, useRef } from 'react';
import { API_URL } from '@/config';

// Predefined Icon Path Constants using standard Lucide-style SVG shapes
const ICO = {
  pulse: 'M22 12h-4l-3 9L9 3l-3 9H2',
  bolt: 'M13 2L3 14h7l-1 8 10-12h-7l1-8z',
  users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  dollar: 'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6'
};

// Local fallback data structures
const KPIS_OVERVIEW = [
  { label: 'Active users', val: 24817, pfx: '', sfx: '', dec: 0, delta: '+12.4%', up: true, ico: 'M12 2a5 5 0 100 10 5 5 0 000-10zM3 22c0-5 4-8 9-8s9 3 9 8', spk: [8, 12, 10, 15, 13, 18, 16, 22, 20, 26], col: 'var(--accent)' },
  { label: 'Revenue', val: 184920, pfx: '$', sfx: '', dec: 0, delta: '+8.1%', up: true, ico: ICO.dollar, spk: [20, 18, 22, 19, 24, 23, 28, 26, 31, 34], col: 'var(--accent-2)' },
  { label: 'Conversion', val: 3.84, pfx: '', sfx: '%', dec: 2, delta: '-0.6%', up: false, ico: ICO.pulse, spk: [14, 16, 15, 13, 14, 12, 13, 11, 12, 10], col: 'var(--accent-3)' },
  { label: 'Avg latency', val: 142, pfx: '', sfx: 'ms', dec: 0, delta: '-18ms', up: true, ico: ICO.bolt, spk: [26, 22, 24, 20, 18, 19, 15, 16, 13, 12], col: 'var(--accent)' },
];

const KPIS_ANALYTICS = [
  { label: 'Sessions', val: 58204, pfx: '', sfx: '', dec: 0, delta: '+18.2%', up: true, ico: 'M12 2a5 5 0 100 10 5 5 0 000-10zM3 22c0-5 4-8 9-8s9 3 9 8', spk: [12, 15, 13, 19, 21, 24, 22, 28, 26, 32], col: 'var(--accent)' },
  { label: 'Pages/visit', val: 4.7, pfx: '', sfx: '', dec: 1, delta: '+4.3%', up: true, ico: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20M4 19.5V3.5A2.5 2.5 0 0 1 6.5 1M20 3v14', spk: [3.2, 3.5, 3.8, 4.1, 4.0, 4.3, 4.2, 4.5, 4.4, 4.7], col: 'var(--accent-2)' },
  { label: 'Engagement', val: 61.4, pfx: '', sfx: '%', dec: 1, delta: '+5.7%', up: true, ico: ICO.pulse, spk: [51, 53, 52, 55, 54, 58, 57, 60, 59, 61.4], col: 'var(--accent-3)' },
  { label: 'New signups', val: 1286, pfx: '', sfx: '', dec: 0, delta: '+9.1%', up: true, ico: ICO.users, spk: [80, 95, 90, 110, 105, 120, 115, 130, 125, 140], col: 'var(--accent)' },
];

const KPIS_TRANSACTIONS = [
  { label: 'Gross volume', val: 92480, pfx: '$', sfx: '', dec: 0, delta: '+15.2%', up: true, ico: ICO.dollar, spk: [10, 12, 11, 15, 14, 18, 17, 22, 20, 26], col: 'var(--accent)' },
  { label: 'Avg. order', val: 184, pfx: '$', sfx: '', dec: 0, delta: '+2.1%', up: true, ico: 'M6 2L3 6v14a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0', spk: [170, 172, 171, 175, 174, 178, 177, 182, 180, 184], col: 'var(--accent-2)' },
  { label: 'Success rate', val: 97.6, pfx: '', sfx: '%', dec: 1, delta: '+0.4%', up: true, ico: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3', spk: [96.5, 96.8, 97.0, 97.2, 97.1, 97.3, 97.4, 97.5, 97.4, 97.6], col: 'var(--pos)' },
  { label: 'Payouts', val: 88120, pfx: '$', sfx: '', dec: 0, delta: '+11.8%', up: true, ico: 'M17 9V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M9 15h12M11 11l-2 2 2 2', spk: [18, 22, 20, 25, 23, 28, 26, 31, 30, 34], col: 'var(--accent-3)' },
];

const KPIS_AUDIENCE = [
  { label: 'New users', val: 4102, pfx: '', sfx: '', dec: 0, delta: '+24.1%', up: true, ico: ICO.users, spk: [15, 18, 16, 22, 20, 25, 23, 29, 27, 34], col: 'var(--accent)' },
  { label: 'Returning', val: 20715, pfx: '', sfx: '', dec: 0, delta: '+10.2%', up: true, ico: ICO.users, spk: [60, 65, 63, 70, 68, 74, 72, 78, 76, 82], col: 'var(--accent-2)' },
  { label: 'Visits/user', val: 3.4, pfx: '', sfx: '', dec: 1, delta: '+8.3%', up: true, ico: ICO.pulse, spk: [2.8, 2.9, 3.0, 3.1, 3.1, 3.2, 3.2, 3.3, 3.3, 3.4], col: 'var(--accent-3)' },
  { label: 'Countries', val: 74, pfx: '', sfx: '', dec: 0, delta: '+3 new', up: true, ico: 'M12 2a10 10 0 0 0-10 10 10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm0 2a8 8 0 0 1 8 8 8 8 0 0 1-8 8 8 8 0 0 1-8-8 8 8 0 0 1 8-8z', spk: [68, 69, 70, 71, 71, 72, 72, 73, 73, 74], col: 'var(--accent)' },
];

const KPIS_REPORTS = [
  { label: 'Reports generated', val: 342, pfx: '', sfx: '', dec: 0, delta: '+11%', up: true, ico: ICO.pulse, spk: [10, 12, 11, 14, 13, 16, 15, 18, 17, 20], col: 'var(--accent)' },
  { label: 'Scheduled', val: 18, pfx: '', sfx: '', dec: 0, delta: '+2', up: true, ico: ICO.bolt, spk: [8, 9, 8, 10, 9, 11, 10, 12, 11, 13], col: 'var(--accent-2)' },
  { label: 'Exports', val: 1204, pfx: '', sfx: '', dec: 0, delta: '+9.4%', up: true, ico: ICO.users, spk: [14, 16, 15, 18, 17, 20, 19, 22, 21, 24], col: 'var(--accent-3)' },
  { label: 'Avg build', val: 3.2, pfx: '', sfx: 's', dec: 1, delta: '-0.4s', up: true, ico: ICO.bolt, spk: [22, 20, 21, 18, 19, 16, 17, 15, 14, 12], col: 'var(--accent)' },
];

const KPIS_CAMPAIGNS = [
  { label: 'Active campaigns', val: 12, pfx: '', sfx: '', dec: 0, delta: '+3', up: true, ico: ICO.bolt, spk: [6, 7, 7, 9, 8, 10, 11, 10, 12, 13], col: 'var(--accent)' },
  { label: 'Spend', val: 48200, pfx: '$', sfx: '', dec: 0, delta: '+7.1%', up: true, ico: ICO.dollar, spk: [14, 16, 15, 18, 20, 19, 22, 24, 23, 27], col: 'var(--accent-2)' },
  { label: 'ROAS', val: 4.2, pfx: '', sfx: 'x', dec: 1, delta: '+0.3%', up: true, ico: ICO.pulse, spk: [16, 17, 16, 18, 19, 18, 20, 21, 20, 23], col: 'var(--accent-3)' },
  { label: 'CTR', val: 3.1, pfx: '', sfx: '%', dec: 1, delta: '+0.2%', up: true, ico: ICO.pulse, spk: [10, 11, 10, 12, 11, 13, 12, 14, 13, 15], col: 'var(--accent)' },
];

const FEED = [
  { t: <><b>Priya N.</b> upgraded to Scale plan</>, tm: 'just now' },
  { t: <>New webhook connected · <b>Stripe</b></>, tm: '2 min ago' },
  { t: <><b>27 users</b> completed onboarding</>, tm: '11 min ago' },
  { t: <>Latency alert cleared in <b>us-east</b></>, tm: '24 min ago' },
  { t: <>Report exported by <b>Ari R.</b></>, tm: '1 hr ago' },
];

const BARS = [['Direct', 82], ['Organic', 96], ['Referral', 54], ['Social', 68], ['Email', 43], ['Paid', 71]] as [string, number][];
const BARS2 = [['Search', 88], ['Social', 62], ['Direct', 74], ['Partner', 41], ['Ads', 57]] as [string, number][];
const BARS_AUDIENCE = [['United States', 124], ['United Kingdom', 82], ['Germany', 64], ['Japan', 52], ['Canada', 41], ['Australia', 38]] as [string, number][];
const BARS_CAMPAIGNS = [['Search', 72], ['Social', 58], ['Display', 44], ['Email', 31], ['Video', 66]] as [string, number][];

const SEG_DATA = [
  { name: 'Developers', size: '42%', val: '10.4k', growth: '+14.2%', ok: true },
  { name: 'Designers', size: '28%', val: '6.9k', growth: '+8.1%', ok: true },
  { name: 'Product Managers', size: '18%', val: '4.4k', growth: '-1.4%', ok: false },
  { name: 'Marketers', size: '12%', val: '2.9k', growth: '+22.0%', ok: true }
];

const SEARCH_PAGES = [
  { id: 'overview', title: 'Overview', group: 'Workspace' },
  { id: 'analytics', title: 'Analytics', group: 'Workspace' },
  { id: 'transactions', title: 'Transactions', group: 'Workspace' },
  { id: 'audience', title: 'Audience', group: 'Workspace' },
  { id: 'reports', title: 'Reports', group: 'Workspace' },
  { id: 'campaigns', title: 'Campaigns', group: 'Workspace' },
  { id: 'settings', title: 'Settings', group: 'System' }
];

function gen(seed: number, n = 30, base = 40, amp = 22) {
  let v = base, out = [];
  for (let i = 0; i < n; i++) {
    v += (Math.sin(i * 0.5 + seed) * amp + (Math.random() - .5) * 14) * 0.32;
    out.push(Math.max(8, v));
  }
  return out;
}

const SERIES = [
  { col: 'var(--accent)', data: gen(1, 30, 52, 18) },
  { col: 'var(--accent-2)', data: gen(3, 30, 34, 14) },
  { col: 'var(--accent-3)', data: gen(5, 30, 20, 10) }
];

const SWATCHES = [
  { hex: '#9D8CFF', label: 'Indigo' },
  { hex: '#4FE3C7', label: 'Teal' },
  { hex: '#FF9DB0', label: 'Rose' },
  { hex: '#5CE1A6', label: 'Emerald' },
  { hex: '#FFB84D', label: 'Amber' }
];

// Helper Functions
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

function hexA(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

function sparkPath(vals: number[], w = 78, h = 30) {
  const mx = Math.max(...vals), mn = Math.min(...vals), r = mx - mn || 1;
  return vals.map((v, i) => `${i ? 'L' : 'M'}${(i / (vals.length - 1) * w).toFixed(1)} ${(h - 2 - ((v - mn) / r) * (h - 4)).toFixed(1)}`).join(' ');
}

function smoothPath(pts: number[][]) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], mx = (x0 + x1) / 2;
    d += ` Q${x0},${y0} ${mx},${(y0 + y1) / 2} T${x1},${y1}`;
  }
  return d;
}

// Interfaces for fetched elements
interface ReportType {
  id: string;
  title: string;
  type: string;
  owner: string;
  status: string;
  status_class: string;
  created_at: string;
}

interface CampaignType {
  id: string;
  title: string;
  channel: string;
  spend: string;
  roas: string;
  status_class: string;
  created_at: string;
}

interface TransactionType {
  id: string;
  customer_name: string;
  plan: string;
  amount: string;
  status_class: string;
  status_text: string;
  color: string;
  created_at: string;
}

interface SettingType {
  is_dark: boolean;
  selected_swatch: string;
  live_stats: boolean;
  reduced_motion: boolean;
  compact_mode: boolean;
}

// Components
const CountUp = ({ target, prefix = '', suffix = '', dec = 0, active = true }: { target: number, prefix?: string, suffix?: string, dec?: number, active?: boolean }) => {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!active) {
      setVal(0);
      return;
    }
    let startTime: number;
    const dur = 1400;
    const isRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isRM) {
      setVal(target);
      return;
    }

    const step = (now: number) => {
      if (!startTime) startTime = now;
      const p = Math.min((now - startTime) / dur, 1);
      setVal(target * ease(p));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, active]);

  return <>{prefix}{val.toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec })}{suffix}</>;
};

const KpiCard = ({ kpi, index, live = true, active = true }: { kpi: any, index: number, live?: boolean, active?: boolean }) => {
  const [sparkData, setSparkData] = useState(kpi.spk);

  useEffect(() => {
    if (!live || !active) return;
    const isRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isRM) return;

    const interval = setInterval(() => {
      setSparkData((prev: any) => {
        const next = [...prev];
        next.shift();
        next.push(Math.max(6, next[next.length - 1] + (Math.random() - .45) * 6));
        return next;
      });
    }, 2600 + index * 200);
    return () => clearInterval(interval);
  }, [index, live, active]);

  return (
    <div className="card kpi reveal">
      <div className="kpi-top">
        <span className="kpi-label">{kpi.label}</span>
        <span className="kpi-ico" style={{ color: kpi.col }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <path d={kpi.ico} />
          </svg>
        </span>
      </div>
      <div className="kpi-val"><CountUp target={kpi.val} prefix={kpi.pfx} suffix={kpi.sfx} dec={kpi.dec} active={active} /></div>
      <div className="kpi-foot">
        <span className={`delta ${kpi.up ? 'up' : 'down'}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            {kpi.up ? <path d="M7 17L17 7M17 7H9M17 7v8" /> : <path d="M7 7l10 10M17 17H9M17 17V9" />}
          </svg>
          {kpi.delta}
        </span>
        <svg className="spark" viewBox="0 0 78 30">
          <path d={sparkPath(sparkData)} style={{ stroke: kpi.col }} />
        </svg>
      </div>
    </div>
  );
};

const AreaChart = ({ series, w = 760, h = 264 }: { series: typeof SERIES, w?: number, h?: number }) => {
  const pad = { l: 38, r: 14, t: 16, b: 26 };
  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;
  const all = series.flatMap(s => s.data);
  const mx = Math.max(...all, 1);
  const mn = 0;
  const r = mx - mn || 1;
  const days = series[0]?.data.length || 30;

  const X = (i: number) => pad.l + iw * (i / (days - 1));
  const Y = (v: number) => pad.t + ih - ((v - mn) / r) * ih;

  const [hover, setHover] = useState({ x: 0, ys: [] as number[], idx: 0, op: 0, rawX: 0, rectW: 0 });

  const handleMove = (e: React.PointerEvent) => {
    if (series.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width * 760;
    let idx = Math.round((px - 38) / (760 - 52) * (days - 1));
    idx = Math.max(0, Math.min(days - 1, idx));
    const gx = X(idx);
    setHover({ x: gx, ys: series.map(s => Y(s.data[idx])), idx, op: 1, rawX: (gx / 760) * rect.width, rectW: rect.width });
  };

  const yAxis = [0, 1, 2, 3, 4].map(i => {
    const y = pad.t + ih * (i / 4);
    const val = Math.round(mx - (mx * i / 4));
    return { y, val: val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val };
  });

  const xAxis = ['−30d', '−22d', '−15d', '−8d', 'Today'].map((l, i) => ({
    x: pad.l + iw * (i / 4), l, anchor: (i === 0 ? 'start' : i === 4 ? 'end' : 'middle') as "start" | "end" | "middle"
  }));

  return (
    <div className="chart-wrap" style={{ height: h }} onPointerMove={handleMove} onPointerLeave={() => setHover(prev => ({ ...prev, op: 0 }))}>
      <svg className="chart-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <defs>
          {series.map((s, i) => (
            <linearGradient key={i} id={`g${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={s.col} stopOpacity=".32" />
              <stop offset="1" stopColor={s.col} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {yAxis.map((tick, i) => (
          <g key={`y${i}`}>
            <line className="gridline" x1={pad.l} x2={w - pad.r} y1={tick.y} y2={tick.y} />
            <text className="axis-lbl" x={pad.l - 8} y={tick.y + 3} textAnchor="end">{tick.val}</text>
          </g>
        ))}

        {xAxis.map((tick, i) => (
          <text key={`x${i}`} className="axis-lbl" x={tick.x} y={h - 6} textAnchor={tick.anchor}>{tick.l}</text>
        ))}

        {series.map((s, i) => {
          const pts = s.data.map((v, j) => [X(j), Y(v)]);
          if (pts.length === 0) return null;
          const pathStr = smoothPath(pts);
          const areaStr = `${pathStr} L${X(days - 1)},${Y(0)} L${X(0)},${Y(0)} Z`;
          return (
            <g key={`s${i}`}>
              <path d={areaStr} fill={`url(#g${i})`} className="fade-in-area" style={{ animationDelay: `${650 + i * 150}ms` }} />
              <path d={pathStr} className="series-line" stroke={s.col} style={{ animationDelay: `${i * 150}ms` }} />
            </g>
          );
        })}

        <line className="hover-line" x1={hover.x} x2={hover.x} y1={16} y2={h - 26} style={{ opacity: hover.op }} />
        {hover.ys.map((y, i) => (
          <circle key={`d${i}`} className="hover-dot" cx={hover.x} cy={y} r={4.5} fill="var(--bg)" stroke={series[i]?.col || 'var(--accent)'} strokeWidth="2.4" style={{ opacity: hover.op }} />
        ))}
      </svg>
      {series.length > 0 && (
        <div className="tip" style={{ opacity: hover.op, left: Math.min(Math.max(0, hover.rawX - 70), hover.rectW - 140) + 'px', top: '4px' }}>
          Day −{days - 1 - hover.idx} · <b>${Math.round(series.reduce((a, s) => a + s.data[hover.idx], 0) * 1.2)}k MRR</b>
        </div>
      )}
    </div>
  );
};

const GaugeCard = ({ title, pct, subtitle, l1, l2, color, active = true }: { title: string, pct: number, subtitle: string, l1: any, l2: any, color: string, active?: boolean }) => {
  const [offset, setOffset] = useState(2 * Math.PI * 72);
  const c = 2 * Math.PI * 72;

  useEffect(() => {
    if (!active) {
      setOffset(c);
      return;
    }
    let startTime: number;
    const dur = 1600;
    const isRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isRM) {
      setOffset(c * (1 - pct / 100));
      return;
    }

    const step = (now: number) => {
      if (!startTime) startTime = now;
      const p = Math.min((now - startTime) / dur, 1);
      const currentPct = pct * ease(p);
      setOffset(c * (1 - currentPct / 100));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [pct, c, active]);

  return (
    <div className="card gauge-card reveal">
      <div className="card-h" style={{ justifyContent: 'center' }}><div className="card-t">{title}</div></div>
      <div className="gauge-wrap">
        <svg viewBox="0 0 180 180" style={{ width: '100%', height: '100%' }}>
          <circle cx="90" cy="90" r="72" fill="none" stroke="var(--glass-2)" strokeWidth="14" />
          <circle cx="90" cy="90" r="72" fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" transform="rotate(-90 90 90)" strokeDasharray={c} strokeDashoffset={offset} style={{ filter: 'drop-shadow(0 0 12px var(--glow))' }} />
        </svg>
        <div className="gauge-num">
          <div className="gauge-big mono"><CountUp target={pct} active={active} />%</div>
          <div className="gauge-cap">{subtitle}</div>
        </div>
      </div>
      <div className="gauge-legend">
        <div className="gl">{l1.label}<b className="mono">{l1.val}</b></div>
        <div className="gl">{l2.label}<b className="mono">{l2.val}</b></div>
      </div>
    </div>
  );
};

const BarChart = ({ data, active = true }: { data: [string, number][], active?: boolean }) => {
  const mx = Math.max(...data.map(d => d[1]), 1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (active) {
      setMounted(false);
      const timer = setTimeout(() => setMounted(true), 50);
      return () => clearTimeout(timer);
    } else {
      setMounted(false);
    }
  }, [active]);

  return (
    <div className="bars">
      {data.map(([l, v], i) => (
        <div key={i} className="bar-col">
          <div className="bar-track">
            <div className="bar" style={{ height: mounted ? `${(v / mx * 100).toFixed(0)}%` : '0%' }}></div>
          </div>
          <span className="bar-lbl">{l}</span>
          <span className="bar-val">{v}k</span>
        </div>
      ))}
    </div>
  );
};

const TransactionTable = ({ list, filterQuery = '', onRowClick }: { list: TransactionType[], filterQuery?: string, onRowClick?: (txn: TransactionType) => void }) => {
  const filtered = list.filter(t => 
    t.customer_name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    t.plan.toLowerCase().includes(filterQuery.toLowerCase()) ||
    t.status_text.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <table className="tbl">
      <thead>
        <tr><th>Customer</th><th>Plan</th><th>Amount</th><th>Status</th></tr>
      </thead>
      <tbody>
        {filtered.map((t, index) => (
          <tr 
            key={t.id || index} 
            data-n={t.customer_name}
            style={{ cursor: 'pointer' }}
            onClick={() => onRowClick && onRowClick(t)}
          >
            <td>
              <div className="who">
                <span className="av" style={{ background: `linear-gradient(135deg,${t.color},var(--accent-2))` }}>
                  {t.customer_name.split(' ').map(x => x[0]).join('')}
                </span>
                {t.customer_name}
              </div>
            </td>
            <td style={{ color: 'var(--text-dim)' }}>{t.plan}</td>
            <td className="amt">{t.amount}</td>
            <td><span className={`pill ${t.status_class}`}>{t.status_text}</span></td>
          </tr>
        ))}
        {filtered.length === 0 && (
          <tr className="empty-row">
            <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-faint)', padding: '24px' }}>
              No transactions found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default function Index() {
  const [view, setView] = useState('overview');
  const [isDark, setIsDark] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [time, setTime] = useState('');
  const [showToast, setShowToast] = useState(false);
  const activePillRef = useRef<HTMLButtonElement>(null);
  const [pillTop, setPillTop] = useState(0);

  // Lazy Preparation/Activation States
  const [prepared, setPrepared] = useState<Record<string, boolean>>({ overview: true });

  // Database / Fetched Data States
  const [reports, setReports] = useState<ReportType[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignType[]>([]);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);

  // Notifications State
  const [notifications, setNotifications] = useState(initialNotifications);
  const [notiOpen, setNotiOpen] = useState(false);
  const unreadCount = notifications.filter(n => n.unread).length;

  // Search State & Panel
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);

  // Drawer (Inspection details) State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<TransactionType | null>(null);

  // Main Chart Custom Options
  const [activeRange, setActiveRange] = useState('1M');
  const [activeSeries, setActiveSeries] = useState([true, true, true]); // Recurring, Expansion, One-time

  // Settings Toggles
  const [liveStats, setLiveStats] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [selectedSwatch, setSelectedSwatch] = useState('#9D8CFF');

  // Fetch all DB-backed data
  const loadData = async () => {
    try {
      const [repRes, campRes, txnRes, setRes] = await Promise.all([
        fetch(`${API_URL}/api/reports`),
        fetch(`${API_URL}/api/campaigns`),
        fetch(`${API_URL}/api/transactions`),
        fetch(`${API_URL}/api/settings`)
      ]);

      if (repRes.ok) setReports(await repRes.json());
      if (campRes.ok) setCampaigns(await campRes.json());
      if (txnRes.ok) setTransactions(await txnRes.json());
      if (setRes.ok) {
        const s: SettingType = await setRes.json();
        setIsDark(s.is_dark);
        applySwatch(s.selected_swatch);
        setLiveStats(s.live_stats);
        setReducedMotion(s.reduced_motion);
        setCompactMode(s.compact_mode);
      }
    } catch (err) {
      console.error("Error fetching console data:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save Settings to Backend helper
  const updateSetting = async (updates: Partial<SettingType>) => {
    const nextSettings = {
      is_dark: updates.is_dark !== undefined ? updates.is_dark : isDark,
      selected_swatch: updates.selected_swatch !== undefined ? updates.selected_swatch : selectedSwatch,
      live_stats: updates.live_stats !== undefined ? updates.live_stats : liveStats,
      reduced_motion: updates.reduced_motion !== undefined ? updates.reduced_motion : reducedMotion,
      compact_mode: updates.compact_mode !== undefined ? updates.compact_mode : compactMode
    };

    try {
      await fetch(`${API_URL}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextSettings)
      });
    } catch (err) {
      console.error("Error saving settings:", err);
    }
  };

  // Clock
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-GB'));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Theme & Reduced Motion & Compact Mode
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    document.body.classList.toggle('reduced', reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    document.body.classList.toggle('compact', compactMode);
  }, [compactMode]);

  // Pill Animation
  useEffect(() => {
    if (activePillRef.current) {
      setPillTop(activePillRef.current.parentElement?.offsetTop || 0);
    }
  }, [view]);

  // Reveal Animations
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((el, i) => {
      el.classList.remove('in');
      const delay = reducedMotion ? 0 : i * 70;
      setTimeout(() => el.classList.add('in'), delay);
    });
  }, [view, reducedMotion]);

  // Initial Toast
  useEffect(() => {
    const timer1 = setTimeout(() => setShowToast(true), 1300);
    const timer2 = setTimeout(() => setShowToast(false), 5300);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Global Mouse Effects (Spotlight & Tilt)
  useEffect(() => {
    const isRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches || reducedMotion;
    if (isRM) return;

    const handleMove = (e: PointerEvent) => {
      const spot = document.getElementById('spot');
      if (spot) {
        spot.style.left = `${e.clientX}px`;
        spot.style.top = `${e.clientY}px`;
        spot.style.opacity = '0.9';
      }

      const target = e.target as HTMLElement;
      const card = target.closest('.card') as HTMLElement;
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      }

      const kpi = target.closest('.kpi') as HTMLElement;
      if (kpi) {
        const r = kpi.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -7;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 7;
        kpi.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
      }
    };

    const handleLeave = (e: PointerEvent) => {
      const spot = document.getElementById('spot');
      if (spot) spot.style.opacity = '0';
      const target = e.target as HTMLElement;
      const kpi = target.closest('.kpi') as HTMLElement;
      if (kpi) kpi.style.transform = '';
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    document.addEventListener('pointerout', handleLeave);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerout', handleLeave);
    };
  }, [reducedMotion]);

  // CMD+K Search
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('.search input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Outer Click to Close Notification & Search Panels
  useEffect(() => {
    const handleOuterClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.notiwrap')) {
        setNotiOpen(false);
      }
      if (!target.closest('.searchwrap')) {
        setSearchPanelOpen(false);
      }
    };
    document.addEventListener('click', handleOuterClick);
    return () => document.removeEventListener('click', handleOuterClick);
  }, []);

  const handleNav = (v: string) => {
    setPrepared(prev => ({ ...prev, [v]: true }));
    setView(v);
    setSidebarOpen(false);
    document.getElementById('canvas')?.scrollTo(0, 0);
  };

  const applySwatch = (hex: string, persist = false) => {
    document.documentElement.style.setProperty('--accent', hex);
    document.documentElement.style.setProperty('--glow', hexA(hex, 0.45));
    setSelectedSwatch(hex);
    if (persist) {
      updateSetting({ selected_swatch: hex });
    }
  };

  const markAllRead = () => {
    setNotifications([]);
  };

  const toggleNotification = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const handleRowClick = (txn: TransactionType) => {
    setSelectedTxn(txn);
    setDrawerOpen(true);
  };

  // New Report Creator Handler
  const handleCreateReport = async () => {
    const types = ["Financial", "Product", "Retention", "Marketing", "Engineering"];
    const titles = ["Q4 Revenue Projection", "User Cohort Insights", "Feature Load Times", "Custom Query Export", "Database Integrity Log"];
    const statusOpts = [
      { s: "Ready", c: "ok" },
      { s: "Building", c: "wait" },
      { s: "Failed", c: "fail" }
    ];

    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomStatus = statusOpts[Math.floor(Math.random() * statusOpts.length)];

    const payload = {
      title: randomTitle,
      type: randomType,
      owner: "Ari Rhodes",
      status: randomStatus.s,
      status_class: randomStatus.c
    };

    try {
      const res = await fetch(`${API_URL}/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const nextReport = await res.json();
        setReports(prev => [nextReport, ...prev]);
      }
    } catch (err) {
      console.error("Error creating report:", err);
    }
  };

  // Get Series Data based on Range & Toggle Filters
  const getFilteredSeries = () => {
    let points = 30;
    if (activeRange === '1W') points = 7;
    if (activeRange === '1M') points = 30;
    if (activeRange === '3M') points = 45;
    if (activeRange === '1Y') points = 60;

    return SERIES.map((s, idx) => ({
      ...s,
      data: activeSeries[idx] ? s.data.slice(0, points) : s.data.slice(0, points).map(() => 0)
    }));
  };

  const viewTitles: Record<string, string> = {
    overview: 'Overview',
    analytics: 'Analytics',
    transactions: 'Transactions',
    audience: 'Audience',
    reports: 'Reports',
    campaigns: 'Campaigns',
    settings: 'Settings'
  };

  const viewGroups: Record<string, string> = {
    overview: 'Workspace',
    analytics: 'Workspace',
    transactions: 'Workspace',
    audience: 'Workspace',
    reports: 'Workspace',
    campaigns: 'Workspace',
    settings: 'System'
  };

  // Search Logic
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim()) {
      setSearchPanelOpen(true);
    } else {
      setSearchPanelOpen(false);
    }
  };

  const handleSearchItemClick = (item: any) => {
    setSearchQuery('');
    setSearchPanelOpen(false);
    if (item.type === 'page') {
      handleNav(item.id);
    } else if (item.type === 'customer') {
      handleNav('transactions');
      setSearchQuery(item.name);
    }
  };

  const getFilteredSearchItems = () => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { pages: [], customers: [] };

    const matchedPages = SEARCH_PAGES.filter(p => p.title.toLowerCase().includes(q))
      .map(p => ({ ...p, type: 'page' }));

    const matchedCustomers = transactions.filter(t => t.customer_name.toLowerCase().includes(q) || t.plan.toLowerCase().includes(q))
      .map(t => ({ id: t.customer_name, title: t.customer_name, subtitle: t.plan, type: 'customer', name: t.customer_name }));

    return { pages: matchedPages, customers: matchedCustomers };
  };

  const { pages: searchedPages, customers: searchedCustomers } = getFilteredSearchItems();
  const hasSearchResults = searchedPages.length > 0 || searchedCustomers.length > 0;

  return (
    <>
      <div className="aurora">
        <span className="blob b1"></span><span className="blob b2"></span>
        <span className="blob b3"></span><span className="blob b4"></span>
      </div>
      <div className="grain"></div>
      <div className="spotlight" id="spot"></div>

      <div className="app">
        <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${sidebarOpen ? 'open' : ''}`} id="sidebar">
          <div className="brand">
            <div className="brand-mark"></div>
            <div className="brand-txt">
              <div className="brand-name display">Cadence</div>
              <div className="brand-sub">Analytics Console</div>
            </div>
          </div>

          <div className="nav-label">Workspace</div>
          <ul className="nav">
            <div className="nav-pill" style={{ transform: `translateY(${pillTop}px)`, opacity: ['overview', 'analytics', 'transactions', 'audience', 'reports', 'campaigns'].includes(view) ? 1 : 0 }}></div>
            <li>
              <button 
                className={`nav-item ${view === 'overview' ? 'active' : ''}`} 
                onClick={() => handleNav('overview')}
                ref={view === 'overview' ? activePillRef : null}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" />
                  <rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" />
                </svg>
                <span className="nav-txt">Overview</span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-item ${view === 'analytics' ? 'active' : ''}`} 
                onClick={() => handleNav('analytics')}
                ref={view === 'analytics' ? activePillRef : null}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 3v18h18" /><path d="M7 15l3-4 3 2 4-6" />
                </svg>
                <span className="nav-txt">Analytics</span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-item ${view === 'transactions' ? 'active' : ''}`} 
                onClick={() => handleNav('transactions')}
                ref={view === 'transactions' ? activePillRef : null}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 7h16M4 7l3-3M4 7l3 3M20 17H4m16 0l-3-3m3 3l-3 3" />
                </svg>
                <span className="nav-txt">Transactions</span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-item ${view === 'audience' ? 'active' : ''}`} 
                onClick={() => handleNav('audience')}
                ref={view === 'audience' ? activePillRef : null}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                </svg>
                <span className="nav-txt">Audience</span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-item ${view === 'reports' ? 'active' : ''}`} 
                onClick={() => handleNav('reports')}
                ref={view === 'reports' ? activePillRef : null}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h5"/></svg>
                <span className="nav-txt">Reports</span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-item ${view === 'campaigns' ? 'active' : ''}`} 
                onClick={() => handleNav('campaigns')}
                ref={view === 'campaigns' ? activePillRef : null}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></svg>
                <span className="nav-txt">Campaigns</span>
                
              </button>
            </li>
          </ul>

          <div className="nav-label">System</div>
          <ul className="nav">
            <div className="nav-pill" style={{ transform: `translateY(${pillTop}px)`, opacity: view === 'settings' ? 1 : 0 }}></div>
            <li>
              <button 
                className={`nav-item ${view === 'settings' ? 'active' : ''}`} 
                onClick={() => handleNav('settings')}
                ref={view === 'settings' ? activePillRef : null}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
                  <circle cx="12" cy="12" r="3.5" />
                </svg>
                <span className="nav-txt">Settings</span>
              </button>
            </li>
          </ul>

          <div className="side-foot">
            <div className="user">
              <div className="avatar">AR</div>
              <div className="user-txt">
                <div className="user-name">Ari Rhodes</div>
                <div className="user-mail">ari@cadence.io</div>
              </div>
            </div>
          </div>
        </aside>

        <div className="main">
          <header className="topbar">
            <button className="icon-btn" onClick={() => {
              if (window.innerWidth <= 820) setSidebarOpen(!sidebarOpen);
              else setSidebarCollapsed(!sidebarCollapsed);
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div>
              <div className="page-title">{viewTitles[view]}</div>
              <div className="crumb">Cadence / {viewGroups[view]} / {viewTitles[view]}</div>
            </div>
            <div className="spacer"></div>
            
            {/* Search component wrapped in searchwrap */}
            <div className="searchwrap">
              <label className="search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
                <input 
                  placeholder="Search metrics, users…" 
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => { if (searchQuery.trim()) setSearchPanelOpen(true); }}
                />
                <kbd>⌘K</kbd>
              </label>

              <div className={`search-panel ${searchPanelOpen ? 'open' : ''}`} id="searchPanel">
                {hasSearchResults ? (
                  <>
                    {searchedPages.length > 0 && (
                      <>
                        <div className="sp-group-title">Pages</div>
                        {searchedPages.map(p => (
                          <button key={p.id} className="sp-item" data-nav={p.id} onClick={() => handleSearchItemClick(p)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" /></svg>
                            <div>
                              <div style={{ fontWeight: 500 }}>{p.title}</div>
                              <div style={{ fontSize: '10.5px', color: 'var(--text-faint)' }}>{p.group}</div>
                            </div>
                          </button>
                        ))}
                      </>
                    )}
                    {searchedCustomers.length > 0 && (
                      <>
                        <div className="sp-group-title">Customers</div>
                        {searchedCustomers.map(c => (
                          <button key={c.id} className="sp-item" data-cust={c.name} onClick={() => handleSearchItemClick(c)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            <div>
                              <div style={{ fontWeight: 500 }}>{c.title}</div>
                              <div style={{ fontSize: '10.5px', color: 'var(--text-faint)' }}>{c.subtitle}</div>
                            </div>
                          </button>
                        ))}
                      </>
                    )}
                  </>
                ) : (
                  <div style={{ padding: '14px 10px', textAlign: 'center', color: 'var(--text-faint)', fontSize: '12px' }}>
                    No results found
                  </div>
                )}
              </div>
            </div>

            <div className="clock"><span className="pulse"></span><span>{time || '--:--:--'}</span></div>
            
            {/* Notification Dropdown wrapped in notiwrap */}
            <div className="notiwrap">
              <button className="icon-btn" id="bell" aria-label="Notifications" onClick={(e) => { e.stopPropagation(); setNotiOpen(!notiOpen); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                  <path d="M10.5 21a1.5 1.5 0 0 0 3 0"/>
                </svg>
                <span className={`noti-badge ${unreadCount === 0 ? 'hide' : ''}`} id="bellBadge">{unreadCount}</span>
              </button>

              <div className={`noti-panel ${notiOpen ? 'open' : ''}`} id="notiPanel">
                <div className="noti-h">
                  <b>Notifications</b>
                  <span id="notiClear" onClick={markAllRead}>Mark all read</span>
                </div>
                <div id="notiList">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div key={n.id} className="noti-item" onClick={() => toggleNotification(n.id)}>
                        {n.unread && <span className="nd"></span>}
                        <div>
                          <div className="ftxt">{n.text}</div>
                          <div className="ftime" style={{ fontSize: '10.5px', color: 'var(--text-faint)', marginTop: '2px' }}>{n.time}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '22px', textAlign: 'center', color: 'var(--text-faint)', fontSize: '12.5px' }}>
                      You are all caught up ✦
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button className="icon-btn" onClick={() => {
              const nextVal = !isDark;
              setIsDark(nextVal);
              updateSetting({ is_dark: nextVal });
            }} aria-label="Toggle theme">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                {isDark ? (
                  <><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" /></>
                ) : (
                  <path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" />
                )}
              </svg>
            </button>
          </header>

          <div className="canvas" id="canvas">
            {/* OVERVIEW */}
            <section className={`view ${view === 'overview' ? 'on' : ''}`}>
              <div className="grid kpis">
                {KPIS_OVERVIEW.map((k, i) => <KpiCard key={i} kpi={k} index={i} live={liveStats} active={view === 'overview'} />)}
              </div>
              <div className="grid layout">
                <div className="stack">
                  <div className="card chart-card reveal">
                    <div className="card-h">
                      <div>
                        <div className="card-t"><span className="tag"></span>Revenue flow</div>
                        <div className="legend" style={{ marginTop: '12px' }} id="legend">
                          <span className={`leg ${!activeSeries[0] ? 'off' : ''}`} onClick={() => setActiveSeries(prev => [!prev[0], prev[1], prev[2]])}>
                            <i style={{ background: 'var(--accent)', color: 'var(--accent)' }}></i>Recurring
                          </span>
                          <span className={`leg ${!activeSeries[1] ? 'off' : ''}`} onClick={() => setActiveSeries(prev => [prev[0], !prev[1], prev[2]])}>
                            <i style={{ background: 'var(--accent-2)', color: 'var(--accent-2)' }}></i>Expansion
                          </span>
                          <span className={`leg ${!activeSeries[2] ? 'off' : ''}`} onClick={() => setActiveSeries(prev => [prev[0], prev[1], !prev[2]])}>
                            <i style={{ background: 'var(--accent-3)', color: 'var(--accent-3)' }}></i>One-time
                          </span>
                        </div>
                      </div>
                      <div className="ranges" id="ranges">
                        {['1W', '1M', '3M', '1Y'].map(r => (
                          <button key={r} className={`range ${activeRange === r ? 'on' : ''}`} onClick={() => setActiveRange(r)}>{r}</button>
                        ))}
                      </div>
                    </div>
                    {view === 'overview' && <AreaChart key={`${view}-${activeRange}-${activeSeries.join('-')}`} series={getFilteredSeries()} />}
                  </div>
                  <div className="grid two">
                    <div className="card reveal">
                      <div className="card-h"><div className="card-t"><span className="tag" style={{ background: 'var(--accent-2)' }}></span>Traffic by channel</div></div>
                      <BarChart data={BARS} active={view === 'overview'} />
                    </div>
                    <GaugeCard 
                      title="Goal completion" 
                      pct={77} 
                      subtitle="of Q3 target" 
                      l1={{ label: 'Booked', val: <CountUp target={1.84} prefix="$" suffix="M" dec={2} active={view === 'overview'} /> }}
                      l2={{ label: 'Target', val: '$2.4M' }}
                      color="var(--accent)"
                      active={view === 'overview'}
                    />
                  </div>
                </div>
                <div className="stack">
                  <div className="card reveal">
                    <div className="card-h"><div className="card-t"><span className="tag" style={{ background: 'var(--accent-3)' }}></span>Live activity</div></div>
                    <ul className="feed">
                      {FEED.map((f, i) => (
                        <li key={i}><span className="fdot"></span><div className="ftxt">{f.t}</div><div className="ftime">{f.tm}</div></li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="grid full" style={{ marginTop: '18px' }}>
                <div className="card reveal">
                  <div className="card-h">
                    <div className="card-t">Recent transactions</div>
                    <button className="range" style={{ border: '1px solid var(--glass-border)' }} onClick={() => handleNav('transactions')}>View all →</button>
                  </div>
                  <TransactionTable list={transactions.slice(0, 6)} filterQuery={searchQuery} onRowClick={handleRowClick} />
                </div>
              </div>
            </section>

            {/* ANALYTICS */}
            {prepared.analytics && (
              <section className={`view ${view === 'analytics' ? 'on' : ''}`}>
                <div className="grid kpis">
                  {KPIS_ANALYTICS.map((k, i) => <KpiCard key={i} kpi={k} index={i} live={liveStats} active={view === 'analytics'} />)}
                </div>
                <div className="grid two">
                  <div className="card chart-card reveal">
                    <div className="card-h"><div className="card-t"><span className="tag"></span>Engagement trend</div></div>
                    {view === 'analytics' && <AreaChart key={`${view}-${activeRange}-${activeSeries.join('-')}`} series={getFilteredSeries().slice(0, 2)} h={280} />}
                  </div>
                  <GaugeCard 
                    title="Retention health" 
                    pct={91} 
                    subtitle="30-day retained" 
                    l1={{ label: 'Churned', val: '3.1%' }}
                    l2={{ label: 'Cohort', val: '18.4k' }}
                    color="var(--accent-2)"
                    active={view === 'analytics'}
                  />
                </div>
                <div className="grid full" style={{ marginTop: '18px' }}>
                  <div className="card reveal">
                    <div className="card-h"><div className="card-t"><span className="tag" style={{ background: 'var(--accent-2)' }}></span>Acquisition by source</div></div>
                    <BarChart data={BARS2} active={view === 'analytics'} />
                  </div>
                </div>
              </section>
            )}

            {/* TRANSACTIONS */}
            {prepared.transactions && (
              <section className={`view ${view === 'transactions' ? 'on' : ''}`}>
                <div className="grid kpis">
                  {KPIS_TRANSACTIONS.map((k, i) => <KpiCard key={i} kpi={k} index={i} live={liveStats} active={view === 'transactions'} />)}
                </div>
                <div className="grid full">
                  <div className="card reveal">
                    <div className="card-h">
                      <div className="card-t">All transactions</div>
                    </div>
                    <TransactionTable list={transactions} filterQuery={searchQuery} onRowClick={handleRowClick} />
                  </div>
                </div>
              </section>
            )}

            {/* AUDIENCE */}
            {prepared.audience && (
              <section className={`view ${view === 'audience' ? 'on' : ''}`}>
                <div className="grid kpis">
                  {KPIS_AUDIENCE.map((k, i) => <KpiCard key={i} kpi={k} index={i} live={liveStats} active={view === 'audience'} />)}
                </div>
                <div className="grid layout">
                  <div className="stack">
                    <div className="card chart-card reveal">
                      <div className="card-h">
                        <div className="card-t"><span className="tag"></span>Audience Growth</div>
                      </div>
                      {view === 'audience' && <AreaChart key={`${view}-${activeRange}-${activeSeries.join('-')}`} series={[SERIES[1], SERIES[2]]} h={280} />}
                    </div>
                    <div className="grid two">
                      <div className="card reveal">
                        <div className="card-h">
                          <div className="card-t"><span className="tag" style={{ background: 'var(--accent)' }}></span>Top Demographics</div>
                        </div>
                        <BarChart data={BARS_AUDIENCE} active={view === 'audience'} />
                      </div>
                      <GaugeCard 
                        title="Activation rate" 
                        pct={68} 
                        subtitle="Completed profile" 
                        l1={{ label: 'Active', val: '12.5k' }}
                        l2={{ label: 'Target', val: '18.4k' }}
                        color="var(--accent-3)"
                        active={view === 'audience'}
                      />
                    </div>
                  </div>
                  <div className="stack">
                    <div className="card reveal bg-glass">
                      <div className="card-h">
                        <div className="card-t"><span className="tag" style={{ background: 'var(--accent)' }}></span>Audience Segments</div>
                      </div>
                      <table className="tbl" id="segTable">
                        <thead>
                          <tr><th>Segment</th><th>Size</th><th>Users</th><th>Growth</th></tr>
                        </thead>
                        <tbody>
                          {SEG_DATA.map((s, i) => (
                            <tr key={i}>
                              <td style={{ fontWeight: 600 }}>{s.name}</td>
                              <td>{s.size}</td>
                              <td className="mono">{s.val}</td>
                              <td>
                                <span className={`pill ${s.ok ? 'ok' : 'fail'}`}>{s.growth}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* REPORTS */}
            {prepared.reports && (
              <section className={`view ${view === 'reports' ? 'on' : ''}`} id="v-reports">
                <div className="grid kpis">
                  {KPIS_REPORTS.map((k, i) => <KpiCard key={i} kpi={k} index={i} live={liveStats} active={view === 'reports'} />)}
                </div>
                <div className="grid two">
                  <div className="card chart-card reveal">
                    <div className="card-h">
                      <div className="card-t"><span className="tag"></span>Reports generated</div>
                    </div>
                    {view === 'reports' && <AreaChart key={`${view}-${activeRange}-${activeSeries.join('-')}`} series={getFilteredSeries().slice(2, 3)} h={280} />}
                  </div>
                  <GaugeCard 
                    title="Storage used" 
                    pct={62} 
                    subtitle="of 500 GB" 
                    l1={{ label: 'Used', val: '310 GB' }}
                    l2={{ label: 'Free', val: '190 GB' }}
                    color="var(--accent-3)"
                    active={view === 'reports'}
                  />
                </div>
                <div className="grid full" style={{ marginTop: '18px' }}>
                  <div className="card reveal">
                    <div className="card-h">
                      <div className="card-t">Recent reports</div>
                      <button className="range" style={{ border: '1px solid var(--glass-border)' }} onClick={handleCreateReport}>New report +</button>
                    </div>
                    <table className="tbl" id="repTable">
                      <thead>
                        <tr><th>Report</th><th>Type</th><th>Owner</th><th>Status</th></tr>
                      </thead>
                      <tbody>
                        {reports.map((r, i) => (
                          <tr key={r.id || i}>
                            <td>{r.title}</td>
                            <td style={{ color: 'var(--text-dim)' }}>{r.type}</td>
                            <td>{r.owner}</td>
                            <td><span className={`pill ${r.status_class}`}>{r.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* CAMPAIGNS */}
            {prepared.campaigns && (
              <section className={`view ${view === 'campaigns' ? 'on' : ''}`} id="v-campaigns">
                <div className="grid kpis">
                  {KPIS_CAMPAIGNS.map((k, i) => <KpiCard key={i} kpi={k} index={i} live={liveStats} active={view === 'campaigns'} />)}
                </div>
                <div className="grid two">
                  <div className="card reveal">
                    <div className="card-h">
                      <div className="card-t"><span className="tag" style={{ background: 'var(--accent-2)' }}></span>Spend by channel</div>
                    </div>
                    <BarChart data={BARS_CAMPAIGNS} active={view === 'campaigns'} />
                  </div>
                  <GaugeCard 
                    title="Budget used" 
                    pct={74} 
                    subtitle="of Q3 budget" 
                    l1={{ label: 'Spent', val: '$48.2k' }}
                    l2={{ label: 'Budget', val: '$65k' }}
                    color="var(--accent)"
                    active={view === 'campaigns'}
                  />
                </div>
                <div className="grid full" style={{ marginTop: '18px' }}>
                  <div className="card reveal">
                    <div className="card-h">
                      <div className="card-t">Top campaigns</div>
                    </div>
                    <table className="tbl" id="campTable">
                      <thead>
                        <tr><th>Campaign</th><th>Channel</th><th>Spend</th><th>ROAS</th></tr>
                      </thead>
                      <tbody>
                        {campaigns.map((c, i) => (
                          <tr key={c.id || i}>
                            <td>{c.title}</td>
                            <td style={{ color: 'var(--text-dim)' }}>{c.channel}</td>
                            <td className="amt">{c.spend}</td>
                            <td><span className={`pill ${c.status_class}`}>{c.roas}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* SETTINGS */}
            <section className={`view ${view === 'settings' ? 'on' : ''}`}>
              <div className="grid two">
                <div className="card reveal">
                  <div className="card-h" style={{ marginBottom: '20px' }}>
                    <div className="card-t">Visual Theme</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <p style={{ fontSize: '12.5px', color: 'var(--text-dim)', marginBottom: '8px' }}>Select interface appearance</p>
                      <div className="seg-theme" id="segTheme">
                        <button className={`seg-btn ${!isDark ? 'on' : ''}`} onClick={() => {
                          setIsDark(false);
                          updateSetting({ is_dark: false });
                        }}>Light</button>
                        <button className={`seg-btn ${isDark ? 'on' : ''}`} onClick={() => {
                          setIsDark(true);
                          updateSetting({ is_dark: true });
                        }}>Dark</button>
                      </div>
                    </div>

                    <div>
                      <p style={{ fontSize: '12.5px', color: 'var(--text-dim)', marginBottom: '8px' }}>Accent color swatch</p>
                      <div className="swatches" id="swatches">
                        {SWATCHES.map(s => (
                          <div 
                            key={s.hex}
                            className={`swatch ${selectedSwatch === s.hex ? 'on' : ''}`}
                            style={{ backgroundColor: s.hex }}
                            onClick={() => applySwatch(s.hex, true)}
                            title={s.label}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card reveal">
                  <div className="card-h" style={{ marginBottom: '20px' }}>
                    <div className="card-t">Console Performance</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="sw-row">
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '13px' }}>Live Sync Stats</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-faint)' }}>Update sparklines in real-time</div>
                      </div>
                      <div className="sw-btn" id="swLive" data-on={liveStats} onClick={() => {
                        const nextVal = !liveStats;
                        setLiveStats(nextVal);
                        updateSetting({ live_stats: nextVal });
                      }}></div>
                    </div>

                    <div className="sw-row">
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '13px' }}>Reduced Motion</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-faint)' }}>Minimize transition animations</div>
                      </div>
                      <div className="sw-btn" id="swMotion" data-on={reducedMotion} onClick={() => {
                        const nextVal = !reducedMotion;
                        setReducedMotion(nextVal);
                        updateSetting({ reduced_motion: nextVal });
                      }}></div>
                    </div>

                    <div className="sw-row">
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '13px' }}>Compact Density</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-faint)' }}>Reduce paddings for high data density</div>
                      </div>
                      <div className="sw-btn" id="swCompact" data-on={compactMode} onClick={() => {
                        const nextVal = !compactMode;
                        setCompactMode(nextVal);
                        updateSetting({ compact_mode: nextVal });
                      }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Transaction Details Slide-out Drawer Component */}
      <div className={`drawer-scrim ${drawerOpen ? 'open' : ''}`} onClick={() => setDrawerOpen(false)}></div>
      <aside className={`drawer ${drawerOpen ? 'open' : ''}`}>
        {selectedTxn && (
          <>
            <div className="drawer-h">
              <h3 className="display" style={{ fontSize: '16px', fontWeight: 600 }}>Inspection Panel</h3>
              <button className="drawer-close" aria-label="Close" onClick={() => setDrawerOpen(false)}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="drawer-profile">
              <span className="av" id="dAv" style={{ background: `linear-gradient(135deg,${selectedTxn.color},var(--accent-2))` }}>
                {selectedTxn.customer_name.split(' ').map(x => x[0]).join('')}
              </span>
              <div>
                <div id="dName" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>{selectedTxn.customer_name}</div>
                <div id="dPlan" style={{ fontSize: '12.5px', color: 'var(--text-dim)', marginTop: '2px' }}>{selectedTxn.plan}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span id="dAmt" className="mono" style={{ fontSize: '18px', fontWeight: 500 }}>{selectedTxn.amount}</span>
                <span id="dStatus"><span className={`pill ${selectedTxn.status_class}`}>{selectedTxn.status_text}</span></span>
              </div>
            </div>

            <div className="drawer-section">
              <div className="ds-title">Mini Sparkline</div>
              <svg className="spark" viewBox="0 0 78 30" style={{ width: '100%', height: '40px' }}>
                <path d={sparkPath([12, 18, 14, 24, 20, 28, 22, 34])} style={{ stroke: selectedTxn.color, fill: 'none', strokeWidth: 2 }} />
              </svg>
            </div>

            <div className="drawer-section">
              <div className="ds-title">Status Timeline</div>
              <div className="timeline">
                <div className="tl-item">
                  <span className="tl-dot done"></span>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>Invoice Created</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Jul 12, 2026 · 14:32</div>
                </div>
                <div className="tl-item">
                  <span className={`tl-dot ${selectedTxn.status_class === 'ok' ? 'done' : selectedTxn.status_class === 'wait' ? 'active' : 'fail'}`}></span>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>
                    {selectedTxn.status_class === 'ok' ? 'Payment Cleared' : selectedTxn.status_class === 'wait' ? 'Processing Transfer' : 'Payment Failed'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Jul 12, 2026 · 14:35</div>
                </div>
                <div className="tl-item">
                  <span className={`tl-dot ${selectedTxn.status_class === 'ok' ? 'active' : ''}`}></span>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>Provisioning Access</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>
                    {selectedTxn.status_class === 'ok' ? 'Completed successfully' : selectedTxn.status_class === 'wait' ? 'Awaiting clearance' : 'Halted due to exception'}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>

      <div className={`scrim ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)}></div>
      <div className={`toast ${showToast ? 'show' : ''}`}>
        <div className="toast-ico">
          <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6L9 17l-5-5" /></svg>
        </div>
        <div>
          <b>All systems nominal</b>
          <p>Live sync active · 4 data sources connected</p>
        </div>
      </div>
    </>
  );
}

const initialNotifications = [
  { id: 1, text: <><b>Priya N.</b> upgraded to Scale plan</>, time: 'just now', unread: true },
  { id: 2, text: <>New webhook connected · <b>Stripe</b></>, time: '2 min ago', unread: true },
  { id: 3, text: <><b>27 users</b> completed onboarding</>, time: '11 min ago', unread: true },
];
