import React from 'react';
import { T } from './tokens.js';
import { Pill, ScoreBar } from './ui.jsx';
import { Shell, PageHead, Btn, Stat, Card } from './shell.jsx';

// Screen 4: Churn risk analysis — portfolio-level model view

const COHORT_ACCOUNTS = [
  { name: 'Dayframe Media',   arr: 148, risk: 78, days: 47, trend: 'up',   driver: 'Sponsor lost' },
  { name: 'Fieldwork.io',     arr: 42,  risk: 62, days: 23, trend: 'up',   driver: 'Support spike' },
  { name: 'Meridian Retail',  arr: 96,  risk: 31, days: 61, trend: 'up',   driver: 'NPS drop' },
  { name: 'Saltwell Group',   arr: 72,  risk: 44, days: 88, trend: 'up',   driver: 'Single-threaded' },
  { name: 'Ridgeline Foods',  arr: 58,  risk: 39, days: 102, trend: 'flat', driver: 'Low adoption' },
  { name: 'Heliot Systems',   arr: 128, risk: 36, days: 71, trend: 'down', driver: 'Stakeholder gap' },
  { name: 'Portside Media',   arr: 34,  risk: 29, days: 134, trend: 'up',  driver: 'Feature regression' },
  { name: 'Cobalt Retail',    arr: 164, risk: 24, days: 156, trend: 'flat', driver: 'Billing change' },
];

const HEATMAP = [
  // segment × risk band
  { seg: 'Enterprise',   low: 82, mid: 14,  high: 4 },
  { seg: 'Mid-market',   low: 61, mid: 28,  high: 11 },
  { seg: 'SMB',          low: 48, mid: 34,  high: 18 },
  { seg: 'Onboarding',   low: 38, mid: 42,  high: 20 },
];

