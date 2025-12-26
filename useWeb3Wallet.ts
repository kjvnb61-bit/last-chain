import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      isMetaMask?: boolean;
    };
  }
}

export function useWeb3Wallet() {
  const { user, profile, refreshProfile } = useAuth();
  const [connecting, setConnecting] = useState(false);

  const connectWallet = async () => {
    if (!user || connecting) return;

    if (!window.ethereum) {
      alert('Please install MetaMask to connect your wallet');
      return;
    }

    setConnecting(true);

    try {
      const accounts = (await window.ethereum.request({
        method: 'eth_requestAccounts'
      })) as string[];

      if (accounts && accounts.length > 0) {
        const message = `VERIFY_WALLET_ID_${user.id}`;

        const signature = (await window.ethereum.request({
          method: 'personal_sign',
          params: [message, accounts[0]]
        })) as string;

        if (signature) {
          await supabase
            .from('profiles')
            .update({ wallet_address: accounts[0] })
            .eq('id', user.id);

          await refreshProfile();
        }
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    if (!user) return;

    const confirmed = confirm('DISCONNECT WALLET?');
    if (!confirmed) return;

    try {
      await supabase
        .from('profiles')
        .update({ wallet_address: null })
        .eq('id', user.id);

      await refreshProfile();
    } catch (error) {
      console.error('Disconnect error:', error);
      alert('Failed to disconnect wallet.');
    }
  };

  const handleWalletClick = () => {
    if (profile?.wallet_address) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  return {
    connectWallet,
    disconnectWallet,
    handleWalletClick,
    connecting,
    isConnected: !!profile?.wallet_address
  };
}
