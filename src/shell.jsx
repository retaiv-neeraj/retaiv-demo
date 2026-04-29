import React from 'react';
import { T } from './tokens.js';
import { Dot, Spark, RetaivMark, Kbd, Icon } from './ui.jsx';

const NavContext = React.createContext({ navigate: () => {} });
export { NavContext };


// Retaiv v2 app chrome — more breathing room, tighter hierarchy

const TopBar = ({ breadcrumb }) => (
  <div style={{
    height: 48, background: T.surface, borderBottom: `1px solid ${T.border}`,
    display: 'flex', alignItems: 'stretch', fontFamily: T.sans, flexShrink: 0,
  }}>
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 16, padding: '0 16px', minWidth: 0 }}>
      <div style={{
        height: 30, width: 320, flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 12px', borderRadius: 6,
        border: `1px solid ${T.border}`, background: T.surfaceAlt,
      }}>
        <Icon name="search" size={13} color={T.ink3} />
        <span style={{ flex: 1, fontSize: T.fs.body, color: T.ink3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Search accounts, contacts…</span>
        <Kbd>⌘K</Kbd>
      </div>
      <div style={{ flex: 1 }} />
      {breadcrumb && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: T.fs.body, color: T.ink3, whiteSpace: 'nowrap', overflow: 'hidden' }}>
          {breadcrumb.map((b, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ color: T.ink4 }}>/</span>}
              <span style={{ color: i === breadcrumb.length - 1 ? T.ink : T.ink3 }}>{b}</span>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '0 12px' }}>
      <ChromeBtn icon="refresh" />
      <ChromeBtn icon="bell" badge />
      <ChromeBtn icon="settings" />
      <div style={{ width: 1, background: T.border, margin: '10px 8px' }} />
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: '#2c5e8a', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: T.fs.small, fontWeight: 600,
      }}>MK</div>
    </div>
  </div>
);

const ChromeBtn = ({ icon, badge }) => (
  <button style={{
    width: 30, height: 30, border: 'none', background: 'transparent',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 5, cursor: 'pointer', color: T.ink2, position: 'relative',
  }}>
    <Icon name={icon} size={15} />
    {badge && <span style={{
      position: 'absolute', top: 6, right: 6, width: 6, height: 6,
      borderRadius: '50%', background: T.accent, border: `1.5px solid ${T.surface}`,
    }} />}
  </button>
);

