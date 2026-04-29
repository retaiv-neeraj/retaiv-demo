import React from 'react';
import { T } from './tokens.js';
import { Pill, Dot, ScoreBar, Icon } from './ui.jsx';
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

const DigestToast = ({ message }) => (
  <div style={{
    position: 'fixed', right: 18, bottom: 18, zIndex: 1100,
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: T.ink, color: '#fff',
    border: `1px solid ${T.ink2}`, borderRadius: 8,
    padding: '9px 14px', fontSize: T.fs.small, fontFamily: T.sans,
    boxShadow: '0 12px 28px rgba(0,0,0,0.35)',
    letterSpacing: '-0.005em',
  }}>
    <Icon name="check" size={13} color="#9ad4a7" />
    <span>{message}</span>
  </div>
);

const TOP_ACCOUNTS = [
  { logo: 'DM', logoC: '#d8482e', name: 'Dayframe Media' },
  { logo: 'FW', logoC: '#d8482e', name: 'Fieldwork.io' },
  { logo: 'PB', logoC: '#2f7d5b', name: 'Parallel Bio' },
];

const DigestModal = ({ onClose, onSend }) => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 180);
  };

  const previewRows = [
    {
      label: "Today's priorities",
      pill: <Pill tone="neutral">23 items · 9 assigned to me</Pill>,
    },
    {
      label: 'ARR at risk',
      pill: <Pill tone="risk">$532k · 7 accounts</Pill>,
    },
    {
      label: 'Expansion in flight',
      pill: <Pill tone="good">$218k · 5 accounts</Pill>,
    },
  ];

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1050,
        background: 'rgba(20,20,18,0.58)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
        opacity: visible ? 1 : 0,
        transition: 'opacity 180ms ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 480,
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 12,
          boxShadow: '0 20px 60px rgba(0,0,0,0.30), 0 2px 8px rgba(0,0,0,0.18)',
          fontFamily: T.sans,
          transform: visible ? 'translateY(0)' : 'translateY(10px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 180ms ease, opacity 180ms ease',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 10,
          padding: '18px 20px 14px',
          borderBottom: `1px solid ${T.border}`,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: T.fs.lead, fontWeight: 600, color: T.ink, letterSpacing: '-0.015em' }}>
              Send Daily Digest
            </div>
            <div style={{ fontSize: T.fs.small, color: T.ink3, marginTop: 3 }}>
              A snapshot of today's CS priorities — sent to your team.
            </div>
          </div>
          <button
            onClick={handleClose}
            style={{
              width: 28, height: 28, border: 'none', background: 'transparent',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 5, color: T.ink3, flexShrink: 0,
            }}
          >
            <Icon name="x" size={14} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '16px 20px' }}>
          <div style={{
            fontSize: T.fs.micro, textTransform: 'uppercase', letterSpacing: '0.07em',
            fontWeight: 600, color: T.ink3, marginBottom: 10,
          }}>
            Digest preview
          </div>

          <div style={{
            background: T.surfaceAlt,
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            overflow: 'hidden',
          }}>
            {previewRows.map((row, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderBottom: i < previewRows.length - 1 ? `1px solid ${T.borderSubtle}` : 'none',
                }}
              >
                <span style={{ fontSize: T.fs.body, color: T.ink2 }}>{row.label}</span>
                {row.pill}
              </div>
            ))}

            {/* Top 3 accounts row */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 14px',
              borderTop: `1px solid ${T.borderSubtle}`,
            }}>
              <span style={{ fontSize: T.fs.body, color: T.ink2 }}>Top 3 focus accounts</span>
              <div style={{ display: 'flex', gap: 5 }}>
                {TOP_ACCOUNTS.map(a => (
                  <div key={a.logo} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '2px 7px 2px 4px',
                    background: T.surface, border: `1px solid ${T.border}`,
                    borderRadius: 4,
                  }}>
                    <div style={{
                      width: 14, height: 14, borderRadius: 3,
                      background: a.logoC, color: '#fff',
                      fontSize: 8, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{a.logo}</div>
                    <span style={{ fontSize: 11, color: T.ink2, fontWeight: 500 }}>{a.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recipient line */}
          <div style={{
            marginTop: 12,
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: T.fs.small, color: T.ink3,
          }}>
            <Icon name="mail" size={12} color={T.ink3} />
            <span>Sending to your CS team · 4 members</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: 8,
          padding: '12px 20px 18px',
          borderTop: `1px solid ${T.border}`,
        }}>
          <Btn tone="ghost" size="sm" onClick={handleClose}>Cancel</Btn>
          <button
            onClick={onSend}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '5px 14px', borderRadius: 6,
              background: T.ink, color: '#fff',
              border: `1px solid ${T.ink}`,
              fontFamily: T.sans, fontSize: T.fs.body - 1, fontWeight: 500,
              cursor: 'pointer', letterSpacing: '-0.005em',
            }}
          >
            Send Digest →
          </button>
        </div>
      </div>
    </div>
  );
};

const PriorityQueueScreen = () => {
  const [showDigest, setShowDigest] = React.useState(false);
  const [toast, setToast] = React.useState('');

  const handleSend = () => {
    console.log('[Retaiv] Daily digest sent', { items: QUEUE.length, timestamp: new Date().toISOString() });
    setShowDigest(false);
    setToast('Daily digest sent successfully to your team!');
    setTimeout(() => setToast(''), 2800);
  };

  return (
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
            <Btn tone="primary" icon="zap" size="sm" onClick={() => setShowDigest(true)}>Send daily digest</Btn>
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

      {showDigest && <DigestModal onClose={() => setShowDigest(false)} onSend={handleSend} />}
      {toast && <DigestToast message={toast} />}
    </Shell>
  );
};

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
