import React from 'react';
import { T } from './tokens.js';
import { Pill, Dot, ScoreBar, Icon } from './ui.jsx';
import { Shell, PageHead, Btn, Stat } from './shell.jsx';

// Screen 5: Expansion opportunities — upsell pipeline

const EXPANSIONS = [
  { account: 'Parallel Bio',   logo: 'PB', logoC: '#2f7d5b', trigger: 'Seat cap 88/88 · 3 queued invites', value: 72, stage: 'Ready to pitch', conf: 91, type: 'Seats',   owner: 'J. Park',   daysOpen: 2,  nextStep: 'Send Team plan proposal' },
  { account: 'Vector Ops',     logo: 'VO', logoC: '#4a4a46', trigger: 'SAML inquiry + Q3 budget cycle',   value: 124, stage: 'Qualifying', conf: 84, type: 'Tier',    owner: 'J. Park',   daysOpen: 5,  nextStep: 'Technical discovery Apr 28' },
  { account: 'Northwind Labs', logo: 'NL', logoC: '#2c5e8a', trigger: 'API usage +210% MoM',               value: 38, stage: 'Negotiation', conf: 88, type: 'Usage',   owner: 'A. Chen',   daysOpen: 12, nextStep: 'Finalize rate card' },
  { account: 'Oakridge Finance', logo: 'OF', logoC: '#2f7d5b', trigger: 'Adjacent team onboarding detected', value: 86, stage: 'Discovery', conf: 72, type: 'Team',   owner: 'S. Lindh',  daysOpen: 9,  nextStep: 'Stakeholder intro w/ ops lead' },
  { account: 'Brightfold Studio', logo: 'BS', logoC: '#2c5e8a', trigger: 'Feature request (reporting) 3× quarter', value: 18, stage: 'Qualifying', conf: 68, type: 'Addon', owner: 'R. Okafor', daysOpen: 4, nextStep: 'Share roadmap preview' },
  { account: 'Hearth & Co.',   logo: 'HC', logoC: '#2c5e8a', trigger: '24/30 seats · hiring surge',         value: 14, stage: 'Discovery', conf: 77, type: 'Seats',   owner: 'S. Lindh',  daysOpen: 7,  nextStep: 'Confirm hiring plan' },
  { account: 'Vector Ops',     logo: 'VO', logoC: '#4a4a46', trigger: 'SSO tier evaluation started',        value: 48, stage: 'Qualifying', conf: 79, type: 'Tier',    owner: 'J. Park',   daysOpen: 6,  nextStep: 'Security review packet' },
];

