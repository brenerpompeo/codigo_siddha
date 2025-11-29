import React from 'react';
import { useAppStore } from '../store';
import { SpiderGraph } from '../components/SpiderGraph';
import { getStrategyForType } from '../lib/humanDesign';
import { Layout, CheckCircle, Target, TrendingUp, User, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { Link, useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
    const { user, tasks, activeSprint, setUser } = useAppStore();
    const navigate = useNavigate();

    if (!user) return null;

    const handleLogout = () => {
        // Clear user but keep data? No, clear session.
        // For MVP store reset is manual, but we can just redirect to "/"
        // which redirects to Onboarding if user is null.
        // We need a "resetStore" or just clear user.
        setUser(null as any); // Type hack for MVP logout
        navigate('/');
    };

    // Daily Tip Logic
    const tips = {
        'Generator': "Focus on what lights you up today. Don't initiate, wait for a sign.",
        'Manifesting Generator': "It's okay to skip steps if the energy is there.",
        'Projector': "Your insight is valuable. Wait for someone to ask for it.",
        'Manifestor': "Inform those around you before you dive into your next big idea.",
        'Reflector': "Take your time. How does the environment feel today?"
    };
    const dailyTip = tips[user.humanDesign.type] || "Follow your strategy.";

    return (
        <div className="min-h-screen bg-cosmic-dark text-cosmic-text flex">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex flex-col w-64 border-r border-white/10 p-6 space-y-8">
                <div className="text-2xl font-bold tracking-tighter text-white">HD.OS</div>

                <nav className="space-y-2">
                    <NavItem icon={<Layout />} label="Overview" active />
                    <NavItem icon={<Target />} label="Sprint Board" onClick={() => navigate('/sprint')} />
                    <NavItem icon={<TrendingUp />} label="Analytics" />
                    <NavItem icon={<User />} label="Profile" />
                </nav>

                <div className="mt-auto pt-6 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cosmic-primary flex items-center justify-center text-lg font-bold">
                            {user.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{user.name}</div>
                            <div className="text-xs text-white/50 truncate">{user.humanDesign.type}</div>
                        </div>
                        <button onClick={handleLogout} className="text-white/30 hover:text-white">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8 md:hidden">
                    <div className="text-xl font-bold">HD.OS</div>
                    <button onClick={handleLogout}><LogOut /></button>
                </header>

                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Welcome & Tip */}
                    <section>
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user.name}</h1>
                        <div className="bg-gradient-to-r from-cosmic-secondary to-cosmic-primary p-4 rounded-xl shadow-lg border border-white/10 relative overflow-hidden">
                            <div className="relative z-10">
                                <span className="text-xs font-bold uppercase tracking-widest opacity-70">Daily Insight for {user.humanDesign.type}s</span>
                                <p className="text-lg font-medium mt-1">"{dailyTip}"</p>
                            </div>
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                        </div>
                    </section>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Spider Graph */}
                        <div className="bg-cosmic-card p-6 rounded-2xl border border-white/5 shadow-xl md:col-span-2 lg:col-span-1">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Target size={20} className="text-cosmic-accent" />
                                Balance Check
                            </h3>
                            <SpiderGraph tasks={tasks} />
                        </div>

                        {/* Active Sprint Info */}
                        <div className="bg-cosmic-card p-6 rounded-2xl border border-white/5 shadow-xl lg:col-span-2">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <TrendingUp size={20} className="text-cosmic-primary" />
                                Active Sprint
                            </h3>

                            {!activeSprint ? (
                                <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-xl">
                                    <p className="text-white/50 mb-4">No active sprint. Ready to focus?</p>
                                    <button
                                        onClick={() => navigate('/sprint')}
                                        className="px-6 py-2 bg-cosmic-primary text-white rounded-full hover:bg-cosmic-secondary transition-colors"
                                    >
                                        Start New Sprint
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className="text-4xl font-black text-white">Day {calculateDayDifference(activeSprint.startDate)}</div>
                                            <div className="text-white/50">of {activeSprint.duration} Days</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-cosmic-accent">
                                                {tasks.filter(t => t.status === 'done' && t.sprintId === activeSprint.id).length}
                                            </div>
                                            <div className="text-xs text-white/50 uppercase tracking-widest">Tasks Done</div>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-cosmic-primary to-cosmic-accent transition-all duration-500"
                                            style={{ width: `${(calculateDayDifference(activeSprint.startDate) / activeSprint.duration) * 100}%` }}
                                        ></div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => navigate('/sprint')}
                                            className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors font-medium border border-white/5"
                                        >
                                            View Board
                                        </button>
                                        <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors font-medium border border-white/5">
                                            Check-in
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const NavItem = ({ icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
    <button
        onClick={onClick}
        className={clsx(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
            active ? "bg-cosmic-primary/20 text-white border border-cosmic-primary/50" : "text-white/50 hover:bg-white/5 hover:text-white"
        )}
    >
        {React.cloneElement(icon, { size: 20 })}
        <span className="font-medium">{label}</span>
    </button>
);

const calculateDayDifference = (dateStr: string) => {
    const start = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};