const ChurnScreen = () => (
  <Shell active="churn" breadcrumb={['Signals', 'Churn risk', 'Portfolio']}>
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageHead
        title="Churn risk"
        subtitle="23 accounts in red · $1.24M ARR · model v2.4 · 94.2% precision @ 60d"
        meta={<>
          <span>Horizon: <span style={{ color: T.ink2, fontWeight: 500 }}>90 days</span></span>
          <span>Model: <span style={{ color: T.ink2, fontWeight: 500 }}>v2.4 · Apr 18</span></span>
        </>}
        actions={<div style={{ display: 'flex', gap: 6 }}>
          <Btn icon="chart" size="sm">Compare models</Btn>
          <Btn icon="external" size="sm">Export cohort</Btn>
          <Btn tone="primary" icon="zap" size="sm">Trigger save playbook</Btn>
        </div>}
      />

      <div style={{ display: 'flex', borderBottom: `1px solid ${T.border}`, background: T.surfaceAlt }}>
        <Stat label="Accounts in high risk" value="23" unit="of 412" deltaTone="risk" delta="+4 w/w" hint="5.6% of book" />
        <Stat label="ARR at risk" value="$1.24" unit="M" delta="−$180k" deltaTone="good" sparkTone="risk" sparkData={[1.6,1.55,1.5,1.42,1.38,1.35,1.3,1.26,1.24]} hint="vs 4w ago" />
        <Stat label="Avg days to event" value="58" unit="days" hint="median 51" />
        <Stat label="Save rate · trailing" value="61" unit="%" delta="+6pp" deltaTone="good" sparkData={[50,52,54,55,57,59,61]} hint="industry 48%" />
        <Stat label="Model precision" value="94.2" unit="%" delta="+1.1" deltaTone="good" sparkData={[91.8,92.1,92.5,93,93.4,93.8,94.2]} hint="@ 60d horizon" />
        <div style={{ width: 240, padding: '12px 16px', background: T.surface }}>
          <div style={{ fontSize: 10.5, color: T.ink3, letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 6 }}>Model calibration</div>
          <div style={{ display: 'flex', gap: 2 }}>
            {[0.08, 0.14, 0.22, 0.31, 0.42, 0.58, 0.68, 0.79, 0.89, 0.94].map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{ height: 34, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{ width: '100%', height: `${v * 100}%`, background: i > 6 ? T.risk : i > 3 ? T.warn : T.good, borderRadius: 1 }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 9.5, color: T.ink3, marginTop: 4, fontFamily: T.mono }}>0% ────── predicted ────── 100%</div>
        </div>
      </div>

      {/* Two-col body */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1.3, minWidth: 0, padding: 14, overflow: 'auto', background: T.surfaceAlt, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card title="Churn risk distribution · last 90 days" right={<Pill tone="info">412 accounts</Pill>}>
            <div style={{ padding: '18px 18px 14px', height: 220, position: 'relative' }}>
              <RiskHistogram />
            </div>
          </Card>

          <Card title="Signal attribution · top churn drivers (SHAP)">
            <div style={{ padding: '10px 16px 14px' }}>
              {[
                { label: 'Sponsor / exec engagement', v: 0.24, examples: '42 accounts' },
                { label: 'Support severity (P1/P2 30d)', v: 0.19, examples: '28 accounts' },
                { label: 'WAU / DAU decline', v: 0.16, examples: '61 accounts' },
                { label: 'Feature adoption breadth', v: 0.12, examples: '94 accounts' },
                { label: 'Time-to-value milestones', v: 0.11, examples: '37 accounts' },
                { label: 'NPS / survey response', v: 0.09, examples: '15 accounts' },
                { label: 'Billing / contract signal', v: 0.09, examples: '22 accounts' },
              ].map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '7px 0', borderTop: i > 0 ? `1px solid ${T.borderSubtle}` : 'none' }}>
                  <div style={{ flex: 1.4, fontSize: 12, color: T.ink }}>{d.label}</div>
                  <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 6, background: T.surfaceSunken, borderRadius: 2, position: 'relative' }}>
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${d.v * 100 / 0.24}%`, background: T.risk, borderRadius: 2 }} />
                    </div>
                    <span style={{ fontFamily: T.mono, fontSize: 11, color: T.ink2, minWidth: 42 }}>{(d.v * 100).toFixed(0)}%</span>
                  </div>
                  <div style={{ flex: 0.8, fontSize: 10.5, color: T.ink3, fontFamily: T.mono, textAlign: 'right' }}>{d.examples}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div style={{ flex: 1, minWidth: 0, padding: 14, overflow: 'auto', background: T.surfaceAlt, borderLeft: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card title="Segment × risk band" subtitle="% of accounts in each bucket">
            <div style={{ padding: '8px 14px 14px' }}>
              <div style={{ display: 'flex', fontSize: 10, color: T.ink3, textTransform: 'uppercase', letterSpacing: '0.05em', paddingLeft: 92, gap: 4, marginBottom: 6 }}>
                <div style={{ flex: 1, textAlign: 'center' }}>Low</div>
                <div style={{ flex: 1, textAlign: 'center' }}>Mid</div>
                <div style={{ flex: 1, textAlign: 'center' }}>High</div>
              </div>
              {HEATMAP.map((row, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 0' }}>
                  <div style={{ width: 88, fontSize: 11.5, color: T.ink2 }}>{row.seg}</div>
                  <HeatCell v={row.low} tone="good" />
                  <HeatCell v={row.mid} tone="warn" />
                  <HeatCell v={row.high} tone="risk" />
                </div>
              ))}
            </div>
          </Card>

          <Card title="Highest-risk accounts" subtitle="sorted by ARR × risk" bodyPad={0}
            right={<Btn size="sm" icon="filter">Filter</Btn>}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5 }}>
              <thead>
                <tr style={{ background: T.surfaceAlt, borderBottom: `1px solid ${T.border}` }}>
                  {['Account', 'ARR', 'Risk', 'Event in', 'Primary driver'].map((h, i) => (
                    <th key={i} style={{ padding: '6px 10px', fontSize: 9.5, color: T.ink3, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: i === 1 || i === 2 || i === 3 ? 'right' : 'left', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COHORT_ACCOUNTS.map((a, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${T.borderSubtle}` }}>
                    <td style={{ padding: '7px 10px', color: T.ink, fontWeight: 500 }}>{a.name}</td>
                    <td style={{ padding: '7px 10px', fontFamily: T.mono, textAlign: 'right', color: T.ink2 }}>${a.arr}k</td>
                    <td style={{ padding: '7px 10px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <ScoreBar value={a.risk} tone={a.risk > 60 ? 'risk' : a.risk > 35 ? 'warn' : 'good'} width={40} height={4} />
                        <span style={{ fontFamily: T.mono, color: a.risk > 60 ? T.risk : a.risk > 35 ? T.warn : T.ink2, minWidth: 18 }}>{a.risk}</span>
                      </div>
                    </td>
                    <td style={{ padding: '7px 10px', textAlign: 'right', fontFamily: T.mono, color: T.ink3 }}>{a.days}d</td>
                    <td style={{ padding: '7px 10px', color: T.ink2, fontSize: 11 }}>{a.driver}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  </Shell>
);

const HeatCell = ({ v, tone }) => {
  const color = tone === 'good' ? T.good : tone === 'warn' ? T.warn : T.risk;
  // Use alpha to show intensity
  const alpha = 0.1 + (v / 100) * 0.55;
  return (
    <div style={{
      flex: 1, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: color, opacity: 0.18 + (v / 100) * 0.8,
      color: v > 30 ? '#fff' : '#fff',
      fontFamily: T.mono, fontSize: 11, fontWeight: 500, borderRadius: 2,
    }}>{v}%</div>
  );
};

const RiskHistogram = () => {
  const bars = [88, 74, 62, 54, 42, 34, 28, 22, 14, 12, 10, 8, 6, 5, 7, 9, 11, 14, 16, 18];
  const max = Math.max(...bars);
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 160, marginLeft: 30 }}>
      {/* Y axis ticks */}
      <div style={{ position: 'absolute', left: 12, top: 18, height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: 9.5, color: T.ink4, fontFamily: T.mono }}>
        <span>100</span><span>50</span><span>0</span>
      </div>
      {bars.map((b, i) => {
        const tone = i < 7 ? T.good : i < 14 ? T.warn : T.risk;
        const showLabel = i === 0 || i === 10 || i === 19;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: '100%', height: `${(b / max) * 150}px`, background: tone, borderRadius: '2px 2px 0 0', opacity: 0.9 }} />
            {showLabel && <span style={{ fontSize: 9, color: T.ink3, fontFamily: T.mono }}>{i * 5}</span>}
          </div>
        );
      })}
      <div style={{ position: 'absolute', bottom: 0, left: 40, right: 20, display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: T.ink4, fontFamily: T.mono }}>
        <span>risk 0</span><span>50</span><span>100</span>
      </div>
    </div>
  );
};

export { ChurnScreen };
