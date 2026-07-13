import React, { useState, useEffect, useRef } from 'react';

// Data Constants
const KPIS = [
  { label: 'Active users', val: 24817, pfx: '', sfx: '', dec: 0, delta: '+12.4%', up: true, ico: 'M12 2a5 5 0 100 10 5 5 0 000-10zM3 22c0-5 4-8 9-8s9 3 9 8', spk: [8, 12, 10, 15, 13, 18, 16, 22, 20, 26], col: 'var(--accent)' },
  { label: 'Revenue', val: 184920, pfx: '$', sfx: '', dec: 0, delta: '+8.1%', up: true, ico: 'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6', spk: [20, 18, 22, 19, 24, 23, 28, 26, 31, 34], col: 'var(--accent-2)' },
  { label: 'Conversion', val: 3.84, pfx: '', sfx: '%', dec: 2, delta: '-0.6%', up: false, ico: 'M22 12h-4l-3 9L9 3l-3 9H2', spk: [14, 16, 15, 13, 14, 12, 13, 11, 12, 10], col: 'var(--accent-3)' },
  { label: 'Avg latency', val: 142, pfx: '', sfx: 'ms', dec: 0, delta: '-18ms', up: true, ico: 'M13 2L3 14h7l-1 8 10-12h-7l1-8z', spk: [26, 22, 24, 20, 18, 19, 15, 16, 13, 12], col: 'var(--accent)' },
];

const FEED = [
  { t: <><b>Priya N.</b> upgraded to Scale plan</>, tm: 'just now' },
  { t: <>New webhook connected · <b>Stripe</b></>, tm: '2 min ago' },
  { t: <><b>27 users</b> completed onboarding</>, tm: '11 min ago' },
  { t: <>Latency alert cleared in <b>us-east</b></>, tm: '24 min ago' },
  { t: <>Report exported by <b>Ari R.</b></>, tm: '1 hr ago' },
];

const TXN = [
  { n: 'Priya Nair', e: 'Scale · annual', amt: '$4,800', s: 'ok', st: 'Paid', c: 'var(--accent)' },
  { n: 'Marcus Vale', e: 'Pro · monthly', amt: '$149', s: 'ok', st: 'Paid', c: 'var(--accent-2)' },
  { n: 'Dana Osei', e: 'Scale · monthly', amt: '$620', s: 'wait', st: 'Pending', c: 'var(--accent-3)' },
  { n: 'Leo Fischer', e: 'Starter · monthly', amt: '$29', s: 'ok', st: 'Paid', c: 'var(--accent)' },
  { n: 'Yuki Tanaka', e: 'Pro · annual', amt: '$1,490', s: 'fail', st: 'Failed', c: 'var(--neg)' },
  { n: 'Sofia Reyes', e: 'Scale · annual', amt: '$5,240', s: 'ok', st: 'Paid', c: 'var(--accent-2)' },
];

const BARS = [['Direct', 82], ['Organic', 96], ['Referral', 54], ['Social', 68], ['Email', 43], ['Paid', 71]] as [string, number][];
const BARS2 = [['Search', 88], ['Social', 62], ['Direct', 74], ['Partner', 41], ['Ads', 57]] as [string, number][];
const BARS_AUDIENCE = [['United States', 124], ['United Kingdom', 82], ['Germany', 64], ['Japan', 52], ['Canada', 41], ['Australia', 38]] as [string, number][];

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

// Components
const CountUp = ({ target, prefix = '', suffix = '', dec = 0 }: { target: number, prefix?: string, suffix?: string, dec?: number }) => {
  const [val, setVal] = useState(0);

  useEffect(() => {
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
  }, [target]);

  return <>{prefix}{val.toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec })}{suffix}</>;
};

const KpiCard = ({ kpi, index, live = true }: { kpi: typeof KPIS[0], index: number, live?: boolean }) => {
  const [sparkData, setSparkData] = useState(kpi.spk);

  useEffect(() => {
    if (!live) return;
    const isRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isRM) return;

    const interval = setInterval(() => {
      setSparkData(prev => {
        const next = [...prev];
        next.shift();
        next.push(Math.max(6, next[next.length - 1] + (Math.random() - .45) * 6));
        return next;
      });
    }, 2600 + index * 200);
    return () => clearInterval(interval);
  }, [index, live]);

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
      <div className="kpi-val"><CountUp target={kpi.val} prefix={kpi.pfx} suffix={kpi.sfx} dec={kpi.dec} /></div>
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

