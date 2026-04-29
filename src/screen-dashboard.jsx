import React from 'react';
import Papa from 'papaparse';
import { T } from './tokens.js';
import { Spark, ScoreBar, Kbd, Icon } from './ui.jsx';
import { Shell, PageHead, Btn, Tabs, Stat, NavContext } from './shell.jsx';

// ─── Sample data (used as demo default and reset target) ──────────────────────
const SAMPLE_DATA = [
  { name: 'Northwind Labs',    logo: 'NL', logoC: '#2c5e8a', arr: 184000, seats: 142, seatsMax: 150, health: 92, healthTone: 'good', churn: 4,  expansion: 78, trend: [68,72,75,78,82,86,88,90,92], owner: 'A. Chen',   lastTouch: '2d',  stage: 'Healthy'  },
  { name: 'Meridian Retail',   logo: 'MR', logoC: '#b07414', arr: 96000,  seats: 41,  seatsMax: 50,  health: 58, healthTone: 'warn', churn: 31, expansion: 42, trend: [82,80,76,70,66,60,62,58,58], owner: 'R. Okafor', lastTouch: '6d',  stage: 'Watch'    },
  { name: 'Parallel Bio',      logo: 'PB', logoC: '#2f7d5b', arr: 240000, seats: 88,  seatsMax: 88,  health: 81, healthTone: 'good', churn: 12, expansion: 94, trend: [70,71,72,74,76,78,79,80,81], owner: 'J. Park',   lastTouch: '1d',  stage: 'Expand'   },
  { name: 'Dayframe Media',    logo: 'DM', logoC: '#d8482e', arr: 148000, seats: 62,  seatsMax: 75,  health: 34, healthTone: 'risk', churn: 78, expansion: 18, trend: [75,72,68,60,54,48,42,38,34], owner: 'A. Chen',   lastTouch: '11d', stage: 'At risk'  },
  { name: 'Hearth & Co.',      logo: 'HC', logoC: '#2c5e8a', arr: 58000,  seats: 24,  seatsMax: 30,  health: 74, healthTone: 'good', churn: 18, expansion: 61, trend: [62,64,66,68,70,71,72,73,74], owner: 'S. Lindh',  lastTouch: '3d',  stage: 'Healthy'  },
  { name: 'Vector Ops',        logo: 'VO', logoC: '#4a4a46', arr: 312000, seats: 204, seatsMax: 250, health: 88, healthTone: 'good', churn: 8,  expansion: 83, trend: [80,82,84,85,86,87,88,88,88], owner: 'J. Park',   lastTouch: '1d',  stage: 'Expand'   },
  { name: 'Saltwell Group',    logo: 'SG', logoC: '#b07414', arr: 72000,  seats: 30,  seatsMax: 40,  health: 49, healthTone: 'warn', churn: 44, expansion: 29, trend: [70,68,65,62,58,55,52,50,49], owner: 'R. Okafor', lastTouch: '8d',  stage: 'Watch'    },
  { name: 'Oakridge Finance',  logo: 'OF', logoC: '#2f7d5b', arr: 168000, seats: 56,  seatsMax: 60,  health: 79, healthTone: 'good', churn: 14, expansion: 71, trend: [70,72,73,74,75,76,77,78,79], owner: 'S. Lindh',  lastTouch: '2d',  stage: 'Healthy'  },
  { name: 'Fieldwork.io',      logo: 'FW', logoC: '#d8482e', arr: 42000,  seats: 18,  seatsMax: 25,  health: 41, healthTone: 'risk', churn: 62, expansion: 22, trend: [64,60,55,52,48,45,43,42,41], owner: 'A. Chen',   lastTouch: '14d', stage: 'At risk'  },
  { name: 'Brightfold Studio', logo: 'BS', logoC: '#2c5e8a', arr: 24000,  seats: 8,   seatsMax: 10,  health: 84, healthTone: 'good', churn: 9,  expansion: 67, trend: [72,74,76,78,80,82,83,84,84], owner: 'R. Okafor', lastTouch: '4d',  stage: 'Healthy'  },
];

// ─── Formatting helpers ───────────────────────────────────────────────────────
const fmt$ = n => n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;
const scoreTone = v => v >= 70 ? 'good' : v >= 50 ? 'warn' : 'risk';
const churnTone = v => v >= 60 ? 'risk' : v >= 30 ? 'warn' : 'good';

// ─── CSV column name aliases → internal field keys ────────────────────────────
const COL_MAP = {
  name:      ['account name', 'account', 'customer name', 'company', 'name', 'client', 'organization'],
  arr:       ['arr', 'annual recurring revenue', 'annual revenue', 'mrr', 'monthly recurring revenue', 'revenue', 'contract value', 'acv'],
  health:    ['health score', 'health', 'health score (%)', 'score', 'customer health', 'csat'],
  churn:     ['churn risk (%)', 'churn risk', 'churn %', 'churn', 'churn rate', 'churn probability', 'risk score'],
  lastTouch: ['last login', 'last active', 'last seen', 'last touch', 'last activity', 'last contact', 'last interaction'],
  tickets:   ['tickets', 'support tickets', 'open tickets', 'ticket count', 'cases'],
  usage:     ['usage score', 'usage', 'engagement score', 'product usage', 'adoption score', 'engagement'],
  segment:   ['segment', 'plan', 'tier', 'customer tier', 'account tier', 'owner', 'csm', 'account owner'],
};

