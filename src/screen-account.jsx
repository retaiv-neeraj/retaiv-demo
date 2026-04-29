import React from 'react';
import { T } from './tokens.js';
import { Pill, Dot, Spark, ScoreBar, Icon } from './ui.jsx';
import { Shell, Btn, Card, NavContext } from './shell.jsx';

// Screen 2: Account Detail — single customer deep dive (Dayframe Media, at-risk)

const DRIVERS = [
  { label: 'Weekly active users',       value: '−38%', sub: '48 → 30',    weight: 0.24, tone: 'risk' },
  { label: 'Exec sponsor engagement',   value: 'Lost', sub: 'last login 42d ago', weight: 0.19, tone: 'risk' },
  { label: 'Support ticket severity',   value: '+4 P1', sub: 'past 30 days', weight: 0.16, tone: 'risk' },
  { label: 'Feature adoption breadth',  value: '3 / 11', sub: '↓ from 7',   weight: 0.12, tone: 'warn' },
  { label: 'Time-to-value milestones',  value: '2 / 5',  sub: 'stalled 18d', weight: 0.11, tone: 'warn' },
  { label: 'NPS response',              value: '4',      sub: 'from 8 (Nov)', weight: 0.09, tone: 'warn' },
  { label: 'Billing signal',            value: 'Net-60', sub: 'changed Apr 2', weight: 0.09, tone: 'warn' },
];

const TIMELINE = [
  { when: 'Today · 09:14',    type: 'risk',   title: 'Churn score increased to 78', sub: 'Driven by 2 new P1 tickets + exec sponsor inactivity' },
  { when: 'Yesterday · 16:02', type: 'mail',  title: 'Email sent by A. Chen',       sub: '"Catch up on Q2 priorities" · opened 3× · no reply' },
  { when: 'Apr 19 · 10:30',   type: 'ticket', title: 'P1 ticket opened',            sub: 'SSO regression blocking 40 users · resolved in 14h' },
  { when: 'Apr 17 · 14:45',   type: 'usage',  title: 'WAU dropped below threshold', sub: 'From 48 → 30 DAU (−38% w/w)' },
  { when: 'Apr 12 · 08:00',   type: 'model',  title: 'Retaiv flagged account',      sub: 'Crossed "Watch → At risk" boundary · playbook Save-Mid triggered' },
  { when: 'Apr 02 · 11:20',   type: 'billing', title: 'Payment terms → Net-60',     sub: 'Requested by finance@dayframe.co' },
];

const CONTACTS = [
  { name: 'Jordan Velez',   role: 'VP Marketing · Sponsor',    activity: 4,  last: '42d',  tone: 'risk'    },
  { name: 'Priya Anand',    role: 'Marketing Ops · Champion',  activity: 72, last: '2d',   tone: 'good'    },
  { name: 'Dev Okonkwo',    role: 'Analytics Lead · Power',    activity: 88, last: '1d',   tone: 'good'    },
  { name: 'Marisol Kent',   role: 'Creative Director',          activity: 12, last: '28d', tone: 'warn'    },
  { name: 'Tomás Reyes',    role: 'CMO · Economic buyer',       activity: 0,  last: '90d+', tone: 'risk'   },
];

const PLAYBOOK_STEPS = [
  { t: '1. Re-engage executive sponsor', s: 'Send "Q2 ROI briefing" via CEO · owner: A. Chen · due today', done: false, accent: true },
  { t: '2. Schedule technical review',   s: 'Address 4 P1 issues from past 30d · owner: Support', done: false },
  { t: '3. Build expansion case',        s: 'Ladder up to CFO · renewal anchor + 12% discount hold', done: false },
  { t: '4. Loop in Product',             s: 'Share roadmap for SSO reliability (shipped Apr 22)', done: true },
];

