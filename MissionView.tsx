import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { RotatingBorderBox } from '../components/RotatingBorderBox';

export function MissionsView() {
  const { profile, user, refreshProfile } = useAuth();
  const [countdown, setCountdown] = useState('');
  const [canClaim, setCanClaim] = useState(false);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    checkClaimStatus();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [profile]);

  const checkClaimStatus = () => {
    if (!profile?.wallet_address) {
      setCanClaim(false);
      setCountdown('CONNECT WALLET TO UNLOCK');
      return;
    }

    if (!profile.last_checkin) {
      setCanClaim(true);
      setCountdown('SYSTEM READY FOR CLAIM');
      return;
    }

    const lastCheckin = new Date(profile.last_checkin).getTime();
    const now = Date.now();
    const diff = now - lastCheckin;

    if (diff >= 86400000) {
      setCanClaim(true);
      setCountdown('SYSTEM READY FOR CLAIM');
    } else {
      setCanClaim(false);
    }
  };

  const updateCountdown = () => {
    if (!profile?.last_checkin || !profile?.wallet_address) return;

    const nextClaim = new Date(profile.last_checkin).getTime() + 86400000;
    const now = Date.now();
    const gap = nextClaim - now;

    if (gap > 0) {
      const hours = Math.floor(gap / 3600000);
      const minutes = Math.floor((gap % 3600000) / 60000);
      const seconds = Math.floor((gap % 60000) / 1000);
      setCountdown(`NEXT CLAIMING IN: ${hours}h ${minutes}m ${seconds}s`);
      setCanClaim(false);
    } else {
      setCountdown('SYSTEM READY FOR CLAIM');
      setCanClaim(true);
    }
  };

  const handleClaim = async () => {
    if (!user || !profile || claiming) return;

    setClaiming(true);

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          balance: profile.balance + 100,
          streak: (profile.streak || 0) + 1,
          last_checkin: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      await supabase.from('task_history').insert([
        {
          user_id: user.id,
          task_name: 'Daily Pulse Sync',
          points: 100
        }
      ]);

      await refreshProfile();
      checkClaimStatus();
    } catch (error) {
      console.error('Claim error:', error);
      alert('Failed to claim. Please try again.');
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div>
      <RotatingBorderBox direction="cw" className="mb-[30px]">
        <div className="p-[45px_35px] flex justify-between items-center">
          <div>
            <h2
              className="text-2xl font-black m-0"
              style={{ fontFamily: 'Syncopate, sans-serif' }}
            >
              Daily Check-In
            </h2>
            <p
              className="text-[#00ffcc] mt-2.5 text-sm"
              style={{ fontFamily: 'Space Mono, monospace' }}
            >
              {countdown}
            </p>
          </div>
          <button
            onClick={handleClaim}
            disabled={!canClaim || claiming}
            className="bg-white text-black px-10 py-5 rounded-xl font-black text-[11px] tracking-[2px] uppercase transition-all duration-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#00ffcc] hover:shadow-[0_0_20px_#00ffcc]"
            style={{ fontFamily: 'Syncopate, sans-serif' }}
          >
            {claiming ? 'CLAIMING...' : canClaim ? 'CLAIM NOW' : 'LOCKED'}
          </button>
        </div>
      </RotatingBorderBox>

      <div className="grid grid-cols-2 gap-[30px]">
        <RotatingBorderBox direction="acw">
          <div className="p-[45px_35px] text-center opacity-50">
            <p className="text-[9px] text-[#666] tracking-[3px] font-black uppercase">
              Twitter / X
            </p>
            <h3 className="text-xl mt-4">STAY TUNED</h3>
          </div>
        </RotatingBorderBox>

        <RotatingBorderBox direction="cw">
          <div className="p-[45px_35px] text-center opacity-50">
            <p className="text-[9px] text-[#666] tracking-[3px] font-black uppercase">
              Discord
            </p>
            <h3 className="text-xl mt-4">STAY TUNED</h3>
          </div>
        </RotatingBorderBox>
      </div>
    </div>
  );
}