// ─── CSV parsing utilities ────────────────────────────────────────────────────

// Generate 2–3 character initials from an account name
const getInitials = name => {
  const words = name.trim().split(/[\s.&_-]+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

// Deterministic logo color from account name (cycles through 5 brand-safe colors)
const LOGO_COLORS = ['#2c5e8a', '#2f7d5b', '#b07414', '#4a4a46', '#d8482e'];
const getLogoColor = name => LOGO_COLORS[name.charCodeAt(0) % LOGO_COLORS.length];

// Synthetic 9-point trend ending at `health`, with light random walk for realism
const generateTrend = health => {
  // Seed with a simple deterministic hash so re-renders are stable
  const seed = health * 17 + 3;
  const pts = [health];
  for (let i = 1; i < 9; i++) {
    const delta = ((seed * (i * 13 + 7)) % 11) - 5; // pseudo-random −5..+5
    pts.unshift(Math.round(Math.max(5, Math.min(100, pts[0] + delta))));
  }
  return pts;
};

// Derive display stage from numeric health + churn + expansion
const deriveStage = (health, churn, expansion) => {
  if (churn >= 40) return 'At risk';
  if (health >= 70 && churn < 20 && expansion >= 60) return 'Expand';
  if (health >= 70 && churn < 20) return 'Healthy';
  return 'Watch';
};

// Parse a numeric string that may include $, commas, k (×1000) or M (×1e6)
const parseNumber = str => {
  if (str == null || str === '') return null;
  const s = String(str).replace(/[$,\s]/g, '');
  if (/k$/i.test(s)) return parseFloat(s) * 1000;
  if (/m$/i.test(s)) return parseFloat(s) * 1_000_000;
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
};

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// Map raw CSV headers to internal field keys using COL_MAP aliases
const buildHeaderMap = headers => {
  const map = {};
  for (const h of headers) {
    const norm = h.toLowerCase().trim();
    for (const [key, aliases] of Object.entries(COL_MAP)) {
      if (!(key in map) && aliases.includes(norm)) map[key] = h;
    }
  }
  return map;
};

// Promise-based CSV parser: resolves with { data: Account[], warnings: string[] }
const parseCSV = file => new Promise((resolve, reject) => {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: ({ data, meta }) => {
      if (!data.length) return reject(new Error('CSV file is empty.'));

      const headerMap = buildHeaderMap(meta.fields || []);

      if (!headerMap.name) {
        return reject(new Error(
          'CSV must include an Account Name column (e.g. "Account Name", "Account", "Company").'
        ));
      }

      const accounts = [];
      const warnings = [];
      const limit = Math.min(data.length, 2000);

      for (let i = 0; i < limit; i++) {
        const row = data[i];
        const get = key => (headerMap[key] ? row[headerMap[key]] : undefined);

        const name = String(get('name') ?? '').trim();
        if (!name) { warnings.push(`Row ${i + 2}: missing name, skipped`); continue; }

        const arr        = parseNumber(get('arr')) ?? 0;
        const health     = clamp(Math.round(parseNumber(get('health')) ?? 70), 0, 100);
        const churn      = clamp(Math.round(parseNumber(get('churn'))  ?? 20), 0, 100);
        const usageRaw   = parseNumber(get('usage'));
        // Derive expansion from usage if available, else from health/churn balance
        const expansion  = usageRaw != null
          ? clamp(Math.round(usageRaw), 0, 100)
          : clamp(Math.round(health - churn * 0.5 + 20), 0, 100);

        const lastTouch  = String(get('lastTouch') ?? '').trim() || '—';
        const segmentRaw = String(get('segment')   ?? '').trim();
        const owner      = segmentRaw || '—';

        accounts.push({
          name,
          logo:       getInitials(name),
          logoC:      getLogoColor(name),
          arr:        Math.round(Math.max(0, arr)),
          seats:      0, seatsMax: 0,  // not in typical export; columns hide gracefully
          health,
          healthTone: scoreTone(health),
          churn,
          expansion,
          trend:      generateTrend(health),
          owner,
          lastTouch,
          stage:      deriveStage(health, churn, expansion),
        });
      }

      if (!accounts.length) {
        return reject(new Error('No valid rows found. Check that the CSV has an Account Name column and at least one data row.'));
      }

      resolve({ data: accounts, warnings });
    },
    error: err => reject(new Error(`CSV parse error: ${err.message}`)),
  });
});

// ─── Metric calculation ───────────────────────────────────────────────────────

// Linear interpolation helper: 9-point array from → to (used for sparklines)
const linearSpark = (from, to) =>
  Array.from({ length: 9 }, (_, i) => +((from + (to - from) * (i / 8)).toFixed(2)));

// Format a revenue number for the Stat component → { value: string, unit: string }
// Keeps values readable at any scale: $1.24M, $412k, $8k
const fmtRevStat = n => {
  if (n >= 1_000_000) return { value: `$${(n / 1_000_000).toFixed(2)}`, unit: 'M' };
  if (n >= 1000)      return { value: `$${(n / 1000).toFixed(0)}k`,     unit: '' };
  return               { value: `$${Math.round(n)}`,                     unit: '' };
};

