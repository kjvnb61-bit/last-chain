import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BackgroundEffects } from './components/BackgroundEffects';
import { CustomCursor } from './components/CustomCursor';
import { AuthScreen } from './components/AuthScreen';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './views/DashboardView';
import { MissionsView } from './views/MissionsView';
import { ReferralsView } from './views/ReferralsView';
import { useWeb3Wallet } from './hooks/useWeb3Wallet';

function AppContent() {
  const { user, loading } = useAuth();
  const { handleWalletClick } = useWeb3Wallet();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#00ffcc] text-xl" style={{ fontFamily: 'Syncopate, sans-serif' }}>
          LOADING...
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <>
      <Sidebar
        isOpen={sidebarOpen}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onClose={() => setSidebarOpen(false)}
      />

      <div>
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onWalletClick={handleWalletClick}
        />

        <main className="px-[60px] py-5 pb-[60px] max-w-[1400px] mx-auto">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'missions' && <MissionsView />}
          {activeTab === 'referrals' && <ReferralsView />}
        </main>
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BackgroundEffects />
      <CustomCursor />
      <AppContent />
    </AuthProvider>
  );
}

export default App;
