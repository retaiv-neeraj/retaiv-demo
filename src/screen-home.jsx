import React from 'react';
import { T } from './tokens.js';
import { Pill, Dot } from './ui.jsx';
import { Shell, Card, Btn, NavContext } from './shell.jsx';

// ── Live clock (updates every minute) ─────────────────────────────────────────
const useClock = () => {
  const fmt = d => {
    const day  = d.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    const date = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${day} · ${date} · ${time} LOCAL`;
  };
  const [label, setLabel] = React.useState(() => fmt(new Date()));
  React.useEffect(() => {
    const id = setInterval(() => setLabel(fmt(new Date())), 60_000);
    return () => clearInterval(id);
  }, []);
  return label;
};

// ── Static data ───────────────────────────────────────────────────────────────

const OVERNIGHT = [
  { eyebrow: 'HEALTH ↓',     name: 'Dayframe Media',  logo: 'DM', logoC: '#d8482e', detail: '58 → 22',  time: '3h ago', tone: 'risk' },
  { eyebrow: 'CHURN RISK ↑', name: 'Atlas Freight',   logo: 'AF', logoC: '#b0362a', detail: '41 → 67',  time: '5h ago', tone: 'risk' },
  { eyebrow: 'USAGE ↑',      name: 'Verdant Foods',   logo: 'VF', logoC: '#2f7d5b', detail: '+320%',     time: '6h ago', tone: 'good' },
  { eyebrow: 'SEAT CAP HIT', name: 'Northwind Labs',  logo: 'NL', logoC: '#2c5e8a', detail: '142/150',   time: '7h ago', tone: 'warn' },
];

const WORKLIST = [
  { n: '01', name: 'Dayframe Media',  logo: 'DM', logoC: '#d8482e', stage: 'At risk', action: 'Schedule exec save call',        impact: '$67K ARR',  conf: 97, due: 'Today',    dueTone: 'risk'    },
  { n: '02', name: 'Northwind Labs',  logo: 'NL', logoC: '#2c5e8a', stage: 'Expand',  action: 'Send 8-seat expansion proposal', impact: '+$24K',     conf: 94, due: 'Today',    dueTone: 'risk'    },
  { n: '03', name: 'Atlas Freight',   logo: 'AF', logoC: '#b0362a', stage: 'At risk', action: 'Reach out — sponsor silent 21d', impact: '$48K ARR',  conf: 91, due: 'Today',    dueTone: 'risk'    },
  { n: '04', name: 'Verdant Foods',   logo: 'VF', logoC: '#2f7d5b', stage: 'Expand',  action: 'Tier upgrade — usage 3.2x',      impact: '+$31K',     conf: 88, due: 'Tomorrow', dueTone: 'warn'    },
  { n: '05', name: 'Hexcore Studios', logo: 'HS', logoC: '#4a4a46', stage: 'Watch',   action: 'QBR overdue 14 days',            impact: '$92K ARR',  conf: 82, due: 'Tomorrow', dueTone: 'warn'    },
  { n: '06', name: 'Brightline Co',   logo: 'BC', logoC: '#2c5e8a', stage: 'Healthy', action: 'Renewal prep — 60d out',         impact: '$112K ARR', conf: 76, due: 'Thu',      dueTone: 'neutral' },
  { n: '07', name: 'Saltwell Group',  logo: 'SG', logoC: '#b07414', stage: 'Watch',   action: 'Adoption check-in',              impact: '$28K ARR',  conf: 71, due: 'Thu',      dueTone: 'neutral' },
  { n: '08', name: 'Fieldwork.io',    logo: 'FW', logoC: '#d8482e', stage: 'At risk', action: 'Win-back call',                  impact: '$19K ARR',  conf: 68, due: 'Fri',      dueTone: 'neutral' },
];

// Signal velocity: [churn, expansion] pairs for Mon–Sun
const SIGNALS = [
  { day: 'M', churn: 8,  exp: 3 },
  { day: 'T', churn: 6,  exp: 5 },
  { day: 'W', churn: 11, exp: 4 },
  { day: 'T', churn: 9,  exp: 7 },
  { day: 'F', churn: 14, exp: 6 },
  { day: 'S', churn: 7,  exp: 9 },
  { day: 'S', churn: 12, exp: 5 },
];

const FEED = [
  { tone: 'risk', text: 'Atlas Freight: weekly active −38%',           at: '2m'  },
  { tone: 'info', text: 'Save playbook delivered to Dayframe Media',   at: '8m'  },
  { tone: 'good', text: 'Verdant Foods: tier upgrade signal fired',    at: '14m' },
  { tone: 'warn', text: 'Northwind Labs: hit 95% seat cap',            at: '32m' },
  { tone: 'risk', text: 'Saltwell Group: NPS dropped 8 → 5',          at: '1h'  },
  { tone: 'info', text: 'Brightline Co: QBR confirmed for Thu 2pm',   at: '1h'  },
];

// ── Tone → T.* color ──────────────────────────────────────────────────────────
const TONE_C = { risk: T.risk, warn: T.warn, good: T.good, info: T.info, neutral: T.ink3 };

// ── Stage pill (matches Accounts table exactly) ───────────────────────────────
const STAGE_S = {
  'At risk': { bg: T.accentSoft, fg: T.accentInk, bd: '#f0c5ba' },
  'Expand':  { bg: T.goodSoft,   fg: T.goodInk,   bd: '#c9dfcf' },
  'Healthy': { bg: T.infoSoft,   fg: T.infoInk,   bd: '#bed2e0' },
  'Watch':   { bg: T.warnSoft,   fg: T.warnInk,   bd: '#e7d3a3' },
};
const StagePill = ({ stage }) => {
  const s = STAGE_S[stage] || { bg: T.surfaceSunken, fg: T.ink2, bd: T.border };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 7px', borderRadius: 4,
      background: s.bg, color: s.fg, border: `1px solid ${s.bd}`,
      fontSize: T.fs.small, fontWeight: 500, whiteSpace: 'nowrap',
    }}>
      {stage}
    </span>
  );
};

// ── Confidence cell: percentage + mini bar ────────────────────────────────────
const ConfCell = ({ value }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
    <span style={{ fontFamily: T.mono, fontSize: T.fs.body, color: T.ink, minWidth: 30 }}>{value}%</span>
    <div style={{ width: 48, height: 5, background: T.surfaceSunken, borderRadius: 2, overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${value}%`,
        background: value >= 90 ? T.good : value >= 75 ? T.warn : T.ink3,
      }} />
    </div>
  </div>
);

