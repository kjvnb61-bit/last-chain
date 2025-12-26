import { useAuth } from '../contexts/AuthContext';

export function AuthScreen() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="h-screen flex flex-col justify-center items-center relative z-[100]">
      <h1
        className="text-[10vw] font-black text-white tracking-[-8px] leading-[0.85] text-center"
        style={{
          fontFamily: 'Syncopate, sans-serif',
          background: 'linear-gradient(to bottom, #fff, #333)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      >
        LAST
        <br />
        CHAIN
      </h1>
      <p
        className="mt-5 tracking-[5px] text-[#00ffcc] font-bold"
        style={{ fontFamily: 'Space Mono, monospace' }}
      >
        Backed By Last Foundation | Solana | Web3
      </p>
      <button
        onClick={signInWithGoogle}
        className="mt-[60px] bg-white text-black px-10 py-5 rounded-xl font-black text-[11px] tracking-[2px] uppercase transition-all duration-400 hover:bg-[#00ffcc] hover:shadow-[0_0_20px_#00ffcc]"
        style={{ fontFamily: 'Syncopate, sans-serif' }}
      >
        CONTINUE WITH GOOGLE
      </button>
    </div>
  );
}