const GaugeCard = ({ title, pct, subtitle, l1, l2, color }: { title: string, pct: number, subtitle: string, l1: any, l2: any, color: string }) => {
  const [offset, setOffset] = useState(2 * Math.PI * 72);
  const c = 2 * Math.PI * 72;

  useEffect(() => {
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
  }, [pct, c]);

  return (
    <div className="card gauge-card reveal">
      <div className="card-h" style={{ justifyContent: 'center' }}><div className="card-t">{title}</div></div>
      <div className="gauge-wrap">
        <svg viewBox="0 0 180 180" style={{ width: '100%', height: '100%' }}>
          <circle cx="90" cy="90" r="72" fill="none" stroke="var(--glass-2)" strokeWidth="14" />
          <circle cx="90" cy="90" r="72" fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" transform="rotate(-90 90 90)" strokeDasharray={c} strokeDashoffset={offset} style={{ filter: 'drop-shadow(0 0 12px var(--glow))' }} />
        </svg>
        <div className="gauge-num">
          <div className="gauge-big mono"><CountUp target={pct} />%</div>
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

const BarChart = ({ data }: { data: [string, number][] }) => {
  const mx = Math.max(...data.map(d => d[1]), 1);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 350);
    return () => clearTimeout(timer);
  }, []);

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

