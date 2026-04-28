import React from 'react';
import { T } from './tokens.js';
import { Pill, Dot, ScoreBar } from './ui.jsx';
import { Shell, PageHead, Btn, Tabs, Stat } from './shell.jsx';

// Screen 3: Daily Priority Queue — the ranked worklist

const QUEUE = [
  {
    rank: 1, priority: 'P0', tone: 'risk',
    account: 'Dayframe Media', logo: 'DM', logoC: '#d8482e',
    arr: 148000, headline: 'Executive sponsor lost · churn score +14 in 7d',
    why: ['Sponsor inactive 42d', '4 P1 tickets (30d)', 'WAU −38%'],
    action: 'Send CEO-to-CEO briefing',
    due: 'Today',
    playbook: 'Save-Mid',
    impact: 148000, confidence: 87,
    owner: 'A. Chen', status: 'new',
  },
  {
    rank: 2, priority: 'P0', tone: 'risk',
    account: 'Fieldwork.io', logo: 'FW', logoC: '#d8482e',
    arr: 42000, headline: 'Support spike + contract expires in 23 days',
    why: ['11 tickets (14d)', 'No QBR scheduled', 'Champion left'],
    action: 'Reach new champion via LinkedIn',
    due: 'Today',
    playbook: 'Save-SMB',
    impact: 42000, confidence: 79,
    owner: 'A. Chen', status: 'new',
  },
  {
    rank: 3, priority: 'P1', tone: 'accent',
    account: 'Parallel Bio', logo: 'PB', logoC: '#2f7d5b',
    arr: 240000, headline: 'Seat cap reached · 3 invites queued 8d',
    why: ['88/88 seats', 'Team growth +14 LinkedIn', 'Feature adoption 94%'],
    action: 'Offer Team plan upgrade',
    due: 'Today',
    playbook: 'Expand-Seats',
    impact: 72000, confidence: 91,
    owner: 'J. Park', status: 'in_progress',
  },
  {
    rank: 4, priority: 'P1', tone: 'warn',
    account: 'Meridian Retail', logo: 'MR', logoC: '#b07414',
    arr: 96000, headline: 'NPS dropped 8 → 4 · renewal in 61 days',
    why: ['NPS −4', 'Power user churned', 'Feature requests stalled'],
    action: 'Schedule exec alignment call',
    due: 'Tomorrow',
    playbook: 'Watch-Renewal',
    impact: 96000, confidence: 72,
    owner: 'R. Okafor', status: 'new',
  },
  {
    rank: 5, priority: 'P1', tone: 'accent',
    account: 'Vector Ops', logo: 'VO', logoC: '#4a4a46',
    arr: 312000, headline: 'Q3 budget cycle · ready for SSO tier',
    why: ['Asked about SAML 2×', 'Finance roundtable Apr 30', 'Healthy 88'],
    action: 'Share Enterprise tier proposal',
    due: 'This week',
    playbook: 'Expand-Tier',
    impact: 124000, confidence: 84,
    owner: 'J. Park', status: 'new',
  },
  {
    rank: 6, priority: 'P2', tone: 'info',
    account: 'Oakridge Finance', logo: 'OF', logoC: '#2f7d5b',
    arr: 168000, headline: 'Onboarding milestone 3/5 complete',
    why: ['Integration shipped', 'Training attended 18/20', 'Launch planned'],
    action: 'Confirm go-live date with ops lead',
    due: 'This week',
    playbook: 'Onboard-Ent',
    impact: 0, confidence: 95,
    owner: 'S. Lindh', status: 'new',
  },
  {
    rank: 7, priority: 'P2', tone: 'warn',
    account: 'Saltwell Group', logo: 'SG', logoC: '#b07414',
    arr: 72000, headline: 'Login rate −34% · single-threaded',
    why: ['1 active user', 'No champion mapped', 'Last touch 8d'],
    action: 'Discovery call — stakeholder map',
    due: 'Next week',
    playbook: 'Watch-Depth',
    impact: 72000, confidence: 68,
    owner: 'R. Okafor', status: 'new',
  },
];

