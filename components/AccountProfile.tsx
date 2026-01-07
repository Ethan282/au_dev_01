import React from 'react';
import { User, Mail, Shield, Clock, HardDrive, LogOut, ChevronRight, Activity, Bell } from 'lucide-react';

interface AccountProfileProps {
    onSignOut: () => void;
    onBack: () => void;
}

const AccountProfile: React.FC<AccountProfileProps> = ({ onSignOut, onBack }) => {
    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 animate-fade-in">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                                JD
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-slate-900 rounded-full"></div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">John Doe</h2>
                            <p className="text-slate-400 font-mono text-sm uppercase tracking-wider">Enterprise Plan // UI_DEBUGGER</p>
                        </div>
                    </div>
                    <button
                        onClick={onSignOut}
                        className="flex items-center gap-2 bg-red-950/20 hover:bg-red-900/40 text-red-400 border border-red-900/40 px-4 py-2 rounded-xl transition-all font-bold text-sm"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column: Account Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 px-1">Login Details</h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800/50 group hover:border-blue-500/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">Username</p>
                                            <p className="text-sm text-slate-200 font-mono">dev_admin_01</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-700 group-hover:text-blue-400 transition-colors" />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800/50 group hover:border-blue-500/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                            <Mail size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">Email Address</p>
                                            <p className="text-sm text-slate-200 font-mono">john@autoqa.ai</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-700 group-hover:text-blue-400 transition-colors" />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800/50 group hover:border-blue-500/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                            <Shield size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">Authentication Type</p>
                                            <p className="text-sm text-slate-200 font-mono">OAuth 2.0 + 2FA</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-700 group-hover:text-blue-400 transition-colors" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 px-1">Security Log</h3>
                            <div className="space-y-3">
                                {[
                                    { event: 'New Login', location: 'London, UK', time: '2 hours ago', icon: Activity },
                                    { event: 'Password Changed', location: 'Settings', time: '3 days ago', icon: Shield },
                                    { event: 'API Key Generated', location: 'Dashboard', time: '1 week ago', icon: HardDrive },
                                ].map((log, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 border-b border-slate-800 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <log.icon size={14} className="text-slate-600" />
                                            <div>
                                                <p className="text-sm text-slate-300 font-medium">{log.event}</p>
                                                <p className="text-[10px] text-slate-500">{log.location}</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-mono text-slate-600">{log.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Stats & Settings */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/10">
                            <h4 className="text-sm font-bold uppercase tracking-widest mb-4 opacity-80">API Balance</h4>
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-4xl font-black">2.4k</span>
                                <span className="text-sm opacity-60">credits</span>
                            </div>
                            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden mb-4">
                                <div className="w-3/4 h-full bg-white rounded-full"></div>
                            </div>
                            <button className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-lg text-xs font-bold transition-all border border-white/10">
                                Top Up Balance
                            </button>
                        </div>

                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Preferences</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Bell size={14} className="text-blue-400" />
                                        <span className="text-sm text-slate-300">Notifications</span>
                                    </div>
                                    <div className="w-8 h-4 bg-emerald-500 rounded-full relative">
                                        <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between opacity-50">
                                    <div className="flex items-center gap-3">
                                        <HardDrive size={14} className="text-slate-400" />
                                        <span className="text-sm text-slate-300">Auto-Backup</span>
                                    </div>
                                    <div className="w-8 h-4 bg-slate-700 rounded-full relative">
                                        <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white/40 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Support</h3>
                            <p className="text-xs text-slate-500 mb-4 leading-relaxed">Need help with your account or API usage?</p>
                            <button className="w-full bg-slate-800 hover:bg-slate-700 py-2 rounded-lg text-xs font-bold transition-all text-slate-300">
                                Contact Support
                            </button>
                        </div>
                    </div>

                </div>

                <div className="flex justify-center pt-8">
                    <button
                        onClick={onBack}
                        className="text-slate-500 hover:text-white transition-colors text-sm font-medium underline underline-offset-4"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountProfile;