const SideBar = ({ active, onNavigate, playbooks = [], onOpenPlaybook }) => {
  const [playbooksOpen, setPlaybooksOpen] = React.useState(true);
  const nav = [
    { group: 'Workspace', items: [
      { id: 'home', label: 'Home', icon: 'home' },
      { id: 'priority', label: 'Priority queue', icon: 'list', badge: '23' },
      { id: 'accounts', label: 'Accounts', icon: 'grid', badge: '412' },
    ]},
    { group: 'Signals', items: [
      { id: 'churn', label: 'Churn risk', icon: 'warn' },
      { id: 'expansion', label: 'Expansion', icon: 'trend' },
      { id: 'health', label: 'Health trends', icon: 'chart' },
    ]},
    { group: 'Execution', items: [
      { id: 'playbooks', label: 'Playbooks', icon: 'list' },
      { id: 'templates', label: 'Templates', icon: 'mail' },
      { id: 'integrations', label: 'Integrations', icon: 'link' },
    ]},
  ];
  return (
    <div style={{
      width: 224, flexShrink: 0, background: T.surfaceAlt,
      borderRight: `1px solid ${T.border}`,
      display: 'flex', flexDirection: 'column', fontFamily: T.sans,
    }}>
      <div style={{
        height: 48, display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 16px', borderBottom: `1px solid ${T.border}`,
      }}>
        <RetaivMark size={20} />
        <span style={{ fontSize: T.fs.lead - 2, fontWeight: 600, letterSpacing: '-0.01em' }}>Retaiv</span>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: T.fs.micro, color: T.ink3, fontFamily: T.mono }}>v2.4</span>
      </div>
      <div style={{ padding: '10px 10px', borderBottom: `1px solid ${T.border}` }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
          borderRadius: 6, background: T.surface, border: `1px solid ${T.border}`,
        }}>
          <div style={{
            width: 18, height: 18, borderRadius: 4, background: '#2c5e8a',
            color: '#fff', fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>LP</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: T.fs.body - 1, fontWeight: 500, color: T.ink }}>Loopchart</div>
            <div style={{ fontSize: T.fs.micro, color: T.ink3, marginTop: 1 }}>Enterprise · 18 seats</div>
          </div>
          <Icon name="chevronDown" size={11} color={T.ink3} />
        </div>
      </div>
      <div style={{ flex: 1, padding: '14px 6px', overflow: 'auto' }}>
        {nav.map((g, gi) => (
          <div key={gi} style={{ marginBottom: 18 }}>
            <div style={{
              fontSize: T.fs.micro, fontWeight: 600, color: T.ink3, letterSpacing: '0.08em',
              textTransform: 'uppercase', padding: '0 12px 8px',
            }}>{g.group}</div>
            {g.items.map(it => {
              const on = active === it.id;
              return (
                <React.Fragment key={it.id}>
                  <div
                    onClick={() => {
                      if (it.id === 'playbooks') {
                        setPlaybooksOpen(v => !v);
                      }
                      if (onNavigate) onNavigate(it.id);
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '7px 12px', margin: '1px 4px', borderRadius: 5,
                      background: on ? T.surface : 'transparent',
                      boxShadow: on ? `inset 0 0 0 1px ${T.border}` : 'none',
                      color: on ? T.ink : T.ink2, cursor: 'pointer',
                      fontSize: T.fs.body, fontWeight: on ? 500 : 400,
                    }}
                  >
                    <Icon name={it.icon} size={14} color={on ? T.ink : T.ink3} />
                    <span style={{ flex: 1 }}>{it.label}</span>
                    {it.id === 'playbooks' && (
                      <span style={{ fontSize: T.fs.micro, color: T.ink3, fontFamily: T.mono }}>
                        {playbooks.length}
                      </span>
                    )}
                    {it.badge && (
                      <span style={{ fontSize: T.fs.micro, color: T.ink3, fontFamily: T.mono }}>{it.badge}</span>
                    )}
                    {it.id === 'playbooks' && (
                      <Icon name="chevronDown" size={11} color={T.ink3} />
                    )}
                  </div>
                  {it.id === 'playbooks' && playbooksOpen && (
                    <div style={{ margin: '2px 4px 6px 24px' }}>
                      {playbooks.length === 0 ? (
                        <div style={{
                          fontSize: T.fs.small, color: T.ink4,
                          padding: '8px 10px', borderRadius: 5,
                          background: T.surface, border: `1px solid ${T.borderSubtle}`,
                        }}>
                          No playbooks yet
                        </div>
                      ) : (
                        playbooks.map(pb => (
                          <div
                            key={pb.id}
                            onClick={() => onOpenPlaybook && onOpenPlaybook(pb)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 8,
                              padding: '8px 10px', marginBottom: 4, borderRadius: 5,
                              background: T.surface, border: `1px solid ${T.borderSubtle}`,
                              cursor: 'pointer',
                            }}
                          >
                            <Icon name="list" size={12} color={T.ink3} />
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{
                                fontSize: T.fs.small, color: T.ink, fontWeight: 500,
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                              }}>
                                {pb.name}
                              </div>
                              <div style={{
                                fontSize: T.fs.micro, color: T.ink3,
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                marginTop: 1,
                              }}>
                                {pb.trigger}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{
        padding: '12px 16px', borderTop: `1px solid ${T.border}`,
        fontSize: T.fs.small, color: T.ink3, display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <Dot tone="good" size={6} />
        <span>Signals synced 2m ago</span>
      </div>
    </div>
  );
};

const Shell = ({ active, breadcrumb, onNavigate, sidebarPlaybooks, onOpenPlaybook, children }) => {
  const ctx = React.useContext(NavContext);
  const nav = onNavigate || ctx.navigate;
  return (
  <div style={{
    display: 'flex', height: '100%', width: '100%',
    background: T.surface, color: T.ink, fontFamily: T.sans, fontSize: T.fs.body,
  }}>
    <SideBar
      active={active}
      onNavigate={nav}
      playbooks={sidebarPlaybooks}
      onOpenPlaybook={onOpenPlaybook}
    />
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
      <TopBar breadcrumb={breadcrumb} />
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>{children}</div>
    </div>
  </div>
  );
};

// PageHead — bigger title, more top/bottom padding, no more small sub
const PageHead = ({ title, eyebrow, subtitle, meta, actions }) => (
  <div style={{
    padding: '24px 28px 20px', borderBottom: `1px solid ${T.border}`,
    display: 'flex', alignItems: 'flex-end', gap: 24, background: T.surface,
    flexWrap: 'wrap',
  }}>
    <div style={{ flex: '1 1 340px', minWidth: 280 }}>
      {eyebrow && (
        <div style={{
          fontSize: T.fs.micro, color: T.ink3, letterSpacing: '0.08em',
          textTransform: 'uppercase', fontWeight: 600, marginBottom: 6,
        }}>{eyebrow}</div>
      )}
      <div style={{
        fontSize: T.fs.title, fontWeight: 600, letterSpacing: '-0.02em',
        color: T.ink, lineHeight: 1.1,
      }}>{title}</div>
      {subtitle && (
        <div style={{
          fontSize: T.fs.body, color: T.ink3, marginTop: 6, lineHeight: 1.5,
        }}>{subtitle}</div>
      )}
    </div>
    {meta && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: T.fs.small, color: T.ink3 }}>
        {meta}
      </div>
    )}
    {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
  </div>
);

const Btn = ({ tone = 'ghost', icon, children, onClick, size = 'md' }) => {
  const [hovered, setHovered] = React.useState(false);
  const pad = size === 'sm' ? '5px 10px' : '7px 14px';
  const fs = size === 'sm' ? T.fs.body - 1 : T.fs.body;
  const styles = {
    primary: { bg: T.ink, fg: '#fff', bd: T.ink },
    accent:  { bg: T.accent, fg: '#fff', bd: T.accent },
    ghost:   { bg: T.surface, fg: T.ink, bd: T.border },
    subtle:  { bg: 'transparent', fg: T.ink2, bd: 'transparent' },
  };
  const shadows = {
    primary: '0 4px 12px rgba(26,26,24,0.28)',
    accent:  '0 4px 12px rgba(216,72,46,0.30)',
    ghost:   '0 4px 10px rgba(26,26,24,0.10)',
    subtle:  '0 2px 8px rgba(26,26,24,0.08)',
  };
  const s = styles[tone];
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        padding: pad, borderRadius: 6, cursor: 'pointer',
        background: s.bg, color: s.fg, border: `1px solid ${s.bd}`,
        fontFamily: T.sans, fontSize: fs, fontWeight: 500, letterSpacing: '-0.005em',
        transition: 'transform 150ms ease, box-shadow 150ms ease, opacity 150ms ease',
        transform: hovered ? 'scale(1.03)' : 'scale(1)',
        boxShadow: hovered ? shadows[tone] : 'none',
        opacity: hovered && tone === 'subtle' ? 0.75 : 1,
      }}
    >
      {icon && <Icon name={icon} size={13} />}
      {children}
    </button>
  );
};

const Tabs = ({ tabs, active, onChange }) => (
  <div style={{
    display: 'flex', alignItems: 'stretch',
    borderBottom: `1px solid ${T.border}`, background: T.surface,
    padding: '0 28px',
  }}>
    {tabs.map((t, i) => {
      const on = i === active;
      return (
        <div
          key={i}
          onClick={() => onChange && onChange(i)}
          style={{
            padding: '12px 16px', fontSize: T.fs.body, fontWeight: on ? 600 : 400,
            color: on ? T.ink : T.ink2, cursor: 'pointer',
            borderBottom: `2px solid ${on ? T.ink : 'transparent'}`,
            marginBottom: -1, display: 'flex', alignItems: 'center', gap: 8,
            letterSpacing: '-0.005em',
          }}
        >
          {t.label}
          {t.count != null && (
            <span style={{ fontSize: T.fs.small, color: on ? T.ink2 : T.ink3, fontFamily: T.mono }}>
              {t.count}
            </span>
          )}
        </div>
      );
    })}
  </div>
);

// Stat — bigger numbers, more air
const Stat = ({ label, value, unit, delta, deltaTone = 'good', sparkData, sparkTone, hint }) => (
  <div style={{
    flex: 1, padding: '18px 20px', background: T.surface,
    borderRight: `1px solid ${T.border}`, minWidth: 160,
    display: 'flex', flexDirection: 'column', gap: 10,
  }}>
    <div style={{
      fontSize: T.fs.micro, color: T.ink3, letterSpacing: '0.06em',
      textTransform: 'uppercase', fontWeight: 600,
      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    }}>{label}</div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, justifyContent: 'space-between', flexWrap: 'nowrap' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, whiteSpace: 'nowrap', minWidth: 0 }}>
        <span style={{
          fontFamily: T.mono, fontSize: T.fs.hero, fontWeight: 500,
          color: T.ink, letterSpacing: '-0.03em', lineHeight: 1,
        }}>{value}</span>
        {unit && <span style={{ fontSize: T.fs.body, color: T.ink3, fontFamily: T.mono, whiteSpace: 'nowrap' }}>{unit}</span>}
      </div>
      {sparkData && <Spark data={sparkData} tone={sparkTone || deltaTone} fill width={60} height={24} />}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: T.fs.small, flexWrap: 'wrap' }}>
      {delta && (
        <span style={{
          color: deltaTone === 'good' ? T.good : deltaTone === 'risk' ? T.risk : T.ink3,
          fontFamily: T.mono, fontWeight: 500,
          display: 'inline-flex', alignItems: 'center', gap: 3,
        }}>
          <Icon name={deltaTone === 'risk' ? 'arrowDown' : 'arrowUp'} size={10} />
          {delta}
        </span>
      )}
      {hint && <span style={{ color: T.ink3 }}>{hint}</span>}
    </div>
  </div>
);

const Card = ({ title, subtitle, right, children, style, bodyPad = 0 }) => (
  <div style={{
    background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8,
    overflow: 'hidden', display: 'flex', flexDirection: 'column',
    ...style,
  }}>
    {title && (
      <div style={{
        padding: '14px 18px', borderBottom: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', gap: 10,
        background: T.surface,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: T.fs.body + 1, fontWeight: 600, color: T.ink, letterSpacing: '-0.005em' }}>{title}</div>
          {subtitle && <div style={{ fontSize: T.fs.small, color: T.ink3, marginTop: 3 }}>{subtitle}</div>}
        </div>
        {right}
      </div>
    )}
    <div style={{ padding: bodyPad, flex: 1, minHeight: 0 }}>{children}</div>
  </div>
);

// Section — area divider between major regions of a page (gives breathing room)
const Section = ({ children, pad = true, bg = T.surface }) => (
  <div style={{
    padding: pad ? '20px 28px' : 0, background: bg,
    borderBottom: `1px solid ${T.border}`,
  }}>{children}</div>
);

export { TopBar, SideBar, Shell, PageHead, Btn, Tabs, Stat, Card, ChromeBtn, Section };