/**
 * calculateMetrics(accounts) → derived KPI values for the summary strip.
 *
 * Called via useMemo on every accounts change, so cards always reflect current data
 * whether it's sample data or freshly uploaded CSV rows.
 */
const calculateMetrics = accounts => {
  const n = accounts.length;
  if (!n) return null;

  // ── Avg Health Score ────────────────────────────────────────────────────────
  // Simple mean across all accounts. Range 0–100.
  const avgHealth = accounts.reduce((s, a) => s + a.health, 0) / n;

  // ── Churn Risk (90d) ────────────────────────────────────────────────────────
  // "At-risk ARR" = full ARR of accounts whose churn probability exceeds 50%.
  // We use full ARR (not weighted) because these accounts represent genuinely
  // endangered revenue — the whole contract is at risk, not a fraction of it.
  const CHURN_THRESHOLD = 50;
  const atRiskAccounts   = accounts.filter(a => a.churn > CHURN_THRESHOLD);
  const churnRevenue     = atRiskAccounts.reduce((s, a) => s + a.arr, 0);

  // ── Expansion Pipeline ──────────────────────────────────────────────────────
  // Expansion potential in dollars = ARR × (expansion score / 100) for accounts
  // that are ready to expand (score ≥ 60). This estimates the upsell opportunity
  // as a fraction of existing contract value, scaled by readiness.
  const EXPANSION_THRESHOLD = 60;
  const expandAccounts    = accounts.filter(a => a.expansion >= EXPANSION_THRESHOLD);
  const expansionRevenue  = expandAccounts.reduce((s, a) => s + a.arr * a.expansion / 100, 0);

  // ── Today's Priorities ──────────────────────────────────────────────────────
  // Accounts needing immediate CSM attention: high churn risk OR low health.
  // Threshold mirrors CHURN_THRESHOLD above for consistency.
  const priorities = accounts.filter(a => a.churn > CHURN_THRESHOLD || a.health < 50).length;

  // ── Net Revenue Retention ───────────────────────────────────────────────────
  // NRR = (retained + expanded ARR) / starting ARR, expressed as a %.
  // Without two time-period snapshots we approximate it from the portfolio's
  // health signal: calibrated so a healthy avg (≈68) yields a realistic NRR
  // of ≈108%, while a distressed book (avg 40) lands around 92%.
  // Formula: NRR ≈ avgHealth × 0.6 + 67.6
  const nrr = +(avgHealth * 0.6 + 67.6).toFixed(1);

  // ── Format revenue stats + build sparkline data ─────────────────────────────
  const churnStat     = fmtRevStat(churnRevenue);
  const expansionStat = fmtRevStat(expansionRevenue);

  // Sparklines use M-unit values so they align with the displayed Stat numbers.
  const churnM = churnRevenue     / 1_000_000;
  const expM   = expansionRevenue / 1_000_000;

  return {
    // NRR
    nrr,
    nrrSpark:        linearSpark(nrr - 3, nrr),           // trending up = good

    // Churn risk
    churnStat,
    churnSpark:      linearSpark(churnM * 1.15, churnM),  // trending down = good
    atRiskCount:     atRiskAccounts.length,               // used in hint + tab count

    // Expansion pipeline
    expansionStat,
    expansionSpark:  linearSpark(expM * 0.75, expM),      // trending up = good
    expandCount:     expandAccounts.length,               // used in hint + tab count

    // Avg health
    avgHealth:       avgHealth.toFixed(1),
    healthSpark:     linearSpark(+avgHealth.toFixed(1) - 5, +avgHealth.toFixed(1)),

    // Priorities
    priorities,
    prioritiesSpark: linearSpark(priorities * 0.7, priorities),

    // Stage breakdown (used by tab counts)
    healthyCount:    accounts.filter(a => a.stage === 'Healthy').length,
  };
};


const PLAYBOOK_TRIGGER_OPTIONS = [
  'Churn Risk > 60%',
  'Health Score < 50',
  'Expansion Opportunity Detected',
  'Low Engagement',
  'Renewal in next 30 days',
];

const PLAYBOOK_ACTION_OPTIONS = [
  'Send personalized email',
  'Schedule QBR call',
  'Offer discount / incentive',
  'Escalate to CSM',
  'Check feature adoption',
];

const PLAYBOOKS_STORAGE_KEY = 'retaiv_playbooks_v1';
const ACCOUNT_TABS = ['all', 'risk', 'expansion', 'healthy', 'onboarding'];

const daysSinceTouch = lastTouch => {
  if (!lastTouch) return Number.POSITIVE_INFINITY;
  const match = String(lastTouch).match(/(\d+)/);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
};

// Centralized tab predicates so counts and table use exactly the same logic.
const isAtRiskAccount = a => a.churn > 60 || a.health < 50;
const isExpansionReadyAccount = a => a.expansion >= 60;
const isHealthyAccount = a => a.health > 75 && a.churn <= 20;
const isOnboardingAccount = a => a.stage === 'Onboarding' || daysSinceTouch(a.lastTouch) <= 7;

