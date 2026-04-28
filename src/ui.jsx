import React from 'react';
import { T } from './tokens.js';

// Shared Retaiv UI primitives

const Pill = ({ tone = 'neutral', children, style }) => {
  const tones = {
    neutral: { bg: T.surfaceSunken, fg: T.ink2, bd: T.border },
    good:    { bg: T.goodSoft,    fg: T.goodInk, bd: '#c9dfcf' },
    warn:    { bg: T.warnSoft,    fg: T.warnInk, bd: '#e7d3a3' },
    risk:    { bg: T.riskSoft,    fg: T.riskInk, bd: '#e5b8ae' },
    info:    { bg: T.infoSoft,    fg: T.infoInk, bd: '#bed2e0' },
    accent:  { bg: T.accentSoft,  fg: T.accentInk, bd: '#f0c5ba' },
    ink:     { bg: T.ink,         fg: '#fff',    bd: T.ink },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 8px', borderRadius: 4,
      background: t.bg, color: t.fg, border: `1px solid ${t.bd}`,
      fontFamily: T.sans, fontSize: 11, fontWeight: 500,
      lineHeight: 1.45, letterSpacing: '0',
      ...style,
    }}>{children}</span>
  );
};

const Dot = ({ tone = 'good', size = 7 }) => {
  const tones = { good: T.good, warn: T.warn, risk: T.risk, info: T.info, neutral: T.ink3, accent: T.accent };
  return <span style={{
    width: size, height: size, borderRadius: '50%',
    background: tones[tone], display: 'inline-block', flexShrink: 0,
  }} />;
};

// Sparkline — low/high, polyline
const Spark = ({ data, width = 80, height = 22, tone = 'neutral', fill = false }) => {
  const tones = { good: T.good, warn: T.warn, risk: T.risk, info: T.info, neutral: T.ink3, accent: T.accent };
  const c = tones[tone] || T.ink3;
  const min = Math.min(...data), max = Math.max(...data);
  const rng = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (width - 2) + 1;
    const y = height - 2 - ((v - min) / rng) * (height - 4);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      {fill && (
        <polygon points={`1,${height-1} ${pts} ${width-1},${height-1}`} fill={c} opacity="0.12" />
      )}
      <polyline points={pts} fill="none" stroke={c} strokeWidth="1.4" />
    </svg>
  );
};

// Horizontal bar gauge 0-100
const ScoreBar = ({ value, tone, width = 54, height = 6 }) => {
  const tones = { good: T.good, warn: T.warn, risk: T.risk, accent: T.accent };
  const c = tones[tone] || T.ink3;
  return (
    <div style={{
      width, height, background: T.surfaceSunken, borderRadius: 2,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0,
        width: `${Math.max(2, Math.min(100, value))}%`, background: c,
      }} />
    </div>
  );
};

// Logo mark — just "R" in a rounded square
const RetaivMark = ({ size = 20 }) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.22,
    background: T.ink, color: '#fff',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: T.sans, fontWeight: 700, fontSize: size * 0.56,
    letterSpacing: '-0.04em', flexShrink: 0,
  }}>R</div>
);

// Keycap-style key
const Kbd = ({ children }) => (
  <span style={{
    fontFamily: T.mono, fontSize: 10,
    padding: '1px 5px', border: `1px solid ${T.border}`, borderBottomWidth: 2,
    borderRadius: 3, background: T.surface, color: T.ink2,
  }}>{children}</span>
);

// Column separator (vertical)
const VSep = ({ m = 12 }) => <div style={{ width: 1, alignSelf: 'stretch', background: T.border, margin: `0 ${m}px` }} />;