// ── Signal velocity bar chart (SVG) ──────────────────────────────────────────
const SignalChart = () => {
  // Layout constants
  const VW = 210, VH = 90;
  const BASELINE = 72;   // y-coordinate baseline; bars grow upward from here
  const CHART_H  = 65;   // max drawable bar height in px
  const BAR_W = 10, PAIR_GAP = 3, GROUP_GAP = 7;
  const GROUP_W = BAR_W + PAIR_GAP + BAR_W + GROUP_GAP; // 30px per group
  const maxVal = Math.max(...SIGNALS.flatMap(d => [d.churn, d.exp])); // 14
  const scale  = v => (v / maxVal) * CHART_H;

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      width="100%"
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* Baseline rule */}
      <line x1={2} y1={BASELINE} x2={VW - 2} y2={BASELINE} stroke={T.border} strokeWidth={1} />

      {SIGNALS.map((d, i) => {
        const x  = 4 + i * GROUP_W;
        const chH = scale(d.churn);
        const expH = scale(d.exp);
        const labelX = x + BAR_W + PAIR_GAP / 2; // centre of the pair
        return (
          <g key={i}>
            <rect x={x}               y={BASELINE - chH}  width={BAR_W} height={chH}  fill={T.risk} opacity={0.72} rx={1} />
            <rect x={x + BAR_W + PAIR_GAP} y={BASELINE - expH} width={BAR_W} height={expH} fill={T.good} opacity={0.72} rx={1} />
            <text
              x={labelX} y={VH - 2}
              textAnchor="middle"
              fill={T.ink3} fontSize={9} fontFamily={T.mono}
            >
              {d.day}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ── Pulsing live indicator dot ────────────────────────────────────────────────
const PulseDot = () => {
  React.useEffect(() => {
    if (document.getElementById('retaiv-pulse-kf')) return;
    const s = document.createElement('style');
    s.id = 'retaiv-pulse-kf';
    s.textContent = `@keyframes retaiv-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.4; transform: scale(0.75); }
    }`;
    document.head.appendChild(s);
  }, []);
  return (
    <span style={{
      display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
      background: T.good, flexShrink: 0,
      animation: 'retaiv-pulse 2s ease-in-out infinite',
    }} />
  );
};

// ── Overnight change card ─────────────────────────────────────────────────────
const OvernightCard = ({ card }) => {
  const [hovered, setHovered] = React.useState(false);
  const accentColor = TONE_C[card.tone] || T.ink3;
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        minWidth: 210, flex: '0 0 auto',
        border: `1px solid ${T.border}`, borderRadius: 8,
        padding: '11px 14px 11px 18px', // left padding clears the 4px accent stripe
        cursor: 'pointer', overflow: 'hidden',
        background: hovered ? T.bg : T.surface,
        transition: 'background 100ms ease',
      }}
    >
      {/* Left accent stripe */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: accentColor }} />

      <div style={{
        fontSize: T.fs.micro, textTransform: 'uppercase', letterSpacing: '0.08em',
        fontWeight: 600, color: accentColor, fontFamily: T.mono,
      }}>{card.eyebrow}</div>

      <div style={{ marginTop: 5, display: 'flex', alignItems: 'center', gap: 7 }}>
        <div style={{
          width: 18, height: 18, borderRadius: 4, flexShrink: 0,
          background: card.logoC, color: '#fff',
          fontSize: 9, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{card.logo}</div>
        <span style={{ fontSize: T.fs.body, fontWeight: 500, color: T.ink }}>{card.name}</span>
      </div>

      <div style={{ marginTop: 4, fontFamily: T.mono, fontSize: T.fs.body, color: T.ink, fontWeight: 500 }}>
        {card.detail}
      </div>
      <div style={{ marginTop: 5, fontSize: T.fs.small, color: T.ink3 }}>{card.time}</div>
    </div>
  );
};

// ── Worklist table row (matches Accounts table style) ─────────────────────────
const WorklistRow = ({ row, onClick }) => {
  const [hovered, setHovered] = React.useState(false);
  const isToday   = row.due === 'Today';
  const dueTone   = row.dueTone;

  return (
    <tr
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: `1px solid ${T.borderSubtle}`,
        background: hovered ? T.surfaceAlt : 'transparent',
        cursor: 'pointer',
        transition: 'background 80ms ease',
        // 2px left-edge accent marks "due today" urgency — same pattern as at-risk rows in Accounts
        boxShadow: isToday ? `inset 2px 0 0 ${T.accent}` : 'none',
      }}
    >
      {/* Row number */}
      <td style={{ padding: '12px 14px', fontFamily: T.mono, fontSize: T.fs.small, color: T.ink3, whiteSpace: 'nowrap' }}>
        {row.n}
      </td>

      {/* Account: logo + name + stage pill */}
      <td style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'nowrap' }}>
          <div style={{
            width: 22, height: 22, borderRadius: 5, flexShrink: 0,
            background: row.logoC, color: '#fff',
            fontSize: T.fs.micro, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{row.logo}</div>
          <span style={{ fontSize: T.fs.body, fontWeight: 500, color: T.ink, whiteSpace: 'nowrap', letterSpacing: '-0.005em' }}>
            {row.name}
          </span>
          <StagePill stage={row.stage} />
        </div>
      </td>

      {/* Recommended action */}
      <td style={{ padding: '12px 14px', fontSize: T.fs.body, color: T.ink2 }}>{row.action}</td>

      {/* ARR impact */}
      <td style={{ padding: '12px 14px', fontFamily: T.mono, fontSize: T.fs.body, color: T.ink, whiteSpace: 'nowrap' }}>
        {row.impact}
      </td>

      {/* Confidence score + mini bar */}
      <td style={{ padding: '12px 14px' }}>
        <ConfCell value={row.conf} />
      </td>

      {/* Due date with severity dot */}
      <td style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {dueTone !== 'neutral' && <Dot tone={dueTone === 'risk' ? 'risk' : 'warn'} size={6} />}
          <span style={{
            fontSize: T.fs.body,
            color: dueTone === 'risk' ? T.risk : dueTone === 'warn' ? T.warn : T.ink3,
            fontWeight: dueTone === 'risk' ? 500 : 400,
          }}>
            {row.due}
          </span>
        </div>
      </td>
    </tr>
  );
};