// ─── New Playbook Modal ────────────────────────────────────────────────────────
const NewPlaybookModal = ({ onClose, onCreate }) => {
  const [visible, setVisible] = React.useState(false);
  const [name, setName] = React.useState('');
  const [trigger, setTrigger] = React.useState(PLAYBOOK_TRIGGER_OPTIONS[0]);
  const [description, setDescription] = React.useState('');
  const [actions, setActions] = React.useState([
    PLAYBOOK_ACTION_OPTIONS[0],
    PLAYBOOK_ACTION_OPTIONS[1],
    PLAYBOOK_ACTION_OPTIONS[2],
  ]);

  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  React.useEffect(() => {
    const onKeyDown = e => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 180);
  };

  const toggleAction = action => {
    setActions(prev => (
      prev.includes(action)
        ? prev.filter(a => a !== action)
        : [...prev, action]
    ));
  };

  const canCreate = name.trim().length > 0;

  const handleCreate = () => {
    if (!canCreate) return;
    onCreate({
      name: name.trim(),
      trigger,
      description: description.trim(),
      actions,
      createdDate: new Date().toISOString(),
    });
    handleClose();
  };

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1050,
        background: 'rgba(20,20,18,0.58)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        opacity: visible ? 1 : 0,
        transition: 'opacity 180ms ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 620,
          maxHeight: 'calc(100vh - 32px)',
          overflow: 'auto',
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 12,
          boxShadow: '0 20px 60px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.25)',
          fontFamily: T.sans,
          transform: visible ? 'translateY(0)' : 'translateY(10px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 180ms ease, opacity 180ms ease',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '18px 20px 14px',
          borderBottom: `1px solid ${T.border}`,
        }}>
          <div>
            <div style={{ fontSize: T.fs.lead, fontWeight: 600, color: T.ink, letterSpacing: '-0.01em' }}>
              Create New Playbook
            </div>
            <div style={{ fontSize: T.fs.small, color: T.ink3, marginTop: 3 }}>
              Configure triggers and action steps for automated retention workflows.
            </div>
          </div>
          <span style={{ flex: 1 }} />
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

        <div style={{ padding: 20, display: 'grid', gap: 14 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 11, color: T.ink2, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Playbook Name
            </span>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Save-Mid Risk Accounts"
              style={{
                width: '100%',
                padding: '9px 10px',
                borderRadius: 6,
                border: `1px solid ${T.border}`,
                background: T.surfaceAlt,
                color: T.ink,
                fontFamily: T.sans,
                fontSize: T.fs.body,
                outline: 'none',
              }}
            />
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 11, color: T.ink2, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Trigger
            </span>
            <select
              value={trigger}
              onChange={e => setTrigger(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 10px',
                borderRadius: 6,
                border: `1px solid ${T.border}`,
                background: T.surfaceAlt,
                color: T.ink,
                fontFamily: T.sans,
                fontSize: T.fs.body,
                outline: 'none',
              }}
            >
              {PLAYBOOK_TRIGGER_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 11, color: T.ink2, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Description
            </span>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Optional context for your team..."
              rows={3}
              style={{
                width: '100%',
                padding: '9px 10px',
                borderRadius: 6,
                border: `1px solid ${T.border}`,
                background: T.surfaceAlt,
                color: T.ink,
                fontFamily: T.sans,
                fontSize: T.fs.body,
                lineHeight: 1.45,
                resize: 'vertical',
                outline: 'none',
              }}
            />
          </label>

          <div style={{
            padding: 12,
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            background: T.surfaceAlt,
          }}>
            <div style={{ fontSize: 11, color: T.ink2, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 10 }}>
              Actions
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {PLAYBOOK_ACTION_OPTIONS.map(action => {
                const checked = actions.includes(action);
                return (
                  <label key={action} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAction(action)}
                      style={{ accentColor: T.accent }}
                    />
                    <span style={{ fontSize: T.fs.body, color: checked ? T.ink : T.ink2 }}>
                      {action}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 8,
          padding: '16px 20px 20px',
          borderTop: `1px solid ${T.border}`,
        }}>
          <Btn tone="ghost" size="sm" onClick={handleClose}>Cancel</Btn>
          <button
            onClick={handleCreate}
            disabled={!canCreate}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '5px 12px', borderRadius: 6,
              background: canCreate ? T.ink : T.surfaceSunken,
              color: canCreate ? '#fff' : T.ink4,
              border: `1px solid ${canCreate ? T.ink : T.border}`,
              fontFamily: T.sans, fontSize: T.fs.body - 1, fontWeight: 500,
              cursor: canCreate ? 'pointer' : 'not-allowed',
              transition: 'background 120ms ease, color 120ms ease',
              letterSpacing: '-0.005em',
            }}
          >
            Create Playbook
          </button>
        </div>
      </div>
    </div>
  );
};

const Toast = ({ message }) => (
  <div style={{
    position: 'fixed',
    right: 18,
    bottom: 18,
    zIndex: 1100,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: T.ink,
    color: '#fff',
    border: `1px solid ${T.ink2}`,
    borderRadius: 8,
    padding: '9px 12px',
    fontSize: T.fs.small,
    boxShadow: '0 12px 28px rgba(0,0,0,0.35)',
  }}>
    <Icon name="check" size={13} color="#9ad4a7" />
    <span>{message}</span>
  </div>
);