const PriorityQueueScreen = () => (
  <Shell active="priority" breadcrumb={['Workspace', 'Priority queue', 'Today']}>
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageHead
        title="Today's priorities"
        subtitle="Wednesday, April 23 · 23 items · ranked by impact × confidence"
        meta={<>
          <span>Owner: <span style={{ color: T.ink2, fontWeight: 500 }}>Me + team</span></span>
          <span>Auto-refresh: <span style={{ color: T.ink2, fontWeight: 500 }}>hourly</span></span>
        </>}
        actions={<div style={{ display: 'flex', gap: 6 }}>
          <Btn icon="refresh" size="sm">Re-rank</Btn>
          <Btn icon="settings" size="sm">Rules</Btn>
          <Btn tone="primary" icon="zap" size="sm">Send daily digest</Btn>
        </div>}
      />

      {/* Day summary strip */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${T.border}`, background: T.surfaceAlt }}>
        <Stat label="Items for me" value="9" unit="of 23" hint="2 overdue" deltaTone="risk" delta="3 new" />
        <Stat label="ARR at risk" value="$532" unit="k" deltaTone="risk" delta="−$84k" hint="7 accounts" />
        <Stat label="Expansion in flight" value="$218" unit="k" deltaTone="good" delta="+$44k" hint="5 accounts" />
        <Stat label="Actions completed · 7d" value="42" delta="+12" deltaTone="good" sparkData={[20,25,30,32,35,38,42]} hint="team" />
        <Stat label="Save rate · 90d" value="61" unit="%" delta="+6pp" deltaTone="good" sparkData={[50,52,54,55,57,59,61]} hint="vs industry 48%" />
        <div style={{ width: 220, padding: '12px 16px', background: T.surface }}>
          <div style={{ fontSize: 10.5, color: T.ink3, letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 8 }}>Team capacity</div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <ScoreBar value={74} tone="warn" width="100%" height={6} />
            <span style={{ fontFamily: T.mono, fontSize: 12, color: T.warn, minWidth: 36, textAlign: 'right' }}>74%</span>
          </div>
          <div style={{ fontSize: 10.5, color: T.ink3, marginTop: 6 }}>A. Chen at 96% · rebalance suggested</div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs active={0} tabs={[
        { label: 'Ranked', count: 23 },
        { label: 'By account', count: 18 },
        { label: 'Snoozed', count: 4 },
        { label: 'Completed · 7d', count: 42 },
      ]} />

      {/* Queue */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', background: T.surfaceAlt, padding: '10px 14px' }}>
        {QUEUE.map((q, i) => (
          <QueueCard key={i} q={q} />
        ))}
        <div style={{ textAlign: 'center', fontSize: 11, color: T.ink3, padding: '14px 0' }}>
          16 more items · <span style={{ color: T.ink2, textDecoration: 'underline' }}>show all</span>
        </div>
      </div>
    </div>
  </Shell>
);

const QueueCard = ({ q }) => (
  <div style={{
    background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6,
    marginBottom: 8, display: 'flex', overflow: 'hidden',
    borderLeft: `3px solid ${q.tone === 'risk' ? T.risk : q.tone === 'warn' ? T.warn : q.tone === 'accent' ? T.accent : T.info}`,
  }}>
    {/* rank + priority */}
    <div style={{ width: 64, padding: '14px 10px', borderRight: `1px solid ${T.borderSubtle}`, textAlign: 'center', background: T.surfaceAlt }}>
      <div style={{ fontFamily: T.mono, fontSize: 20, fontWeight: 500, color: T.ink, letterSpacing: '-0.03em' }}>{q.rank}</div>
      <Pill tone={q.tone}>{q.priority}</Pill>
    </div>

    {/* account + body */}
    <div style={{ flex: 1, padding: '12px 16px', minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
        <div style={{ width: 20, height: 20, borderRadius: 4, background: q.logoC, color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{q.logo}</div>
        <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.005em' }}>{q.account}</span>
        <span style={{ fontSize: 11, color: T.ink3, fontFamily: T.mono }}>{'$' + (q.arr/1000).toFixed(0) + 'k ARR'}</span>
        <span style={{ flex: 1 }} />
        <Pill tone="neutral">Playbook: {q.playbook}</Pill>
        <Pill tone={q.status === 'in_progress' ? 'info' : 'neutral'}>
          <Dot tone={q.status === 'in_progress' ? 'info' : 'neutral'} size={5} />
          {q.status === 'in_progress' ? 'In progress' : 'New'}
        </Pill>
      </div>
      <div style={{ fontSize: 13, color: T.ink, lineHeight: 1.5, marginBottom: 6 }}>{q.headline}</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {q.why.map((w, i) => (
          <span key={i} style={{
            fontSize: 10.5, color: T.ink2, padding: '2px 7px',
            background: T.surfaceSunken, border: `1px solid ${T.border}`, borderRadius: 3,
          }}>{w}</span>
        ))}
      </div>
    </div>

    {/* impact */}
    <div style={{ width: 160, padding: '12px 14px', borderLeft: `1px solid ${T.borderSubtle}`, background: T.surfaceAlt }}>
      <div style={{ fontSize: 10, color: T.ink3, letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 4 }}>
        {q.tone === 'accent' || (q.priority === 'P1' && q.impact > 0 && q.tone !== 'warn' && q.tone !== 'risk') ? 'Expansion' : 'ARR at stake'}
      </div>
      <div style={{ fontFamily: T.mono, fontSize: 16, fontWeight: 500, letterSpacing: '-0.02em', color: q.tone === 'accent' || q.tone === 'info' ? T.good : T.risk }}>
        {q.impact ? '$' + (q.impact/1000).toFixed(0) + 'k' : '—'}
      </div>
      <div style={{ fontSize: 10.5, color: T.ink3, marginTop: 8 }}>Confidence</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
        <ScoreBar value={q.confidence} tone={q.confidence > 80 ? 'good' : 'warn'} width={70} height={4} />
        <span style={{ fontFamily: T.mono, fontSize: 11, color: T.ink2 }}>{q.confidence}%</span>
      </div>
    </div>

    {/* Actions */}
    <div style={{ width: 210, padding: '12px 14px', borderLeft: `1px solid ${T.borderSubtle}`, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: 10, color: T.ink3, letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500 }}>Next action</div>
      <div style={{ fontSize: 12, color: T.ink, fontWeight: 500, lineHeight: 1.35 }}>{q.action}</div>
      <div style={{ fontSize: 10.5, color: T.ink3, display: 'flex', gap: 8 }}>
        <span>Due {q.due}</span>·<span>{q.owner}</span>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', gap: 4 }}>
        <Btn tone="primary" size="sm" icon="mail">Draft</Btn>
        <Btn size="sm" icon="check">Done</Btn>
        <Btn tone="subtle" size="sm" icon="dots" />
      </div>
    </div>
  </div>
);

export { PriorityQueueScreen };