const AccountDetailScreen = ({ account }) => {
  const { navigate } = React.useContext(NavContext);
  return (
    <Shell active="accounts" breadcrumb={['Accounts', 'At risk', account?.name ?? 'Dayframe Media']}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Account header */}
        <div style={{
          padding: '18px 22px 14px', borderBottom: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', gap: 16, background: T.surface,
        }}>
          <button
            onClick={() => navigate('accounts')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 10px', background: T.surfaceAlt,
              border: `1px solid ${T.border}`, borderRadius: 6,
              color: T.ink2, fontSize: 12, fontWeight: 500,
              cursor: 'pointer', fontFamily: T.sans, flexShrink: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.background = T.surfaceSunken}
            onMouseLeave={e => e.currentTarget.style.background = T.surfaceAlt}
          >
            ← Accounts
          </button>
          <div style={{
            width: 44, height: 44, borderRadius: 8, background: account?.logoC ?? '#d8482e',
            color: '#fff', fontWeight: 700, fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{account?.logo ?? 'DM'}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.02em' }}>{account?.name ?? 'Dayframe Media'}</span>
              <Pill tone="risk"><Dot tone="risk" size={5} />At risk</Pill>
              <Pill tone="neutral">Enterprise · Annual</Pill>
              <Pill tone="neutral">Renewal in 47 days</Pill>
            </div>
            <div style={{ fontSize: 12, color: T.ink3, marginTop: 4, display: 'flex', gap: 14 }}>
              <span>dayframe.media</span>
              <span>·</span>
              <span>HQ: Brooklyn, NY</span>
              <span>·</span>
              <span>Customer since Mar 2023</span>
              <span>·</span>
              <span>Owner: <span style={{ color: T.ink2, fontWeight: 500 }}>A. Chen</span></span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <Btn icon="mail" size="sm">Log activity</Btn>
            <Btn icon="calendar" size="sm">Schedule</Btn>
            <Btn tone="primary" icon="zap" size="sm">Run playbook</Btn>
          </div>
        </div>

        {/* Score strip */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${T.border}`, background: T.surfaceAlt }}>
          <BigScore label="Health score" value={34} tone="risk" delta="−12" deltaTone="risk" since="7d" />
          <BigScore label="Churn risk (90d)" value={78} tone="risk" suffix="%" delta="+14" deltaTone="risk" since="7d" />
          <BigScore label="Expansion potential" value={18} tone="warn" delta="−6" deltaTone="risk" since="7d" />
          <div style={{ flex: 1.4, padding: '14px 18px', background: T.surface, borderLeft: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 10.5, color: T.ink3, letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 8 }}>ARR & Contract</div>
            <div style={{ display: 'flex', gap: 22 }}>
              <KV label="Current ARR" value="$148,000" />
              <KV label="Seats" value="62 / 75" />
              <KV label="Expansion ask" value="$42k" tone="good" />
              <KV label="At-risk ARR" value="$148k" tone="risk" />
            </div>
          </div>
        </div>

        {/* Two-column body */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
          {/* Left: drivers + timeline */}
          <div style={{ flex: 1.4, minWidth: 0, overflow: 'auto', padding: 14, background: T.surfaceAlt, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Card
              title="Why we're flagging this account"
              subtitle="Top contributors to churn score · SHAP-weighted"
              right={<Pill tone="info">Model v2.4</Pill>}
            >
              <div>
                {DRIVERS.map((d, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '9px 14px',
                    borderTop: i > 0 ? `1px solid ${T.borderSubtle}` : 'none',
                  }}>
                    <div style={{ width: 3, alignSelf: 'stretch', background: d.tone === 'risk' ? T.risk : T.warn, borderRadius: 2 }} />
                    <div style={{ flex: 1.5, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, color: T.ink, fontWeight: 500 }}>{d.label}</div>
                      <div style={{ fontSize: 11, color: T.ink3, marginTop: 1 }}>{d.sub}</div>
                    </div>
                    <div style={{ flex: 0.6, fontFamily: T.mono, fontSize: 12, color: d.tone === 'risk' ? T.risk : T.warn, fontWeight: 500 }}>
                      {d.value}
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <ScoreBar value={d.weight * 100 / 0.24} tone={d.tone} width={110} height={5} />
                      <span style={{ fontFamily: T.mono, fontSize: 11, color: T.ink3, minWidth: 36 }}>
                        {(d.weight * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Activity timeline" right={
              <div style={{ display: 'flex', gap: 6, fontSize: 11 }}>
                <span style={{ color: T.ink3 }}>Filter:</span>
                <Pill tone="ink">All 24</Pill>
                <Pill>Risk</Pill>
                <Pill>Email</Pill>
                <Pill>Usage</Pill>
              </div>
            }>
              <div style={{ padding: '6px 14px 14px' }}>
                {TIMELINE.map((e, i) => {
                  const dot = { risk: T.risk, mail: T.info, ticket: T.warn, usage: T.accent, model: T.ink2, billing: T.ink3 }[e.type];
                  return (
                    <div key={i} style={{ display: 'flex', gap: 12, paddingTop: 10 }}>
                      <div style={{ width: 64, flexShrink: 0, fontSize: 10.5, color: T.ink3, fontFamily: T.mono, paddingTop: 3 }}>{e.when.split(' · ')[0]}<br/><span style={{ color: T.ink4 }}>{e.when.split(' · ')[1]}</span></div>
                      <div style={{ width: 10, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: dot, marginTop: 5, border: `2px solid ${T.surface}`, boxShadow: `0 0 0 1px ${dot}` }} />
                        {i < TIMELINE.length - 1 && <div style={{ flex: 1, width: 1, background: T.border, marginTop: 2 }} />}
                      </div>
                      <div style={{ flex: 1, paddingBottom: 12 }}>
                        <div style={{ fontSize: 12.5, color: T.ink, fontWeight: 500 }}>{e.title}</div>
                        <div style={{ fontSize: 11.5, color: T.ink3, marginTop: 2, lineHeight: 1.5 }}>{e.sub}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Right: playbook + contacts + usage */}
          <div style={{ flex: 1, minWidth: 0, overflow: 'auto', padding: 14, background: T.surfaceAlt, borderLeft: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Card
              title="Recommended playbook: Save-Mid"
              subtitle="3 of 8 accounts saved using this path in Q1"
              right={<Pill tone="accent"><Icon name="sparkles" size={9} />AI suggested</Pill>}
            >
              <div>
                {PLAYBOOK_STEPS.map((p, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 10, padding: '10px 14px',
                    borderTop: i > 0 ? `1px solid ${T.borderSubtle}` : 'none',
                    background: p.accent ? T.accentSoft : 'transparent',
                  }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: 3, marginTop: 1, flexShrink: 0,
                      border: `1.5px solid ${p.done ? T.good : T.borderStrong}`,
                      background: p.done ? T.good : T.surface,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {p.done && <Icon name="check" size={10} color="#fff" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12.5, color: p.done ? T.ink3 : T.ink, fontWeight: 500, textDecoration: p.done ? 'line-through' : 'none' }}>{p.t}</div>
                      <div style={{ fontSize: 11, color: T.ink3, marginTop: 2 }}>{p.s}</div>
                    </div>
                    {!p.done && p.accent && <Btn tone="accent" size="sm">Start</Btn>}
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Stakeholders" subtitle="5 contacts · 2 disengaged" right={<Btn icon="plus" size="sm">Add</Btn>}>
              <div>
                {CONTACTS.map((c, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px',
                    borderTop: i > 0 ? `1px solid ${T.borderSubtle}` : 'none',
                  }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: '50%',
                      background: c.tone === 'risk' ? T.riskSoft : c.tone === 'warn' ? T.warnSoft : T.goodSoft,
                      color: c.tone === 'risk' ? T.riskInk : c.tone === 'warn' ? T.warnInk : T.goodInk,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 600, flexShrink: 0,
                    }}>{c.name.split(' ').map(n => n[0]).join('')}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>{c.name}</div>
                      <div style={{ fontSize: 10.5, color: T.ink3 }}>{c.role}</div>
                    </div>
                    <div style={{ width: 70 }}>
                      <div style={{ fontSize: 10, color: T.ink3, marginBottom: 3 }}>Activity</div>
                      <ScoreBar value={c.activity} tone={c.tone} width={70} height={4} />
                    </div>
                    <div style={{ fontSize: 10.5, fontFamily: T.mono, color: T.ink3, minWidth: 36, textAlign: 'right' }}>{c.last}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Usage · last 90 days">
              <div style={{ padding: 14 }}>
                <UsageMini label="Weekly active users" current="30" peak="51" peakDate="Feb 22" trend={[48,51,50,48,46,42,38,34,30]} tone="risk" />
                <UsageMini label="Feature breadth" current="3 / 11" peak="7 / 11" peakDate="Jan 4" trend={[7,7,6,6,5,5,4,4,3]} tone="warn" />
                <UsageMini label="API calls (k/day)" current="112" peak="187" peakDate="Feb 14" trend={[185,182,170,160,150,140,130,120,112]} tone="warn" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
};

const BigScore = ({ label, value, suffix = '', tone, delta, deltaTone, since }) => (
  <div style={{ flex: 1, padding: '14px 18px', background: T.surface, borderRight: `1px solid ${T.border}` }}>
    <div style={{ fontSize: 10.5, color: T.ink3, letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 6 }}>{label}</div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
      <span style={{ fontFamily: T.mono, fontSize: 28, fontWeight: 500, color: tone === 'risk' ? T.risk : tone === 'warn' ? T.warn : T.ink, letterSpacing: '-0.025em' }}>{value}</span>
      {suffix && <span style={{ fontSize: 13, color: T.ink3, fontFamily: T.mono }}>{suffix}</span>}
      <span style={{ flex: 1 }} />
      {delta && (
        <span style={{
          fontSize: 11, fontFamily: T.mono,
          color: deltaTone === 'risk' ? T.risk : T.good,
          display: 'inline-flex', alignItems: 'center', gap: 3,
        }}>
          <Icon name={deltaTone === 'risk' ? 'arrowDown' : 'arrowUp'} size={10} />{delta}
        </span>
      )}
    </div>
    <div style={{ marginTop: 6 }}>
      <ScoreBar value={suffix === '%' ? value : value} tone={tone} width={'100%'} height={4} />
    </div>
    <div style={{ fontSize: 10.5, color: T.ink3, marginTop: 6 }}>over last {since}</div>
  </div>
);

const KV = ({ label, value, tone }) => (
  <div>
    <div style={{ fontSize: 10.5, color: T.ink3, marginBottom: 2 }}>{label}</div>
    <div style={{ fontFamily: T.mono, fontSize: 15, fontWeight: 500, letterSpacing: '-0.01em',
      color: tone === 'risk' ? T.risk : tone === 'good' ? T.good : T.ink,
    }}>{value}</div>
  </div>
);

const UsageMini = ({ label, current, peak, peakDate, trend, tone }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '6px 0', borderTop: `1px solid ${T.borderSubtle}`, marginTop: 8, paddingTop: 10 }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 11.5, color: T.ink, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 10.5, color: T.ink3, marginTop: 2 }}>peak <span style={{ fontFamily: T.mono }}>{peak}</span> · {peakDate}</div>
    </div>
    <Spark data={trend} tone={tone} width={120} height={28} fill />
    <div style={{ fontFamily: T.mono, fontSize: 14, color: tone === 'risk' ? T.risk : tone === 'warn' ? T.warn : T.ink, minWidth: 58, textAlign: 'right' }}>{current}</div>
  </div>
);

export { AccountDetailScreen };