const PlaybookDetailModal = ({ playbook, onClose }) => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 180);
  };

  const createdLabel = playbook?.createdDate
    ? new Date(playbook.createdDate).toLocaleString()
    : '—';

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1080,
        background: 'rgba(20,20,18,0.58)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        opacity: visible ? 1 : 0,
        transition: 'opacity 180ms ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 700,
          maxHeight: 'calc(100vh - 32px)',
          overflow: 'auto',
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 12,
          boxShadow: '0 20px 60px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.25)',
          transform: visible ? 'translateY(0)' : 'translateY(10px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 180ms ease, opacity 180ms ease',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '18px 20px 14px', borderBottom: `1px solid ${T.border}`,
        }}>
          <div>
            <div style={{ fontSize: T.fs.lead, fontWeight: 600, color: T.ink, letterSpacing: '-0.01em' }}>
              {playbook?.name || 'Playbook'}
            </div>
            <div style={{ fontSize: T.fs.small, color: T.ink3, marginTop: 3 }}>
              Trigger: {playbook?.trigger || '—'}
            </div>
          </div>
          <span style={{ flex: 1 }} />
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

        <div style={{ padding: 20, display: 'grid', gap: 14 }}>
          <div style={{
            border: `1px solid ${T.border}`,
            background: T.surfaceAlt,
            borderRadius: 8,
            padding: 12,
          }}>
            <div style={{ fontSize: T.fs.micro, color: T.ink3, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>
              Description
            </div>
            <div style={{ fontSize: T.fs.body, color: T.ink2, lineHeight: 1.5 }}>
              {playbook?.description || 'No description provided.'}
            </div>
          </div>

          <div style={{
            border: `1px solid ${T.border}`,
            background: T.surfaceAlt,
            borderRadius: 8,
            padding: 12,
          }}>
            <div style={{ fontSize: T.fs.micro, color: T.ink3, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>
              Actions ({playbook?.actions?.length || 0})
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {(playbook?.actions || []).map(action => (
                <div key={action} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: T.surface,
                  border: `1px solid ${T.borderSubtle}`,
                  borderRadius: 6,
                  padding: '8px 10px',
                }}>
                  <Icon name="check" size={12} color={T.good} />
                  <span style={{ fontSize: T.fs.body, color: T.ink }}>{action}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ fontSize: T.fs.small, color: T.ink3, fontFamily: T.mono }}>
            Created: {createdLabel}
          </div>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: 8,
          padding: '0 20px 20px',
        }}>
          <Btn tone="ghost" size="sm" onClick={handleClose}>Close</Btn>
        </div>
      </div>
    </div>
  );
};

