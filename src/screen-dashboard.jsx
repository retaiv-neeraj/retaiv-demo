import React from 'react';
import { T } from './tokens.js';
import { Spark, ScoreBar, Kbd, Icon } from './ui.jsx';
import { Shell, PageHead, Btn, Tabs, Stat, NavContext } from './shell.jsx';

// Screen 1 v2: Accounts / Health overview — breathing room, less competing ink

const ACCOUNTS = [
  { name: 'Northwind Labs',      logo: 'NL', logoC: '#2c5e8a', arr: 184000, seats: 142, seatsMax: 150, health: 92, healthTone: 'good',   churn: 4,  expansion: 78, trend: [68,72,75,78,82,86,88,90,92], owner: 'A. Chen',   lastTouch: '2d', stage: 'Healthy' },
  { name: 'Meridian Retail',     logo: 'MR', logoC: '#b07414', arr: 96000,  seats: 41,  seatsMax: 50,  health: 58, healthTone: 'warn',   churn: 31, expansion: 42, trend: [82,80,76,70,66,60,62,58,58], owner: 'R. Okafor', lastTouch: '6d', stage: 'Watch' },
  { name: 'Parallel Bio',        logo: 'PB', logoC: '#2f7d5b', arr: 240000, seats: 88,  seatsMax: 88,  health: 81, healthTone: 'good',   churn: 12, expansion: 94, trend: [70,71,72,74,76,78,79,80,81], owner: 'J. Park',   lastTouch: '1d', stage: 'Expand' },
  { name: 'Dayframe Media',      logo: 'DM', logoC: '#d8482e', arr: 148000, seats: 62,  seatsMax: 75,  health: 34, healthTone: 'risk',   churn: 78, expansion: 18, trend: [75,72,68,60,54,48,42,38,34], owner: 'A. Chen',   lastTouch: '11d', stage: 'At risk' },
  { name: 'Hearth & Co.',        logo: 'HC', logoC: '#2c5e8a', arr: 58000,  seats: 24,  seatsMax: 30,  health: 74, healthTone: 'good',   churn: 18, expansion: 61, trend: [62,64,66,68,70,71,72,73,74], owner: 'S. Lindh',  lastTouch: '3d', stage: 'Healthy' },
  { name: 'Vector Ops',          logo: 'VO', logoC: '#4a4a46', arr: 312000, seats: 204, seatsMax: 250, health: 88, healthTone: 'good',   churn: 8,  expansion: 83, trend: [80,82,84,85,86,87,88,88,88], owner: 'J. Park',   lastTouch: '1d', stage: 'Expand' },
  { name: 'Saltwell Group',      logo: 'SG', logoC: '#b07414', arr: 72000,  seats: 30,  seatsMax: 40,  health: 49, healthTone: 'warn',   churn: 44, expansion: 29, trend: [70,68,65,62,58,55,52,50,49], owner: 'R. Okafor', lastTouch: '8d', stage: 'Watch' },
  { name: 'Oakridge Finance',    logo: 'OF', logoC: '#2f7d5b', arr: 168000, seats: 56,  seatsMax: 60,  health: 79, healthTone: 'good',   churn: 14, expansion: 71, trend: [70,72,73,74,75,76,77,78,79], owner: 'S. Lindh',  lastTouch: '2d', stage: 'Healthy' },
  { name: 'Fieldwork.io',        logo: 'FW', logoC: '#d8482e', arr: 42000,  seats: 18,  seatsMax: 25,  health: 41, healthTone: 'risk',   churn: 62, expansion: 22, trend: [64,60,55,52,48,45,43,42,41], owner: 'A. Chen',   lastTouch: '14d', stage: 'At risk' },
  { name: 'Brightfold Studio',   logo: 'BS', logoC: '#2c5e8a', arr: 24000,  seats: 8,   seatsMax: 10,  health: 84, healthTone: 'good',   churn: 9,  expansion: 67, trend: [72,74,76,78,80,82,83,84,84], owner: 'R. Okafor', lastTouch: '4d', stage: 'Healthy' },
];