// Iconography — minimal, 14px, 1.4 stroke
const Icon = ({ name, size = 14, color = 'currentColor' }) => {
  const paths = {
    search: <><circle cx="6.5" cy="6.5" r="4.5"/><path d="M10 10l3 3"/></>,
    filter: <><path d="M2 3h12M4 8h8M6 13h4"/></>,
    plus: <><path d="M8 3v10M3 8h10"/></>,
    chevron: <><path d="M6 4l4 4-4 4"/></>,
    chevronDown: <><path d="M4 6l4 4 4-4"/></>,
    arrowUp: <><path d="M8 12V4M4 8l4-4 4 4"/></>,
    arrowDown: <><path d="M8 4v8M4 8l4 4 4-4"/></>,
    arrowRight: <><path d="M3 8h10M9 4l4 4-4 4"/></>,
    bell: <><path d="M4 11V7a4 4 0 018 0v4l1 2H3l1-2zM6.5 13.5a1.5 1.5 0 003 0"/></>,
    grid: <><rect x="2" y="2" width="5" height="5"/><rect x="9" y="2" width="5" height="5"/><rect x="2" y="9" width="5" height="5"/><rect x="9" y="9" width="5" height="5"/></>,
    user: <><circle cx="8" cy="6" r="2.5"/><path d="M3 14c0-2.5 2.2-4 5-4s5 1.5 5 4"/></>,
    mail: <><rect x="2" y="4" width="12" height="8" rx="1"/><path d="M2.5 5l5.5 4 5.5-4"/></>,
    home: <><path d="M3 7l5-4 5 4v6a1 1 0 01-1 1h-2v-4H6v4H4a1 1 0 01-1-1V7z"/></>,
    list: <><path d="M2 4h12M2 8h12M2 12h8"/></>,
    trend: <><path d="M2 12l4-4 3 3 5-5"/><path d="M10 6h4v4"/></>,
    chart: <><path d="M2 14h12M4 14V8M7 14V4M10 14V10M13 14V6"/></>,
    settings: <><circle cx="8" cy="8" r="2"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5L13 13M13 3l-1.5 1.5M4.5 11.5L3 13"/></>,
    dollar: <><path d="M8 2v12M11 5H6.5a2 2 0 000 4h3a2 2 0 010 4H5"/></>,
    zap: <><path d="M9 1L3 9h4l-1 6 6-8H8l1-6z"/></>,
    sparkles: <><path d="M5 2l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3zM12 8l.7 2 2 .7-2 .7L12 13.4l-.7-2-2-.7 2-.7.7-2z"/></>,
    link: <><path d="M7 9a3 3 0 000-4L5 3a3 3 0 00-4 4l1 1M9 7a3 3 0 000 4l2 2a3 3 0 004-4l-1-1"/></>,
    calendar: <><rect x="2" y="3" width="12" height="11" rx="1"/><path d="M2 6h12M5 1v3M11 1v3"/></>,
    check: <><path d="M3 8l3 3 7-7"/></>,
    x: <><path d="M4 4l8 8M12 4l-8 8"/></>,
    dots: <><circle cx="3.5" cy="8" r="1"/><circle cx="8" cy="8" r="1"/><circle cx="12.5" cy="8" r="1"/></>,
    external: <><path d="M10 2h4v4M14 2L7 9M12 9v4a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4"/></>,
    flag: <><path d="M3 14V2M3 3h9l-2 3 2 3H3"/></>,
    warn: <><path d="M8 1l7 13H1L8 1zM8 6v4M8 12v.5"/></>,
    fire: <><path d="M8 1s3 3 3 6a3 3 0 01-6 0c0-1 .5-2 .5-2S4 7 4 10a4 4 0 008 0c0-4-4-5-4-9z"/></>,
    target: <><circle cx="8" cy="8" r="6"/><circle cx="8" cy="8" r="3"/><circle cx="8" cy="8" r="0.5" fill={color}/></>,
    refresh: <><path d="M14 2v4h-4M2 14v-4h4"/><path d="M13 10a5.5 5.5 0 01-10 1M3 6a5.5 5.5 0 0110-1"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
      stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, display: 'block' }}>
      {paths[name]}
    </svg>
  );
};

export { Pill, Dot, Spark, ScoreBar, RetaivMark, Kbd, VSep, Icon };