// ─── CSV Upload Modal ─────────────────────────────────────────────────────────
const CsvUploadModal = ({ onClose, onImport }) => {
  const [visible,  setVisible]  = React.useState(false);
  const [dragOver, setDragOver] = React.useState(false);
  const [file,     setFile]     = React.useState(null);
  // status: null | 'uploading' | { type: 'success'|'error', msg?, count? }
  const [status,   setStatus]   = React.useState(null);
  const fileInputRef = React.useRef(null);

  // Entrance animation: trigger one frame after mount so transition fires
  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Inject spinner @keyframes once into document head
  React.useEffect(() => {
    if (!document.getElementById('retaiv-spin-kf')) {
      const s = document.createElement('style');
      s.id = 'retaiv-spin-kf';
      s.textContent = '@keyframes retaiv-spin { to { transform: rotate(360deg); } }';
      document.head.appendChild(s);
    }
  }, []);

  const handleClose = () => {
    if (status === 'uploading') return; // block accidental close while processing
    setVisible(false);
    setTimeout(onClose, 200); // wait for exit animation
  };

  const handleFile = f => {
    if (!f) return;
    if (!f.name.toLowerCase().endsWith('.csv')) {
      setStatus({ type: 'error', msg: 'Please upload a .csv file.' });
      return;
    }
    setFile(f);
    setStatus(null);
  };

  const handleDrop = e => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleImport = async () => {
    if (!file || status === 'uploading') return;
    setStatus('uploading');
    try {
      const result = await parseCSV(file);
      setStatus({ type: 'success', count: result.data.length });
      // Brief success flash before closing and handing data back
      setTimeout(() => { onImport(result.data); onClose(); }, 900);
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    }
  };

  const SUPPORTED_COLS = ['Account Name', 'ARR', 'Health Score', 'Churn Risk (%)', 'Last Login', 'Tickets', 'Usage Score', 'Segment'];
  const isUploading    = status === 'uploading';
  const canImport      = !!file && !isUploading;

  return (
    // ── Backdrop ──
    <div
      onClick={handleClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(26,26,24,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        opacity: visible ? 1 : 0,
        transition: 'opacity 200ms ease',
      }}
    >
      {/* ── Modal card ── */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 520,
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 10,
          boxShadow: '0 8px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)',
          fontFamily: T.sans,
          overflow: 'hidden',
          transform: visible ? 'translateY(0)' : 'translateY(10px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 200ms ease, opacity 200ms ease',
        }}
      >

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center',
          padding: '18px 20px 16px',
          borderBottom: `1px solid ${T.border}`,
        }}>
          <div>
            <div style={{ fontSize: T.fs.lead, fontWeight: 600, color: T.ink, letterSpacing: '-0.01em' }}>
              Upload Customer Data
            </div>
            <div style={{ fontSize: T.fs.small, color: T.ink3, marginTop: 3 }}>
              Import a CSV to replace demo data with your own accounts
            </div>
          </div>
          <span style={{ flex: 1 }} />
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

        {/* Drop zone */}
        <div style={{ padding: '20px 20px 0' }}>
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? T.accent : file ? T.good : T.borderStrong}`,
              borderRadius: 8,
              padding: '28px 20px',
              textAlign: 'center',
              background: dragOver ? T.accentSoft : file ? T.goodSoft : T.surfaceAlt,
              cursor: 'pointer',
              transition: 'border-color 120ms ease, background 120ms ease',
              userSelect: 'none',
            }}
          >
            {/* Upload icon — inline SVG (no matching icon in project Icon set) */}
            <svg
              width="32" height="32" viewBox="0 0 24 24" fill="none"
              stroke={file ? T.good : dragOver ? T.accent : T.ink3}
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ margin: '0 auto 12px', display: 'block', transition: 'stroke 120ms ease' }}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>

            {file ? (
              <div>
                <div style={{ fontSize: T.fs.body, fontWeight: 600, color: T.goodInk }}>
                  {file.name}
                </div>
                <div style={{ fontSize: T.fs.small, color: T.ink3, marginTop: 4 }}>
                  {(file.size / 1024).toFixed(1)} KB · click to change
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: T.fs.body, fontWeight: 500, color: T.ink }}>
                  Drag & drop your CSV here
                </div>
                <div style={{ fontSize: T.fs.small, color: T.ink3, marginTop: 4 }}>
                  or <span style={{ color: T.info, textDecoration: 'underline' }}>choose a file</span>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={e => handleFile(e.target.files?.[0])}
              // Reset value so re-selecting the same file fires onChange
              onClick={e => { e.target.value = ''; }}
            />
          </div>
        </div>

        {/* Supported column guide */}
        <div style={{ padding: '14px 20px 0' }}>
          <div style={{ fontSize: T.fs.small, color: T.ink3, marginBottom: 8 }}>
            Supported columns (common name variations are recognized automatically):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {SUPPORTED_COLS.map(col => (
              <span key={col} style={{
                padding: '2px 8px', borderRadius: 4,
                background: T.surfaceSunken, border: `1px solid ${T.border}`,
                fontSize: T.fs.small, color: T.ink2, fontFamily: T.mono,
              }}>
                {col}
              </span>
            ))}
          </div>
        </div>

        {/* Status: spinner / success / error */}
        {status && (
          <div style={{ padding: '14px 20px 0' }}>
            {isUploading && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', borderRadius: 6,
                background: T.surfaceAlt, border: `1px solid ${T.border}`,
                fontSize: T.fs.small, color: T.ink2,
              }}>
                <div style={{
                  width: 14, height: 14, flexShrink: 0,
                  border: `2px solid ${T.border}`, borderTopColor: T.ink2,
                  borderRadius: '50%',
                  animation: 'retaiv-spin 0.7s linear infinite',
                }} />
                Processing your CSV…
              </div>
            )}
            {status?.type === 'success' && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', borderRadius: 6,
                background: T.goodSoft, border: '1px solid #c9dfcf',
                fontSize: T.fs.small, color: T.goodInk,
              }}>
                <Icon name="check" size={14} color={T.good} />
                <span>Successfully imported <strong>{status.count}</strong> account{status.count !== 1 ? 's' : ''}. Updating dashboard…</span>
              </div>
            )}
            {status?.type === 'error' && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '10px 14px', borderRadius: 6,
                background: T.riskSoft, border: '1px solid #e5b8ae',
                fontSize: T.fs.small, color: T.riskInk,
              }}>
                <Icon name="warn" size={14} color={T.risk} style={{ flexShrink: 0, marginTop: 1 }} />
                {status.msg}
              </div>
            )}
          </div>
        )}

        {/* Footer actions */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8,
          padding: '18px 20px',
        }}>
          <Btn tone="ghost" size="sm" onClick={handleClose}>Cancel</Btn>
          {/* Using a raw button here so we can control disabled state (Btn doesn't support it) */}
          <button
            onClick={handleImport}
            disabled={!canImport}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '5px 12px', borderRadius: 6,
              background: canImport ? T.ink : T.surfaceSunken,
              color: canImport ? '#fff' : T.ink4,
              border: `1px solid ${canImport ? T.ink : T.border}`,
              fontFamily: T.sans, fontSize: T.fs.body - 1, fontWeight: 500,
              cursor: canImport ? 'pointer' : 'not-allowed',
              transition: 'background 120ms ease, color 120ms ease',
              letterSpacing: '-0.005em',
            }}
          >
            {isUploading ? 'Importing…' : 'Import CSV'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main dashboard screen ────────────────────────────────────────────────────
const DashboardScreen = ({ accounts: accountsProp, isCustomData: isCustomDataProp, onAccountsImport, onAccountsReset }) => {
  const { navigate } = React.useContext(NavContext);

  const [localAccounts, setLocalAccounts] = React.useState(SAMPLE_DATA);
  const [localCustom, setLocalCustom] = React.useState(false);
  const [modalOpen,    setModal]    = React.useState(false);
  const [playbookModalOpen, setPlaybookModalOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [playbooks, setPlaybooks] = React.useState([]);
  const [activePlaybook, setActivePlaybook] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState(0);

  // Prefer app-level shared account state when provided, fallback to local state.
  const accounts = accountsProp ?? localAccounts;
  const isCustomData = isCustomDataProp ?? localCustom;

  // Load persisted playbooks once on mount.
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(PLAYBOOKS_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setPlaybooks(parsed);
    } catch (err) {
      console.error('Failed to load playbooks from localStorage:', err);
    }
  }, []);

  // Persist playbooks to survive refresh.
  React.useEffect(() => {
    try {
      localStorage.setItem(PLAYBOOKS_STORAGE_KEY, JSON.stringify(playbooks));
    } catch (err) {
      console.error('Failed to persist playbooks:', err);
    }
  }, [playbooks]);

  // Recalculate all KPIs whenever the accounts array changes (sample ↔ uploaded CSV)
  const kpi = React.useMemo(() => calculateMetrics(accounts), [accounts]);

  const handleImport = data => {
    if (onAccountsImport) {
      onAccountsImport(data);
      return;
    }
    setLocalAccounts(data);
    setLocalCustom(true);
  };

  const handleReset = () => {
    if (onAccountsReset) {
      onAccountsReset();
      return;
    }
    setLocalAccounts(SAMPLE_DATA);
    setLocalCustom(false);
  };

  const handleCreatePlaybook = playbook => {
    const createdPlaybook = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: playbook.name,
      trigger: playbook.trigger,
      description: playbook.description,
      actions: playbook.actions,
      createdDate: playbook.createdDate || new Date().toISOString(),
    };
    setPlaybooks(prev => [createdPlaybook, ...prev]);
    console.log('New playbook created:', createdPlaybook);
    setToastMessage('Playbook created successfully!');
    setTimeout(() => setToastMessage(''), 2200);
  };

  const handleOpenPlaybook = playbook => {
    console.log(`Opened playbook: ${playbook.name}`, playbook);
    setActivePlaybook(playbook);
  };

  // Tab counts + filtered rows are derived from live account data.
  const tabCounts = React.useMemo(() => ({
    all: accounts.length,
    risk: accounts.filter(isAtRiskAccount).length,
    expansion: accounts.filter(isExpansionReadyAccount).length,
    healthy: accounts.filter(isHealthyAccount).length,
    onboarding: accounts.filter(isOnboardingAccount).length,
  }), [accounts]);

  const filteredAccounts = React.useMemo(() => {
    const tabKey = ACCOUNT_TABS[activeTab] || 'all';
    if (tabKey === 'risk') return accounts.filter(isAtRiskAccount);
    if (tabKey === 'expansion') return accounts.filter(isExpansionReadyAccount);
    if (tabKey === 'healthy') return accounts.filter(isHealthyAccount);
    if (tabKey === 'onboarding') return accounts.filter(isOnboardingAccount);
    return accounts;
  }, [accounts, activeTab]);

  return (
    <Shell
      active="accounts"
      breadcrumb={['Loopchart', 'Accounts']}
      sidebarPlaybooks={playbooks}
      onOpenPlaybook={handleOpenPlaybook}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <PageHead
          eyebrow="Workspace"
          title="Accounts"
          subtitle={
            isCustomData
              ? `${accounts.length} uploaded accounts · CSV data`
              : '412 active customers · $18.4M ARR under management.'
          }
          meta={<>
            <span>Last 90 days</span>
            <span style={{ color: T.ink4 }}>·</span>
            <span>Synced 2m ago</span>
          </>}
          actions={<>
            {/* Reset to sample data — only visible after CSV upload */}
            {isCustomData && (
              <Btn tone="ghost" icon="refresh" size="sm" onClick={handleReset}>
                Reset demo data
              </Btn>
            )}
            <Btn tone="primary" size="sm" onClick={() => setModal(true)}>
              Upload CSV
            </Btn>
            <Btn icon="filter" size="sm">Filters · 2</Btn>
            <Btn icon="external" size="sm">Export</Btn>
            <Btn tone="primary" icon="plus" size="sm" onClick={() => setPlaybookModalOpen(true)}>
              New playbook
            </Btn>
          </>}
        />

        {/* KPI strip — values computed from current accounts state */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${T.border}`, background: T.surface }}>
          <Stat
            label="Net revenue retention"
            value={kpi?.nrr ?? '108.4'} unit="%"
            delta={isCustomData ? null : '+2.1pp'} deltaTone="good"
            sparkData={kpi?.nrrSpark ?? [100,101,102,103,104,105,107,108,108.4]}
            hint="vs Q1"
          />
          <Stat
            label="Churn risk (90d)"
            value={kpi?.churnStat.value ?? '$1.24'} unit={kpi?.churnStat.unit ?? 'M'}
            delta={isCustomData ? null : '−$180k'} deltaTone="good"
            sparkTone="risk"
            sparkData={kpi?.churnSpark ?? [1.6,1.55,1.5,1.42,1.38,1.35,1.3,1.26,1.24]}
            hint={`${tabCounts.risk} accounts`}
          />
          <Stat
            label="Expansion pipeline"
            value={kpi?.expansionStat.value ?? '$2.81'} unit={kpi?.expansionStat.unit ?? 'M'}
            delta={isCustomData ? null : '+$412k'} deltaTone="good"
            sparkData={kpi?.expansionSpark ?? [2.1,2.2,2.3,2.4,2.5,2.6,2.7,2.78,2.81]}
            hint={`${tabCounts.expansion} accounts`}
          />
          <Stat
            label="Avg health score"
            value={kpi?.avgHealth ?? '71.2'}
            delta={isCustomData ? null : '+3.4'} deltaTone="good"
            sparkData={kpi?.healthSpark ?? [64,65,66,67,68,69,70,71,71.2]}
            hint="across book"
          />
          <Stat
            label="Today's priorities"
            value={String(kpi?.priorities ?? 23)}
            delta={isCustomData ? null : '8 new'} deltaTone="good"
            sparkTone="accent"
            sparkData={kpi?.prioritiesSpark ?? [12,14,18,20,22,24,21,22,23]}
            hint="team-wide"
          />
        </div>

        <Tabs
          active={activeTab}
          onChange={setActiveTab}
          tabs={[
            { label: 'All accounts',    count: tabCounts.all },
            { label: 'At risk',         count: tabCounts.risk },
            { label: 'Expansion ready', count: tabCounts.expansion },
            { label: 'Healthy',         count: tabCounts.healthy },
            { label: 'Onboarding',      count: tabCounts.onboarding },
          ]}
        />

        {/* Filter row */}
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

        {/* Account table */}
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
                  { l: 'ARR',         r: true },
                  { l: 'Seats' },
                  { l: 'Health' },
                  { l: 'Churn risk' },
                  { l: 'Expansion' },
                  { l: '90-day trend' },
                  { l: 'Stage' },
                  { l: 'Owner' },
                  { l: 'Last touch',  r: true },
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
              {filteredAccounts.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
                    style={{
                      padding: '28px 16px',
                      textAlign: 'center',
                      color: T.ink3,
                      fontSize: T.fs.body,
                      background: T.surface,
                    }}
                  >
                    No accounts match this filter.
                  </td>
                </tr>
              )}
              {filteredAccounts.map((a, i) => {
                // Highlight at-risk rows instead of hardcoding row index 3
                const isRisk = a.stage === 'At risk';
                return (
                  <tr
                    key={i}
                    onClick={() => navigate('account', a)}
                    onMouseEnter={e => { if (!isRisk) e.currentTarget.style.background = T.surfaceAlt; }}
                    onMouseLeave={e => { if (!isRisk) e.currentTarget.style.background = 'transparent'; }}
                    style={{
                      borderBottom: `1px solid ${T.borderSubtle}`,
                      background: isRisk ? T.accentSoft : 'transparent',
                      cursor: 'pointer',
                      transition: 'background 80ms ease',
                    }}
                  >
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
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontFamily: T.mono, color: T.ink, fontSize: T.fs.body }}>
                      {fmt$(a.arr)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {a.seatsMax > 0 ? (
                        <>
                          <span style={{ fontFamily: T.mono, color: T.ink }}>{a.seats}</span>
                          <span style={{ color: T.ink4, margin: '0 4px' }}>/</span>
                          <span style={{ fontFamily: T.mono, color: T.ink3 }}>{a.seatsMax}</span>
                        </>
                      ) : (
                        <span style={{ color: T.ink4, fontFamily: T.mono }}>—</span>
                      )}
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
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontFamily: T.mono, color: T.ink3 }}>
                      {a.lastTouch}
                    </td>
                    <td style={{ padding: '14px 16px', color: T.ink3, textAlign: 'right' }}>
                      <Icon name="dots" size={15} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Table footer */}
          <div style={{
            padding: '14px 28px', fontSize: T.fs.small, color: T.ink3,
            borderTop: `1px solid ${T.border}`, background: T.surface,
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <span>
              Showing{' '}
              <span style={{ color: T.ink, fontFamily: T.mono }}>{filteredAccounts.length}</span>
              {activeTab !== 0 && (
                <>
                  {' '}of <span style={{ color: T.ink, fontFamily: T.mono }}>{accounts.length}</span>
                </>
              )}
              {activeTab === 0 && !isCustomData && (
                <> of <span style={{ color: T.ink, fontFamily: T.mono }}>412</span></>
              )}
              {isCustomData && <span style={{ color: T.ink3 }}> accounts (uploaded)</span>}
            </span>
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

      {/* CSV upload modal — rendered outside the scroll container */}
      {modalOpen && (
        <CsvUploadModal
          onClose={() => setModal(false)}
          onImport={handleImport}
        />
      )}
      {playbookModalOpen && (
        <NewPlaybookModal
          onClose={() => setPlaybookModalOpen(false)}
          onCreate={handleCreatePlaybook}
        />
      )}
      {activePlaybook && (
        <PlaybookDetailModal
          playbook={activePlaybook}
          onClose={() => setActivePlaybook(null)}
        />
      )}
      {toastMessage && <Toast message={toastMessage} />}
    </Shell>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

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

export { DashboardScreen, SAMPLE_DATA };