// ── Main screen ───────────────────────────────────────────────────────────────
const HomeScreen = ({ accounts = [] }) => {
  const { navigate } = React.useContext(NavContext);
  const clock = useClock();

  // Portfolio health — computed live from accounts; falls back to demo portfolio
  // numbers when the sample data (10 rows) is loaded, since it represents 412 real accounts
  const portfolio = React.useMemo(() => {
    if (accounts.length < 20) {
      return { total: 412, healthy: 312, watch: 64, atRisk: 28, critical: 8 };
    }
    const critical = accounts.filter(a => a.churn >= 80 || a.health < 30).length;
    const atRisk   = accounts.filter(a => (a.churn > 60 || a.health < 50) && !(a.churn >= 80 || a.health < 30)).length;
    const healthy  = accounts.filter(a => a.health > 75 && a.churn <= 20).length;
    const watch    = Math.max(0, accounts.length - healthy - atRisk - critical);
    return { total: accounts.length, healthy, watch, atRisk, critical };
  }, [accounts]);

  const pTotal = Math.max(1, portfolio.healthy + portfolio.watch + portfolio.atRisk + portfolio.critical);
  const pct    = n => `${((n / pTotal) * 100).toFixed(1)}%`;

  return (
    <Shell active="home" breadcrumb={['Loopchart', 'Home']}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div style={{
          padding: '22px 28px',
          borderBottom: `1px solid ${T.border}`,
          background: T.surface,
          display: 'flex', alignItems: 'flex-start', gap: 24,
          flexShrink: 0,
        }}>
          {/* Left: greeting + status */}
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: T.mono, fontSize: T.fs.micro, color: T.ink3,
              fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10,
            }}>
              {clock}
            </div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', color: T.ink, lineHeight: 1.1 }}>
              Good morning, Mei.
            </h1>
            <div style={{
              marginTop: 8, fontSize: 13.5, color: T.ink2,
              display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, lineHeight: 1.5,
            }}>
              <span>Overnight:</span>
              <Pill tone="risk">4 accounts moved to red</Pill>
              <span style={{ color: T.ink4 }}>·</span>
              <Pill tone="warn">7 watch-list signals</Pill>
              <span style={{ color: T.ink4 }}>·</span>
              <Pill tone="good">2 expansion triggers</Pill>
            </div>
          </div>

          {/* Right: sync status + actions */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: T.fs.small, color: T.ink3 }}>
              <Dot tone="good" size={6} />
              <span>Synced 2m ago</span>
            </div>
            <div style={{ display: 'flex', gap: 7 }}>
              <Btn tone="ghost" size="sm">Refresh signals</Btn>
              <Btn tone="primary" size="sm">Start daily review →</Btn>
            </div>
          </div>
        </div>

        {/* ── Overnight changes strip ─────────────────────────────────────── */}
        <div style={{
          padding: '12px 28px',
          borderBottom: `1px solid ${T.border}`,
          background: T.surfaceAlt,
          display: 'flex', gap: 12, overflowX: 'auto', flexShrink: 0,
        }}>
          {OVERNIGHT.map((card, i) => <OvernightCard key={i} card={card} />)}
        </div>

        {/* ── Two-column body ─────────────────────────────────────────────── */}
        <div style={{
          flex: 1, minHeight: 0,
          display: 'flex', gap: 16,
          padding: '16px 28px',
          background: T.surfaceAlt,
          overflow: 'hidden',
        }}>

          {/* ── LEFT: Worklist ───────────────────────────────────────────── */}
          <div style={{ flex: 1.6, minWidth: 0, overflow: 'auto' }}>
            <Card
              title="Today's worklist"
              subtitle="9 items · ranked by impact × confidence · est. 2h 40m to clear"
              style={{ height: '100%' }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: T.sans, fontSize: T.fs.body }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${T.border}`, background: T.surface }}>
                    {['#', 'Account', 'Action', 'Impact', 'Confidence', 'Due'].map((h, i) => (
                      <th key={i} style={{
                        padding: '10px 14px',
                        fontSize: T.fs.micro, fontWeight: 600, color: T.ink3,
                        textAlign: 'left', letterSpacing: '0.06em', textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {WORKLIST.map((row, i) => (
                    <WorklistRow
                      key={i}
                      row={row}
                      onClick={() => navigate('account')}
                    />
                  ))}
                </tbody>
              </table>

              {/* Footer */}
              <div style={{
                padding: '10px 14px',
                borderTop: `1px solid ${T.border}`,
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: T.fs.small, color: T.ink3,
                background: T.surface,
              }}>
                <span>
                  Showing <span style={{ fontFamily: T.mono, color: T.ink }}>8</span> of{' '}
                  <span style={{ fontFamily: T.mono, color: T.ink }}>23</span>
                </span>
                <span style={{ color: T.ink4 }}>·</span>
                <Btn tone="subtle" size="sm" onClick={() => navigate('priority')}>Open priority queue →</Btn>
              </div>
            </Card>
          </div>

          {/* ── RIGHT: 3 stacked cards ───────────────────────────────────── */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>

            {/* Card A: Portfolio health */}
            <Card title="Portfolio health" style={{ flexShrink: 0 }}>
              <div style={{ padding: '12px 16px' }}>
                {/* Big account count */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontFamily: T.mono, fontSize: 32, letterSpacing: '-0.03em', color: T.ink, lineHeight: 1 }}>
                    {portfolio.total}
                  </span>
                  <span style={{ fontSize: T.fs.small, color: T.ink3 }}>accounts</span>
                </div>

                {/* Stacked health bar */}
                <div style={{ height: 8, borderRadius: 999, display: 'flex', overflow: 'hidden', border: `1px solid ${T.border}` }}>
                  <div style={{ width: pct(portfolio.healthy),  background: T.good }} />
                  <div style={{ width: pct(portfolio.watch),    background: T.warn }} />
                  <div style={{ width: pct(portfolio.atRisk),   background: T.risk }} />
                  <div style={{ width: pct(portfolio.critical), background: T.ink  }} />
                </div>

                {/* 2×2 breakdown grid */}
                <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
                  {[
                    { tone: 'good',    label: 'Healthy',  count: portfolio.healthy  },
                    { tone: 'warn',    label: 'Watch',    count: portfolio.watch    },
                    { tone: 'risk',    label: 'At-risk',  count: portfolio.atRisk   },
                    { tone: 'neutral', label: 'Critical', count: portfolio.critical },
                  ].map(seg => (
                    <div key={seg.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <Dot tone={seg.tone} size={7} />
                      <span style={{ flex: 1, fontSize: T.fs.small, color: T.ink2 }}>{seg.label}</span>
                      <span style={{ fontFamily: T.mono, fontSize: T.fs.body, color: T.ink }}>{seg.count}</span>
                    </div>
                  ))}
                </div>

                {/* Movement summary */}
                <div style={{ marginTop: 11, fontSize: T.fs.small, color: T.ink3, lineHeight: 1.5 }}>
                  ▲ 6 moved to red · ▼ 3 recovered · last 7 days
                </div>
              </div>
            </Card>

            {/* Card B: Signal velocity */}
            <Card
              title="Signal velocity (7d)"
              subtitle="Daily volume of new churn + expansion signals"
              style={{ flexShrink: 0 }}
            >
              <div style={{ padding: '10px 16px 8px' }}>
                <SignalChart />
                <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Dot tone="risk" size={6} />
                    <span style={{ fontSize: T.fs.small, color: T.ink3 }}>Churn signals</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Dot tone="good" size={6} />
                    <span style={{ fontSize: T.fs.small, color: T.ink3 }}>Expansion signals</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Card C: Live feed */}
            <Card
              title="Live feed"
              right={
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: T.fs.small, color: T.ink3 }}>
                  <PulseDot />
                  <span>Live · 2m ago</span>
                </div>
              }
              style={{ flexShrink: 0 }}
            >
              <div>
                {FEED.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 9,
                      padding: '9px 14px',
                      borderBottom: i < FEED.length - 1 ? `1px solid ${T.borderSubtle}` : 'none',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = T.surfaceAlt; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <Dot tone={item.tone} size={7} />
                    <span style={{
                      flex: 1, fontSize: 12.5, color: T.ink2,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {item.text}
                    </span>
                    <span style={{ color: T.ink4, fontSize: T.fs.small, margin: '0 2px' }}>·</span>
                    <span style={{ fontFamily: T.mono, fontSize: T.fs.small, color: T.ink3, flexShrink: 0 }}>
                      {item.at}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        </div>
      </div>
    </Shell>
  );
};

export { HomeScreen };
