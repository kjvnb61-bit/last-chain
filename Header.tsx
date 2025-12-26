import { useAuth } from '../contexts/AuthContext';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  onWalletClick: () => void;
}

export function Header({ onMenuClick, onWalletClick }: HeaderProps) {
  const { profile } = useAuth();

  const getPageTitle = () => {
    return 'DASHBOARD';
  };

  return (
    <header className="flex items-center px-[60px] py-10 bg-transparent z-[1000]">
      <button
        onClick={onMenuClick}
        className="border border-[rgba(255,255,255,0.1)] px-5 py-2.5 rounded-xl bg-[rgba(255,255,255,0.02)] text-sm tracking-wider"
        style={{ fontFamily: 'Syncopate, sans-serif' }}
      >
        <Menu size={16} className="inline mr-2" />
        MENU
      </button>

      <div
        className="ml-10 text-xs tracking-[6px] text-[#00ffcc]"
        style={{ fontFamily: 'Syncopate, sans-serif' }}
      >
        {getPageTitle()}
      </div>

      <div className="ml-auto">
        <div className="relative p-[3px] overflow-hidden rounded-[18px] bg-[rgba(255,255,255,0.05)]">
          <div
            className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2 animate-spin"
            style={{
              background: 'conic-gradient(transparent, #00ffcc, transparent, #00ffcc)',
              animationDuration: '4s',
              animationTimingFunction: 'linear'
            }}
          />
          <div className="relative bg-[#08080a] px-6 py-3 rounded-[15px] z-[1] flex items-center gap-5">
            <div style={{ fontFamily: 'Space Mono, monospace' }}>
              <span className="text-xl text-[#00ffcc] font-black">
                {profile?.balance || 0}
              </span>{' '}
              <small className="text-[9px] opacity-50 tracking-[2px]">LAST</small>
            </div>
            <div className="w-[1px] h-5 bg-[rgba(255,255,255,0.1)]" />
            <button
              onClick={onWalletClick}
              className="bg-[#00ffcc] text-black px-[22px] py-2.5 rounded-lg font-black text-[10px] transition-all duration-300 hover:bg-[#00ddaa]"
              style={{ fontFamily: 'Syncopate, sans-serif' }}
            >
              {profile?.wallet_address
                ? `${profile.wallet_address.substring(0, 6)}...${profile.wallet_address.slice(-4)}`
                : 'CONNECT WALLET'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
