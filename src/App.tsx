/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import DashboardFree from './components/DashboardFree';
import DashboardPremium from './components/DashboardPremium';

type ViewType = 'landing' | 'auth' | 'free_dashboard' | 'premium_dashboard';

export default function App() {
  const [view, setView] = useState<ViewType>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [initialTierPreset, setInitialTierPreset] = useState<'free' | 'premium'>('free');
  
  const [user, setUser] = useState<{ id: string; username: string; email: string; tier: 'free' | 'premium' } | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Restore session from localStorage on load
  useEffect(() => {
    const savedToken = localStorage.getItem('localtrip_babel_token');
    const savedUserStr = localStorage.getItem('localtrip_babel_user');

    if (savedToken && savedUserStr) {
      try {
        const parsedUser = JSON.parse(savedUserStr);
        setUser(parsedUser);
        setToken(savedToken);
        setView(parsedUser.tier === 'premium' ? 'premium_dashboard' : 'free_dashboard');
      } catch (err) {
        // Clear corrupt data
        localStorage.removeItem('localtrip_babel_token');
        localStorage.removeItem('localtrip_babel_user');
      }
    }
  }, []);

  const handleNavigateToAuth = (mode: 'login' | 'register', presetTier: 'free' | 'premium' = 'free') => {
    setAuthMode(mode);
    setInitialTierPreset(presetTier);
    setView('auth');
  };

  const handleAuthSuccess = (newToken: string, newUser: { id: string; username: string; email: string; tier: 'free' | 'premium' }) => {
    setToken(newToken);
    setUser(newUser);
    
    // Persist session
    localStorage.setItem('localtrip_babel_token', newToken);
    localStorage.setItem('localtrip_babel_user', JSON.stringify(newUser));

    setView(newUser.tier === 'premium' ? 'premium_dashboard' : 'free_dashboard');
  };

  const handleUpgradeSuccess = (newToken: string, newUser: any) => {
    handleAuthSuccess(newToken, newUser);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('localtrip_babel_token');
    localStorage.removeItem('localtrip_babel_user');
    setView('landing');
  };

  // Allow anonymous check-out of free recommendations directly
  const handleExploreAnonymously = () => {
    // We navigate to a placeholder free preview sandbox
    // By simulating a mock guest profile so that no gating stops the demo!
    const guestUser = {
      id: 'guest_anonymous',
      username: 'Tamu Nusantara',
      email: 'guest@localtrip.app',
      tier: 'free' as const
    };
    setUser(guestUser);
    setToken('guest_token_mock');
    setView('free_dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500/20 selection:text-emerald-950 font-sans">
      {view === 'landing' && (
        <LandingPage 
          onNavigateToAuth={handleNavigateToAuth}
          onExploreAnonymously={handleExploreAnonymously}
        />
      )}

      {view === 'auth' && (
        <AuthPage 
          initialMode={authMode}
          initialTier={initialTierPreset}
          onAuthSuccess={handleAuthSuccess}
          onBackToLanding={() => setView('landing')}
        />
      )}

      {view === 'free_dashboard' && user && (
        <DashboardFree 
          user={user}
          token={token || ''}
          onLogout={handleLogout}
          onUpgradeSuccess={handleUpgradeSuccess}
        />
      )}

      {view === 'premium_dashboard' && user && (
        <DashboardPremium 
          user={user}
          token={token || ''}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
