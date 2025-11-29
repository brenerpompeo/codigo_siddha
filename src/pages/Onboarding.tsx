import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { calculateHumanDesign, getStrategyForType, getAuthorityForType } from '../lib/humanDesign';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const setUser = useAppStore((state) => state.setUser);

  const [step, setStep] = useState<'input' | 'calculating' | 'reveal'>('input');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('12:00');

  const [result, setResult] = useState<{
    type: string;
    profile: string;
    authority: string;
    strategy: string;
  } | null>(null);

  const handleCalculate = async () => {
    if (!name || !date) return;

    setStep('calculating');

    // Simulate "Deep Calculation" delay for effect
    setTimeout(() => {
        const birthDate = new Date(`${date}T${time}:00`);
        const hd = calculateHumanDesign(birthDate);
        const strategy = getStrategyForType(hd.type);
        const authority = getAuthorityForType(hd.type);

        const userProfile = {
            id: crypto.randomUUID(),
            name,
            birthDate: birthDate.toISOString(),
            createdAt: new Date().toISOString(),
            humanDesign: {
                type: hd.type,
                profile: hd.profile as any,
                authority: authority as any,
                strategy,
                signature: 'Satisfaction', // Simplified
                notSelfTheme: 'Frustration' // Simplified
            }
        };

        setUser(userProfile);
        setResult({
            type: hd.type,
            profile: hd.profile,
            authority,
            strategy
        });
        setStep('reveal');
    }, 2500);
  };

  if (step === 'calculating') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cosmic-dark text-cosmic-text p-4">
        <Loader2 className="w-16 h-16 text-cosmic-primary animate-spin mb-4" />
        <h2 className="text-2xl font-light tracking-widest animate-pulse">READING THE STARS...</h2>
        <p className="text-cosmic-text/50 mt-2">Mapping your body graph...</p>
      </div>
    );
  }

  if (step === 'reveal' && result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cosmic-dark text-cosmic-text p-6 text-center animate-in fade-in duration-1000">
        <Sparkles className="w-12 h-12 text-cosmic-accent mb-6 animate-bounce" />
        <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cosmic-primary to-cosmic-accent">
          {name}, You are a
        </h1>
        <div className="text-5xl md:text-6xl font-black tracking-wider text-white mb-8 uppercase drop-shadow-[0_0_15px_rgba(109,40,217,0.5)]">
          {result.type}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl mb-12">
            <div className="bg-cosmic-card p-6 rounded-xl border border-white/10">
                <div className="text-xs uppercase tracking-widest text-cosmic-text/50 mb-1">Profile</div>
                <div className="text-xl font-bold">{result.profile}</div>
            </div>
            <div className="bg-cosmic-card p-6 rounded-xl border border-white/10">
                <div className="text-xs uppercase tracking-widest text-cosmic-text/50 mb-1">Strategy</div>
                <div className="text-xl font-bold">{result.strategy}</div>
            </div>
            <div className="bg-cosmic-card p-6 rounded-xl border border-white/10">
                <div className="text-xs uppercase tracking-widest text-cosmic-text/50 mb-1">Authority</div>
                <div className="text-xl font-bold">{result.authority}</div>
            </div>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="group flex items-center gap-3 bg-white text-cosmic-dark px-8 py-4 rounded-full font-bold text-lg hover:bg-cosmic-accent hover:text-white transition-all duration-300 shadow-lg hover:shadow-cosmic-accent/50"
        >
          Enter Your Dashboard
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cosmic-dark text-cosmic-text p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter">Human Design OS</h1>
            <p className="text-cosmic-text/60">Discover your blueprint. Manage your life.</p>
        </div>

        <div className="bg-cosmic-card p-8 rounded-2xl border border-white/5 shadow-2xl space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Your Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-cosmic-dark border border-white/10 rounded-lg p-3 focus:outline-none focus:border-cosmic-primary transition-colors"
                    placeholder="Enter your name"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium ml-1">Date of Birth</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-cosmic-dark border border-white/10 rounded-lg p-3 focus:outline-none focus:border-cosmic-primary transition-colors [color-scheme:dark]"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium ml-1">Time</label>
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full bg-cosmic-dark border border-white/10 rounded-lg p-3 focus:outline-none focus:border-cosmic-primary transition-colors [color-scheme:dark]"
                    />
                </div>
            </div>

            <button
                onClick={handleCalculate}
                disabled={!name || !date}
                className={clsx(
                    "w-full py-4 rounded-xl font-bold text-lg transition-all duration-300",
                    name && date
                        ? "bg-cosmic-primary hover:bg-cosmic-secondary text-white shadow-lg shadow-cosmic-primary/30"
                        : "bg-white/5 text-white/30 cursor-not-allowed"
                )}
            >
                Reveal My Design
            </button>
        </div>

        <p className="text-center text-xs text-white/20">
            Calculated using astronomical ephemeris data.
        </p>
      </div>
    </div>
  );
};
