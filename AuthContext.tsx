import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string, referrerId?: string | null) => {
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (existingProfile) {
      setProfile(existingProfile);
      return;
    }

    const { data: newProfile } = await supabase
      .from('profiles')
      .insert([{
        id: userId,
        balance: 0,
        streak: 0,
        referred_by: referrerId && referrerId !== userId ? referrerId : null
      }])
      .select()
      .single();

    if (newProfile) {
      setProfile(newProfile);

      if (referrerId && referrerId !== userId) {
        const { data: referrer } = await supabase
          .from('profiles')
          .select('balance')
          .eq('id', referrerId)
          .maybeSingle();

        if (referrer) {
          await supabase
            .from('profiles')
            .update({ balance: referrer.balance + 200 })
            .eq('id', referrerId);

          await supabase
            .from('task_history')
            .insert([{
              user_id: referrerId,
              task_name: 'Referral Bonus',
              points: 200
            }]);
        }
      }
    }
  };

  const refreshProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (data) {
      setProfile(data);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const params = new URLSearchParams(window.location.search);
        const referrerId = params.get('ref');
        fetchProfile(session.user.id, referrerId);
      }

      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const params = new URLSearchParams(window.location.search);
        const referrerId = params.get('ref');
        fetchProfile(session.user.id, referrerId);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signInWithGoogle, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
