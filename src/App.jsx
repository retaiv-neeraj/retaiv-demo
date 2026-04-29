import React, { useState } from 'react';
import { T } from './tokens.js';
import { RetaivMark } from './ui.jsx';
import { NavContext } from './shell.jsx';
import { HomeScreen } from './screen-home.jsx';
import { DashboardScreen, SAMPLE_DATA } from './screen-dashboard.jsx';
import { AccountDetailScreen } from './screen-account.jsx';
import { PriorityQueueScreen } from './screen-queue.jsx';
import { ChurnScreen } from './screen-churn.jsx';
import { ExpansionScreen } from './screen-expansion.jsx';

// ---------- Login screen (fake — any input lets you in) ----------

function Login({ onSignIn }) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (email && pw) onSignIn(email);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: T.bg, fontFamily: T.sans, color: T.ink, padding: 24,
    }}>
      <form onSubmit={submit} style={{
        width: 380, padding: '36px 32px', background: T.surface,
        border: `1px solid ${T.border}`, borderRadius: 10,
        boxShadow: '0 24px 64px -24px rgba(20,20,16,0.18)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <RetaivMark size={28} />
          <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.015em' }}>Retaiv</span>
        </div>
        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 6 }}>
          Sign in
        </div>
        <div style={{ fontSize: 13, color: T.ink3, marginBottom: 24 }}>
          Demo build — any email + password will sign you in.
        </div>

        <Field label="Work email" type="email" value={email} onChange={setEmail} placeholder="you@company.com" />
        <Field label="Password" type="password" value={pw} onChange={setPw} placeholder="••••••••" />

        <button type="submit" style={{
          width: '100%', marginTop: 8, padding: '10px 14px',
          background: T.ink, color: '#fff', border: 'none', borderRadius: 6,
          fontFamily: T.sans, fontSize: 13, fontWeight: 500, cursor: 'pointer',
          letterSpacing: '-0.005em',
        }}>
          Sign in →
        </button>

        <div style={{
          marginTop: 24, paddingTop: 20, borderTop: `1px solid ${T.border}`,
          fontSize: 11.5, color: T.ink3, textAlign: 'center', lineHeight: 1.6,
        }}>
          Loopchart workspace · v2.4 · 412 accounts<br />
          <span style={{ color: T.ink4 }}>Demo data, no real auth.</span>
        </div>
      </form>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder }) {
  return (
    <label style={{ display: 'block', marginBottom: 14 }}>
      <span style={{
        display: 'block', fontSize: 11, color: T.ink2, fontWeight: 500,
        marginBottom: 5, letterSpacing: '0.02em',
      }}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '8px 10px',
          border: `1px solid ${T.border}`, borderRadius: 5,
          background: T.surface, color: T.ink,
          fontFamily: T.sans, fontSize: 13,
          outline: 'none',
        }}
      />
    </label>
  );
}

// ---------- App with sidebar navigation ----------

const SCREENS = {
  accounts:  DashboardScreen,
  priority:  PriorityQueueScreen,
  churn:     ChurnScreen,
  expansion: ExpansionScreen,
  // Other sidebar items fall back to dashboard for the demo
  home:      HomeScreen,
  health:    DashboardScreen,
  playbooks: DashboardScreen,
  templates: DashboardScreen,
  integrations: DashboardScreen,
  // detail view, opened from row click
  account:   AccountDetailScreen,
};

export default function App() {
  const [user, setUser] = useState('demo');
  const [route, setRoute] = useState('home');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountsData, setAccountsData] = useState(SAMPLE_DATA);
  const [isCustomData, setIsCustomData] = useState(false);

  if (!user) return <Login onSignIn={setUser} />;

  const Screen = SCREENS[route] || DashboardScreen;

  return (
    <NavContext.Provider value={{
      navigate: (nextRoute, account) => {
        setRoute(nextRoute);
        if (account) setSelectedAccount(account);
      },
    }}>
      <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <Screen
          account={selectedAccount}
          accounts={accountsData}
          isCustomData={isCustomData}
          onAccountsImport={(data) => {
            setAccountsData(data);
            setIsCustomData(true);
          }}
          onAccountsReset={() => {
            setAccountsData(SAMPLE_DATA);
            setIsCustomData(false);
          }}
        />
      </div>
    </NavContext.Provider>
  );
}
