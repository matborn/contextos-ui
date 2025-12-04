

import React, { useState } from 'react';
import { AppId, User, AuthView, ContextView } from './types';
import { ToastProvider } from './components/ui/Toast';
import { Launcher } from './pages/Launcher';
import { ContextOS } from './apps/ContextOS';
import { LifeOS } from './apps/LifeOS';
import { AppBuilder } from './apps/AppBuilder';
import { Scriptor } from './apps/Scriptor';
import { Muse } from './apps/Muse';
import { Projects } from './apps/Projects';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ProfilePage } from './pages/auth/ProfilePage';
import { Button } from './components/ui/Button';
import { ChevronLeft } from './components/icons/Icons';

const App: React.FC = () => {
  // Global State
  const [user, setUser] = useState<User | null>(null);
  
  // Navigation State
  const [activeApp, setActiveApp] = useState<AppId>('launcher');
  const [initialRoute, setInitialRoute] = useState<string | undefined>(undefined);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Auth Handlers
  const handleLoginSuccess = (loggedInUser: User) => {
      setUser(loggedInUser);
      setAuthView('login'); // Reset for next time
      setActiveApp('launcher');
  };

  const handleLogout = () => {
      setUser(null);
      setIsProfileOpen(false);
      setActiveApp('launcher');
      setAuthView('login');
  };

  const handleLaunch = (appId: AppId, route?: string) => {
      setInitialRoute(route);
      setActiveApp(appId);
  };

  const handleExitApp = () => {
      setActiveApp('launcher');
      setInitialRoute(undefined);
  };

  const renderContent = () => {
      // 1. Authenticated Flow
      if (user) {
          // Profile Overlay/Page
          if (isProfileOpen) {
              return (
                <div className="relative">
                    <button 
                        onClick={() => setIsProfileOpen(false)} 
                        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full border border-slate-200 shadow-sm transition-all"
                    >
                        <ChevronLeft size={16}/> Back
                    </button>
                    <ProfilePage 
                        user={user} 
                        onUpdateUser={setUser} 
                        onNavigate={() => {}} 
                        onLogout={handleLogout} 
                    />
                </div>
              );
          }

          // Main App Routing
          switch (activeApp) {
            case 'context-os':
                return <ContextOS onExit={handleExitApp} onLaunch={(id) => handleLaunch(id as AppId)} initialView={initialRoute as ContextView} />;
            case 'life-os':
                return <LifeOS onExit={handleExitApp} onLaunch={(id) => handleLaunch(id as AppId)} />;
            case 'ai-builder':
                return <AppBuilder onExit={handleExitApp} onLaunch={(id) => handleLaunch(id as AppId)} />;
            case 'scriptor':
                return <Scriptor onExit={handleExitApp} onLaunch={(id) => handleLaunch(id as AppId)} />;
            case 'muse':
                return <Muse onExit={handleExitApp} onLaunch={(id) => handleLaunch(id as AppId)} />;
            case 'projects':
                return <Projects onExit={handleExitApp} onLaunch={(id) => handleLaunch(id as AppId)} />;
            default:
                return (
                    <Launcher 
                        onLaunch={handleLaunch} 
                        user={user}
                        onOpenProfile={() => setIsProfileOpen(true)}
                    />
                );
          }
      }

      // 2. Unauthenticated Flow
      switch (authView) {
          case 'register':
              return <RegisterPage onLoginSuccess={handleLoginSuccess} onNavigate={setAuthView} />;
          case 'forgot-password':
              return <ForgotPasswordPage onNavigate={setAuthView} />;
          case 'login':
          default:
              return <LoginPage onLoginSuccess={handleLoginSuccess} onNavigate={setAuthView} />;
      }
  };

  return (
    <ToastProvider>
        {renderContent()}
    </ToastProvider>
  );
};

export default App;