const TransactionTable = ({ filterQuery = '' }: { filterQuery?: string }) => {
  const filtered = TXN.filter(t => 
    t.n.toLowerCase().includes(filterQuery.toLowerCase()) ||
    t.e.toLowerCase().includes(filterQuery.toLowerCase()) ||
    t.st.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <table className="tbl">
      <thead>
        <tr><th>Customer</th><th>Plan</th><th>Amount</th><th>Status</th></tr>
      </thead>
      <tbody>
        {filtered.map((t, i) => (
          <tr key={i}>
            <td>
              <div className="who">
                <span className="av" style={{ background: `linear-gradient(135deg,${t.c},var(--accent-2))` }}>
                  {t.n.split(' ').map(x => x[0]).join('')}
                </span>
                {t.n}
              </div>
            </td>
            <td style={{ color: 'var(--text-dim)' }}>{t.e}</td>
            <td className="amt">{t.amt}</td>
            <td><span className={`pill ${t.s}`}>{t.st}</span></td>
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

  // Notifications State
  const [notifications, setNotifications] = useState(initialNotifications);
  const [notiOpen, setNotiOpen] = useState(false);
  const unreadCount = notifications.filter(n => n.unread).length;

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Main Chart Custom Options
  const [activeRange, setActiveRange] = useState('1M');
  const [activeSeries, setActiveSeries] = useState([true, true, true]); // Recurring, Expansion, One-time

  // Settings Toggles
  const [liveStats, setLiveStats] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [selectedSwatch, setSelectedSwatch] = useState('#9D8CFF');

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
      setTimeout(() => el.classList.add('in'), window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : i * 70);
    });
  }, [view]);

  // Initial Toast
  useEffect(() => {
    setTimeout(() => setShowToast(true), 1300);
    setTimeout(() => setShowToast(false), 5300);
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

  // Outer Click to Close Notification Panel
  useEffect(() => {
    const handleOuterClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.notiwrap')) {
        setNotiOpen(false);
      }
    };
    document.addEventListener('click', handleOuterClick);
    return () => document.removeEventListener('click', handleOuterClick);
  }, []);

  const handleNav = (v: string) => {
    setView(v);
    setSidebarOpen(false);
    document.getElementById('canvas')?.scrollTo(0, 0);
  };

  const applySwatch = (hex: string) => {
    document.documentElement.style.setProperty('--accent', hex);
    document.documentElement.style.setProperty('--glow', hexA(hex, 0.45));
    setSelectedSwatch(hex);
  };

  const markAllRead = () => {
    setNotifications([]);
  };

  const toggleNotification = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
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
    settings: 'Settings'
  };

  const viewGroups: Record<string, string> = {
    overview: 'Workspace',
    analytics: 'Workspace',
    transactions: 'Workspace',
    audience: 'Workspace',
    settings: 'System'
  };

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
            <div className="nav-pill" style={{ transform: `translateY(${pillTop}px)`, opacity: ['overview', 'analytics', 'transactions', 'audience'].includes(view) ? 1 : 0 }}></div>
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
            <label className="search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
              <input 
                placeholder="Search metrics, users…" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <kbd>⌘K</kbd>
            </label>
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

            <button className="icon-btn" onClick={() => setIsDark(!isDark)} aria-label="Toggle theme">
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
                {KPIS.map((k, i) => <KpiCard key={i} kpi={k} index={i} live={liveStats} />)}
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
                    {view === 'overview' && <AreaChart series={getFilteredSeries()} />}
                  </div>
                  <div className="grid two">
                    <div className="card reveal">
                      <div className="card-h"><div className="card-t"><span className="tag" style={{ background: 'var(--accent-2)' }}></span>Traffic by channel</div></div>
                      <BarChart data={BARS} />
                    </div>
                    <GaugeCard 
                      title="Goal completion" 
                      pct={77} 
                      subtitle="of Q3 target" 
                      l1={{ label: 'Booked', val: <CountUp target={1.84} prefix="$" suffix="M" dec={2} /> }}
                      l2={{ label: 'Target', val: '$2.4M' }}
                      color="var(--accent)"
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
                  <TransactionTable filterQuery={searchQuery} />
                </div>
              </div>
            </section>

            {/* ANALYTICS */}
            <section className={`view ${view === 'analytics' ? 'on' : ''}`}>
              <div className="grid kpis">
                {KPIS.map((k, i) => <KpiCard key={i} kpi={k} index={i} live={liveStats} />)}
              </div>
              <div className="grid two">
                <div className="card chart-card reveal">
                  <div className="card-h"><div className="card-t"><span className="tag"></span>Engagement trend</div></div>
                  {view === 'analytics' && <AreaChart series={getFilteredSeries().slice(0, 2)} h={280} />}
                </div>
                <GaugeCard 
                  title="Retention health" 
                  pct={91} 
                  subtitle="30-day retained" 
                  l1={{ label: 'Churned', val: '3.1%' }}
                  l2={{ label: 'Cohort', val: '18.4k' }}
                  color="var(--accent-2)"
                />
              </div>
              <div className="grid full" style={{ marginTop: '18px' }}>
                <div className="card reveal">
                  <div className="card-h"><div className="card-t"><span className="tag" style={{ background: 'var(--accent-2)' }}></span>Acquisition by source</div></div>
                  <BarChart data={BARS2} />
                </div>
              </div>
            </section>

            {/* TRANSACTIONS */}
            <section className={`view ${view === 'transactions' ? 'on' : ''}`}>
              <div className="grid kpis">
                {KPIS.map((k, i) => <KpiCard key={i} kpi={k} index={i} live={liveStats} />)}
              </div>
              <div className="grid full">
                <div className="card reveal">
                  <div className="card-h">
                    <div className="card-t">All transactions</div>
                    <span className="pill wait">12 pending review</span>
                  </div>
                  <TransactionTable filterQuery={searchQuery} />
                </div>
              </div>
            </section>

            {/* AUDIENCE */}
            <section className={`view ${view === 'audience' ? 'on' : ''}`}>
              <div className="grid kpis">
                {KPIS.map((k, i) => <KpiCard key={i} kpi={{ ...k, label: k.label + ' (Audience)' }} index={i} live={liveStats} />)}
              </div>
              <div className="grid two">
                <div className="card chart-card reveal">
                  <div className="card-h">
                    <div className="card-t"><span className="tag"></span>Audience Growth</div>
                  </div>
                  {view === 'audience' && <AreaChart series={[SERIES[1], SERIES[2]]} h={280} />}
                </div>
                <div className="card reveal">
                  <div className="card-h">
                    <div className="card-t"><span className="tag" style={{ background: 'var(--accent)' }}></span>Top Demographics</div>
                  </div>
                  <BarChart data={BARS_AUDIENCE} />
                </div>
              </div>
            </section>

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
                        <button className={`seg-btn ${!isDark ? 'on' : ''}`} onClick={() => setIsDark(false)}>Light</button>
                        <button className={`seg-btn ${isDark ? 'on' : ''}`} onClick={() => setIsDark(true)}>Dark</button>
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
                            onClick={() => applySwatch(s.hex)}
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
                      <div className="sw-btn" id="swLive" data-on={liveStats} onClick={() => setLiveStats(!liveStats)}></div>
                    </div>

                    <div className="sw-row">
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '13px' }}>Reduced Motion</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-faint)' }}>Minimize transition animations</div>
                      </div>
                      <div className="sw-btn" id="swMotion" data-on={reducedMotion} onClick={() => setReducedMotion(!reducedMotion)}></div>
                    </div>

                    <div className="sw-row">
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '13px' }}>Compact Density</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-faint)' }}>Reduce paddings for high data density</div>
                      </div>
                      <div className="sw-btn" id="swCompact" data-on={compactMode} onClick={() => setCompactMode(!compactMode)}></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

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