const fmt$ = n => n >= 1000 ? `$${(n/1000).toFixed(0)}k` : `$${n}`;
const scoreTone = v => v >= 70 ? 'good' : v >= 50 ? 'warn' : 'risk';
const churnTone = v => v >= 60 ? 'risk' : v >= 30 ? 'warn' : 'good';

const DashboardScreen = () => {
  const { navigate } = React.useContext(NavContext);
  return (
    <Shell active="accounts" breadcrumb={['Loopchart', 'Accounts']}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <PageHead
          eyebrow="Workspace"
          title="Accounts"
          subtitle="412 active customers · $18.4M ARR under management."
          meta={<>
            <span>Last 90 days</span>
            <span style={{ color: T.ink4 }}>·</span>
            <span>Synced 2m ago</span>
          </>}
          actions={<>
            <Btn icon="filter" size="sm">Filters · 2</Btn>
            <Btn icon="external" size="sm">Export</Btn>
            <Btn tone="primary" icon="plus" size="sm">New playbook</Btn>
          </>}
        />

        {/* KPI strip — generous padding */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${T.border}`, background: T.surface }}>
          <Stat label="Net revenue retention" value="108.4" unit="%" delta="+2.1pp" deltaTone="good" sparkData={[100,101,102,103,104,105,107,108,108.4]} hint="vs Q1" />
          <Stat label="Churn risk (90d)"      value="$1.24" unit="M" delta="−$180k" deltaTone="good" sparkTone="risk" sparkData={[1.6,1.55,1.5,1.42,1.38,1.35,1.3,1.26,1.24]} hint="23 accounts" />
          <Stat label="Expansion pipeline"    value="$2.81" unit="M" delta="+$412k" deltaTone="good" sparkData={[2.1,2.2,2.3,2.4,2.5,2.6,2.7,2.78,2.81]} hint="47 accounts" />
          <Stat label="Avg health score"      value="71.2" delta="+3.4" deltaTone="good" sparkData={[64,65,66,67,68,69,70,71,71.2]} hint="across book" />
          <Stat label="Today's priorities"    value="23" delta="8 new" deltaTone="good" sparkTone="accent" sparkData={[12,14,18,20,22,24,21,22,23]} hint="team-wide" />
        </div>

        <Tabs active={0} tabs={[
          { label: 'All accounts', count: 412 },
          { label: 'At risk', count: 23 },
          { label: 'Expansion ready', count: 47 },
          { label: 'Healthy', count: 298 },
          { label: 'Onboarding', count: 44 },
        ]} />

        {/* Filter row — lots of horizontal air */}
        <div style={{
          padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 10,
          borderBottom: `1px solid ${T.border}`, background: T.surface,
        }}>
          <FilterChip label="Owner" value="All (6)" />
          <FilterChip label="Segment" value="Enterprise" active />
          <FilterChip label="ARR" value="$50k–$500k" active />
          <FilterChip label="Renewal" value="Next 120 days" />
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: T.fs.small, color: T.ink3 }}>
            Sort: <span style={{ color: T.ink2, fontWeight: 500 }}>Churn risk ↓</span>
          </span>
        </div>

        {/* Table — bigger rows, one encoding per column */}
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto', background: T.surface }}>
          <table style={{
            width: '100%', borderCollapse: 'collapse',
            fontFamily: T.sans, fontSize: T.fs.body,
          }}>
            <thead>
              <tr style={{
                position: 'sticky', top: 0, background: T.surface, zIndex: 1,
                borderBottom: `1px solid ${T.border}`,
              }}>
                {[
                  { l: 'Account' },
                  { l: 'ARR', r: true },
                  { l: 'Seats' },
                  { l: 'Health' },
                  { l: 'Churn risk' },
                  { l: 'Expansion' },
                  { l: '90-day trend' },
                  { l: 'Stage' },
                  { l: 'Owner' },
                  { l: 'Last touch', r: true },
                  { l: '' },
                ].map((h, i) => (
                  <th key={i} style={{
                    padding: '12px 16px', fontSize: T.fs.micro, fontWeight: 600,
                    color: T.ink3, textAlign: h.r ? 'right' : 'left',
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>{h.l}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ACCOUNTS.map((a, i) => (
                <tr key={i}
                  onClick={() => navigate('account')}
                  onMouseEnter={e => { if (i !== 3) e.currentTarget.style.background = T.surfaceAlt; }}
                  onMouseLeave={e => { if (i !== 3) e.currentTarget.style.background = 'transparent'; }}
                  style={{
                    borderBottom: `1px solid ${T.borderSubtle}`,
                    background: i === 3 ? T.accentSoft : 'transparent',
                    cursor: 'pointer',
                    transition: 'background 80ms ease',
                }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: 5, flexShrink: 0,
                        background: a.logoC, color: '#fff',
                        fontSize: T.fs.micro, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>{a.logo}</div>
                      <span style={{ fontWeight: 500, color: T.ink, letterSpacing: '-0.005em' }}>{a.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontFamily: T.mono, color: T.ink, fontSize: T.fs.body }}>{fmt$(a.arr)}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontFamily: T.mono, color: T.ink }}>{a.seats}</span>
                    <span style={{ color: T.ink4, margin: '0 4px' }}>/</span>
                    <span style={{ fontFamily: T.mono, color: T.ink3 }}>{a.seatsMax}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <ScoreCell value={a.health} tone={scoreTone(a.health)} />
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <ScoreCell value={a.churn} tone={churnTone(a.churn)} suffix="%" />
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <ScoreCell value={a.expansion} tone={scoreTone(a.expansion)} />
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <Spark data={a.trend} tone={a.healthTone} width={100} height={26} fill />
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <StagePill stage={a.stage} />
                  </td>
                  <td style={{ padding: '14px 16px', color: T.ink2 }}>{a.owner}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontFamily: T.mono, color: T.ink3 }}>{a.lastTouch}</td>
                  <td style={{ padding: '14px 16px', color: T.ink3, textAlign: 'right' }}>
                    <Icon name="dots" size={15} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{
            padding: '14px 28px', fontSize: T.fs.small, color: T.ink3,
            borderTop: `1px solid ${T.border}`, background: T.surface,
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <span>Showing <span style={{ color: T.ink, fontFamily: T.mono }}>10</span> of <span style={{ color: T.ink, fontFamily: T.mono }}>412</span></span>
            <span style={{ flex: 1 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Kbd>J</Kbd><Kbd>K</Kbd>
              <span>navigate</span>
              <span style={{ margin: '0 10px', color: T.ink4 }}>·</span>
              <Kbd>E</Kbd>
              <span>email owner</span>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
};

// Stage pill — NEUTRAL by default, only "At risk" gets accent color
const StagePill = ({ stage }) => {
  const isRisk = stage === 'At risk';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 9px', borderRadius: 4,
      background: isRisk ? T.accentSoft : T.surfaceSunken,
      color: isRisk ? T.accentInk : T.ink2,
      border: `1px solid ${isRisk ? '#f0c5ba' : T.border}`,
      fontSize: T.fs.small, fontWeight: 500,
    }}>
      {stage}
    </span>
  );
};

const FilterChip = ({ label, value, active }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 7,
    padding: '5px 10px', borderRadius: 5,
    border: `1px solid ${active ? T.ink2 : T.border}`,
    background: active ? T.surfaceSunken : T.surface,
    fontSize: T.fs.small, cursor: 'pointer',
  }}>
    <span style={{ color: T.ink3 }}>{label}</span>
    <span style={{ color: T.ink, fontWeight: 500 }}>{value}</span>
    <Icon name="chevronDown" size={10} color={T.ink3} />
  </div>
);

const ScoreCell = ({ value, tone, suffix = '' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <span style={{ fontFamily: T.mono, color: T.ink, minWidth: 28, fontWeight: 500 }}>
      {value}{suffix}
    </span>
    <ScoreBar value={value} tone={tone} width={64} height={6} />
  </div>
);

export { DashboardScreen };
