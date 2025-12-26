import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, TaskHistory } from '../lib/supabase';
import { RotatingBorderBox } from '../components/RotatingBorderBox';
import { StatCard } from '../components/StatCard';

interface LeaderboardEntry {
  id: string;
  balance: number;
}

export function DashboardView() {
  const { profile, user } = useAuth();
  const [history, setHistory] = useState<TaskHistory[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [todayPoints, setTodayPoints] = useState(0);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      fetchHistory();
      fetchLeaderboard();
    }
  }, [user]);

  const fetchHistory = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('task_history')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });

    if (data) {
      setHistory(data);

      const today = new Date().toDateString();
      const todayTasks = data.filter(
        (task) => new Date(task.completed_at).toDateString() === today
      );
      const points = todayTasks.reduce((sum, task) => sum + task.points, 0);
      setTodayPoints(points);
    }
  };

  const fetchLeaderboard = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('id, balance')
      .order('balance', { ascending: false })
      .limit(10);

    if (data) {
      setLeaderboard(data);
      const rank = data.findIndex((entry) => entry.id === user.id);
      setUserRank(rank >= 0 ? rank + 1 : null);
    }
  };

  const progressPercentage = Math.min(((profile?.balance || 0) / 5000) * 100, 100);

  return (
    <div>
      <div className="grid grid-cols-3 gap-[30px] mb-10">
        <RotatingBorderBox direction="cw">
          <StatCard label="Uptime Streak" value={`${profile?.streak || 0}d`} />
        </RotatingBorderBox>

        <RotatingBorderBox direction="acw">
          <StatCard label="Daily Points" value={todayPoints} />
        </RotatingBorderBox>

        <RotatingBorderBox direction="cw">
          <StatCard label="Your Level" value="VOID" />
        </RotatingBorderBox>
      </div>

      <RotatingBorderBox direction="cw" className="mb-10 !rounded-[20px]">
        <div className="p-10 !rounded-[19px]">
          <div
            className="flex justify-between text-[10px] text-[#00ffcc] mb-4"
            style={{ fontFamily: 'Syncopate, sans-serif' }}
          >
            <span>Progress with LAST...</span>
            <span>{profile?.balance || 0}/5000</span>
          </div>
          <div className="bg-black h-2.5 rounded-[20px] border border-[rgba(255,255,255,0.05)] overflow-hidden">
            <div
              className="h-full bg-[#00ffcc] transition-all duration-[2s] shadow-[0_0_20px_#00ffcc]"
              style={{
                width: `${progressPercentage}%`,
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
          </div>
        </div>
      </RotatingBorderBox>

      <div className="grid grid-cols-2 gap-[30px]">
        <RotatingBorderBox direction="cw">
          <div className="p-[45px_35px] text-left min-h-[350px]">
            <p className="text-[9px] text-[#00ffcc] tracking-[3px] font-black uppercase mb-[30px]">
              History
            </p>
            <div className="max-h-[250px] overflow-y-auto">
              {history.length > 0 ? (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="px-[18px] py-[18px] bg-[rgba(255,255,255,0.01)] border-b border-[rgba(255,255,255,0.03)] flex justify-between text-xs"
                    style={{ fontFamily: 'Space Mono, monospace' }}
                  >
                    <span>{item.task_name}</span>
                    <span className="text-[#00ffcc]">+{item.points}</span>
                  </div>
                ))
              ) : (
                <div className="text-center text-[#555] text-xs py-8">No activity yet</div>
              )}
            </div>
          </div>
        </RotatingBorderBox>

        <RotatingBorderBox direction="acw">
          <div className="p-[45px_35px] text-left min-h-[350px]">
            <div className="flex justify-between items-center mb-[30px]">
              <p className="text-[9px] tracking-[3px] font-black uppercase">
                GLOBAL_LEADERBOARD
              </p>
              <span className="text-[#ff007a] text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>
                #{userRank || '--'}
              </span>
            </div>
            <div className="max-h-[250px] overflow-y-auto">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`px-[18px] py-[18px] bg-[rgba(255,255,255,0.01)] border-b border-[rgba(255,255,255,0.03)] flex justify-between text-xs ${
                    entry.id === user?.id ? 'text-[#00ffcc]' : ''
                  }`}
                  style={{ fontFamily: 'Space Mono, monospace' }}
                >
                  <span>
                    #{index + 1} NODE_{entry.id.slice(-5)}
                  </span>
                  <b>{entry.balance}</b>
                </div>
              ))}
            </div>
          </div>
        </RotatingBorderBox>
      </div>
    </div>
  );
}
