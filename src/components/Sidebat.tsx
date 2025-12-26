import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Target, Users, DollarSign } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onClose: () => void;
}

export function Sidebar({ isOpen, activeTab, onTabChange, onClose }: SidebarProps) {
  const { signOut } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
    { id: 'missions', label: 'MISSIONS', icon: Target },
    { id: 'referrals', label: 'REFERRALS', icon: Users },
    { id: 'presale', label: 'PRE-SALE', icon: DollarSign, disabled: true },
  ];

  const handleTabClick = (id: string, disabled?: boolean) => {
    if (disabled) {
      alert('System secure. No updates.');
      return;
    }
    onTabChange(id);
    onClose();
  };

  return (
    <aside
      className={`fixed left-0 w-[280px] h-[95vh] top-[2.5vh] ml-5 bg-[rgba(5,5,10,0.9)] backdrop-blur-[40px] border border-[rgba(0,255,204,0.1)] rounded-[30px] transition-all duration-[600ms] z-[2000] ${
        isOpen ? 'translate-x-0 shadow-[0_0_50px_rgba(0,255,204,0.1)]' : '-translate-x-[320px]'
      }`}
    >
      <div className="p-[50px_35px] text-[20px] tracking-[2px]" style={{ fontFamily: 'Syncopate, sans-serif' }}>
        <span className="text-[#00ffcc]">LAST</span>
        <br />
        <span className="text-white">CHAIN</span>
      </div>

      <nav>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabClick(item.id, item.disabled)}
            className={`w-full text-left px-[30px] py-[22px] mx-[15px] rounded-xl text-[10px] tracking-[2px] transition-all duration-300 border-l-0 hover:border-l-4 ${
              activeTab === item.id
                ? 'text-white bg-[rgba(0,255,204,0.05)] border-l-4 border-[#00ffcc]'
                : 'text-[#555] hover:text-white hover:bg-[rgba(0,255,204,0.05)] hover:border-[#00ffcc]'
            }`}
            style={{ fontFamily: 'Syncopate, sans-serif', width: 'calc(100% - 30px)' }}
          >
            <div className="flex items-center gap-3">
              <item.icon size={14} />
              {item.label}
            </div>
          </button>
        ))}
      </nav>

      <button
        onClick={signOut}
        className="absolute bottom-10 left-[35px] text-[#ff007a] font-bold text-[10px]"
        style={{ fontFamily: 'Syncopate, sans-serif' }}
      >
        [ TERMINATE_SESSION ]
      </button>
    </aside>
  );
}
