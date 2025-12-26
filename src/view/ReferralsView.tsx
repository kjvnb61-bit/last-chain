import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { RotatingBorderBox } from '../components/RotatingBorderBox';

export function ReferralsView() {
  const { profile, user } = useAuth();
  const [refCount, setRefCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchReferralCount();
    }
  }, [user]);

  const fetchReferralCount = async () => {
    if (!user) return;

    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('referred_by', user.id);

    setRefCount(count || 0);
  };

  const referralUrl = profile?.wallet_address
    ? `${window.location.origin}?ref=${user?.id}`
    : 'CONNECT WALLET TO GENERATE LINK';

  const copyToClipboard = () => {
    if (!profile?.wallet_address) {
      alert('Connect wallet first!');
      return;
    }
    navigator.clipboard.writeText(referralUrl);
    alert('COPIED TO CLIPBOARD');
  };

  return (
    <div>
      <div className="mb-10">
        <h1
          className="text-[35px] mb-4"
          style={{ fontFamily: 'Syncopate, sans-serif' }}
        >
          Earn LAST with Invitation
        </h1>
        <p
          className="text-[#888] tracking-wider"
          style={{ fontFamily: 'Space Mono, monospace' }}
        >
          Earn 200 LAST tokens for every new Ref connected via your link.
        </p>

        <div className="bg-black border border-dashed border-[#00ffcc] p-5 rounded-2xl my-[30px] flex justify-between items-center">
          <span
            className="text-[#00ffcc] text-sm"
            style={{ fontFamily: 'Space Mono, monospace' }}
          >
            {referralUrl}
          </span>
          <button
            onClick={copyToClipboard}
            className="bg-white text-black px-5 py-2.5 rounded-xl font-black text-[10px] tracking-[2px] uppercase transition-all duration-400 hover:bg-[#00ffcc] hover:shadow-[0_0_20px_#00ffcc]"
            style={{ fontFamily: 'Syncopate, sans-serif' }}
          >
            COPY LINK
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[30px]">
        <RotatingBorderBox direction="cw">
          <div className="p-[45px_35px] text-center">
            <p className="text-[9px] text-[#666] tracking-[3px] font-black uppercase">
              Total Referred
            </p>
            <h2
              className="text-[38px] font-bold mt-2.5 text-[#ff007a]"
              style={{ fontFamily: 'Space Mono, monospace' }}
            >
              {refCount}
            </h2>
          </div>
        </RotatingBorderBox>

        <RotatingBorderBox direction="acw">
          <div className="p-[45px_35px] text-center">
            <p className="text-[9px] text-[#666] tracking-[3px] font-black uppercase">
              Total Referral Rewards
            </p>
            <h2
              className="text-[38px] font-bold mt-2.5"
              style={{ fontFamily: 'Space Mono, monospace' }}
            >
              {refCount * 200}
            </h2>
          </div>
        </RotatingBorderBox>
      </div>
    </div>
  );
}