const ExpansionScreen = () => (
  <Shell active="expansion" breadcrumb={['Signals', 'Expansion', 'Pipeline']}>
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageHead
        title="Expansion pipeline"
        subtitle="47 signaled opportunities · $2.81M potential · top 10 = 68% of value"
        meta={<>
          <span>View: <span style={{ color: T.ink2, fontWeight: 500 }}>All owners</span></span>
          <span>Window: <span style={{ color: T.ink2, fontWeight: 500 }}>Next 90 days</span></span>
        </>}
        actions={<div style={{ display: 'flex', gap: 6 }}>
          <Btn icon="filter" size="sm">Filters · 1</Btn>
          <Btn icon="sparkles" size="sm">Regenerate signals</Btn>
          <Btn tone="primary" icon="plus" size="sm">Add opportunity</Btn>
        </div>}
      />

      <div style={{ display: 'flex', borderBottom: `1px solid ${T.border}`, background: T.surfaceAlt, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <Stat label="Open opportunities" value="47" delta="+12" deltaTone="good" hint="past 30d" />
        <Stat label="Pipeline value" value="$2.81" unit="M" delta="+$412k" deltaTone="good" sparkData={[2.1,2.2,2.3,2.4,2.5,2.6,2.7,2.78,2.81]} />
        <Stat label="Avg deal size" value="$59.8" unit="k" delta="+$4.1k" deltaTone="good" />
        <Stat label="Win rate · 90d" value="42" unit="%" delta="+3pp" deltaTone="good" sparkData={[35,36,38,39,40,41,42]} />
        <Stat label="Avg cycle" value="28" unit="days" delta="−4d" deltaTone="good" hint="vs 32d" />
        <div style={{ width: 220, padding: '12px 16px', background: T.surface }}>
          <div style={{ fontSize: 10.5, color: T.ink3, letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 6 }}>Mix · by signal</div>
          <div style={{ display: 'flex', height: 10, borderRadius: 3, overflow: 'hidden', gap: 1 }}>
            <div style={{ flex: 38, background: T.good }} title="Seats 38%" />
            <div style={{ flex: 24, background: T.info }} title="Tier 24%" />
            <div style={{ flex: 18, background: T.accent }} title="Usage 18%" />
            <div style={{ flex: 12, background: T.warn }} title="Team 12%" />
            <div style={{ flex: 8,  background: T.ink3 }} title="Addon 8%" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 9.5, color: T.ink3, fontFamily: T.mono }}>
            <span>Seats 38%</span><span>Tier 24%</span><span>Usage 18%</span>
          </div>
        </div>
      </div>

      {/* Stage Kanban */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', background: T.surfaceAlt, padding: 14, gap: 10 }}>
        {[
          { stage: 'Discovery',       count: 14, sum: 642, tone: 'info' },
          { stage: 'Qualifying',      count: 18, sum: 864, tone: 'warn' },
          { stage: 'Ready to pitch',  count: 8,  sum: 612, tone: 'accent' },
          { stage: 'Negotiation',     count: 5,  sum: 482, tone: 'good' },
          { stage: 'Closed won · 30d', count: 2, sum: 210, tone: 'good', done: true },
        ].map((col, ci) => {
          const items = EXPANSIONS.filter(e => e.stage === col.stage);
          // Pad the column with placeholders so each one doesn't look empty
          const all = [...items];
          return (
            <div key={ci} style={{
              flex: 1, minWidth: 160, flexShrink: 0, background: T.surface,
              border: `1px solid ${T.border}`, borderRadius: 6,
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}>
              <div style={{
                padding: '9px 12px', borderBottom: `1px solid ${T.border}`,
                display: 'flex', alignItems: 'center', gap: 8,
                background: T.surfaceAlt,
              }}>
                <Dot tone={col.tone} />
                <span style={{ fontSize: 11.5, fontWeight: 600 }}>{col.stage}</span>
                <span style={{ fontSize: 10.5, color: T.ink3, fontFamily: T.mono }}>{col.count}</span>
                <span style={{ flex: 1 }} />
                <span style={{ fontSize: 10.5, color: T.ink2, fontFamily: T.mono }}>${col.sum}k</span>
              </div>
              <div style={{ flex: 1, overflow: 'auto', padding: 8, display: 'flex', flexDirection: 'column', gap: 7 }}>
                {all.map((e, i) => <ExpansionCard key={i} e={e} />)}
                {col.done && <CardDone />}
                {col.done && <CardDone alt />}
                {!col.done && all.length < 2 && <Placeholder count={Math.min(3, col.count - all.length)} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </Shell>
);

const ExpansionCard = ({ e }) => (
  <div style={{
    border: `1px solid ${T.border}`, borderRadius: 5, padding: '9px 10px',
    background: T.surface, display: 'flex', flexDirection: 'column', gap: 6,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      <div style={{ width: 18, height: 18, borderRadius: 3, background: e.logoC, color: '#fff', fontSize: 8.5, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{e.logo}</div>
      <span style={{ fontSize: 12, fontWeight: 600, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.account}</span>
      <Pill tone="neutral">{e.type}</Pill>
    </div>
    <div style={{ fontSize: 10.5, color: T.ink2, lineHeight: 1.4 }}>{e.trigger}</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 4, borderTop: `1px solid ${T.borderSubtle}` }}>
      <span style={{ fontFamily: T.mono, fontSize: 13, fontWeight: 500, color: T.good, letterSpacing: '-0.01em' }}>+${e.value}k</span>
      <span style={{ flex: 1 }} />
      <ScoreBar value={e.conf} tone={e.conf > 80 ? 'good' : 'warn'} width={34} height={3} />
      <span style={{ fontSize: 10, fontFamily: T.mono, color: T.ink3 }}>{e.conf}%</span>
    </div>
    <div style={{ fontSize: 10, color: T.ink3, display: 'flex', gap: 6, alignItems: 'center' }}>
      <Icon name="arrowRight" size={9} color={T.ink3} />
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.nextStep}</span>
      <span style={{ fontFamily: T.mono }}>{e.daysOpen}d</span>
    </div>
  </div>
);

const CardDone = ({ alt }) => (
  <div style={{ border: `1px solid ${T.border}`, borderRadius: 5, padding: '8px 10px', background: T.goodSoft, opacity: 0.92 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 600 }}>
      <Icon name="check" size={10} color={T.good} />
      <span>{alt ? 'Hearth & Co.' : 'Cobalt Retail'}</span>
      <span style={{ flex: 1 }} />
      <span style={{ fontFamily: T.mono, fontSize: 11.5, color: T.goodInk }}>+${alt ? 48 : 162}k</span>
    </div>
    <div style={{ fontSize: 10, color: T.goodInk, marginTop: 3 }}>Closed {alt ? 'Apr 18' : 'Apr 09'} · {alt ? 'Seats expansion' : 'Tier upgrade'}</div>
  </div>
);

const Placeholder = ({ count = 2 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} style={{
        border: `1px dashed ${T.border}`, borderRadius: 5, padding: '9px 10px',
        background: 'transparent', opacity: 0.55,
      }}>
        <div style={{ height: 8, width: '60%', background: T.borderSubtle, borderRadius: 2, marginBottom: 6 }} />
        <div style={{ height: 6, width: '90%', background: T.borderSubtle, borderRadius: 2, marginBottom: 4 }} />
        <div style={{ height: 6, width: '40%', background: T.borderSubtle, borderRadius: 2 }} />
      </div>
    ))}
  </>
);

export { ExpansionScreen };
