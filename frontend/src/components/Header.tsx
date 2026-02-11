import { Bell, Search, User, ShieldCheck, ChevronLeft, ChevronRight, Menu, Check } from 'lucide-react';
import { useState } from 'react';
import type { DashboardKPIs } from '../types';

interface HeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    kpis?: DashboardKPIs;
    onBack?: () => void;
    onForward?: () => void;
    canBack?: boolean;
    canForward?: boolean;
    children?: React.ReactNode;
}

export default function Header({ sidebarOpen, setSidebarOpen, kpis, onBack, onForward, canBack, canForward, children }: HeaderProps) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, text: "Connaught Place Zone A is 95% full", time: "2 min ago", unread: true },
        { id: 2, text: "Illegal parking reported in Sector 4", time: "10 min ago", unread: true },
        { id: 3, text: "Shift handover requested by Team Alpha", time: "1 hour ago", unread: false },
    ]);

    const unreadCount = notifications.filter(n => n.unread).length;

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
    };

    return (
        <header className="h-16 bg-tactical-card border-b border-tactical-border flex items-center justify-between px-6 sticky top-0 z-30 shadow-lg shadow-black/20">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                    <Menu size={20} />
                </button>

                {/* Navigation Controls */}
                <div className="flex items-center gap-1 mr-2 border-r border-tactical-border pr-4 hidden md:flex">
                    <button
                        onClick={onBack}
                        disabled={!canBack}
                        className={`p-1.5 rounded-md transition-colors ${canBack ? 'text-gray-400 hover:text-white hover:bg-slate-700' : 'text-gray-700 cursor-not-allowed'}`}
                        title="Go Back"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={onForward}
                        disabled={!canForward}
                        className={`p-1.5 rounded-md transition-colors ${canForward ? 'text-gray-400 hover:text-white hover:bg-slate-700' : 'text-gray-700 cursor-not-allowed'}`}
                        title="Go Forward"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search zones, violations..."
                        className="bg-slate-900 border border-tactical-border rounded-full pl-10 pr-4 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-blue-500 w-64"
                    />
                </div>

                {/* Custom Actions (e.g. Create Zone) */}
                {children}
            </div>

            <div className="flex items-center gap-6">
                {/* Status Indicators */}
                <div className="hidden md:flex items-center gap-4 text-xs font-mono">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded border border-tactical-border">
                        <div className={`w-2 h-2 rounded-full ${kpis?.ai_status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className="text-gray-400">AI: {kpis?.ai_status?.toUpperCase() || 'OFFLINE'}</span>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded border border-tactical-border">
                        <ShieldCheck size={14} className="text-blue-500" />
                        <span className="text-gray-400">SYSTEM: ONLINE</span>
                    </div>
                </div>

                <div className="h-8 w-px bg-tactical-border hidden md:block" />

                <div className="flex items-center gap-4">
                    {/* Notification Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors relative"
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-tactical-card"></span>
                            )}
                        </button>

                        {showNotifications && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                                <div className="absolute right-0 top-full mt-2 w-80 bg-tactical-card border border-tactical-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="p-3 border-b border-tactical-border flex justify-between items-center bg-slate-900/50">
                                        <h3 className="text-sm font-bold text-white">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <button onClick={markAllRead} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                                <Check size={12} /> Mark read
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-4 text-center text-gray-500 text-xs">No new notifications</div>
                                        ) : (
                                            notifications.map(n => (
                                                <div key={n.id} className={`p-3 border-b border-tactical-border/50 hover:bg-white/5 transition-colors cursor-pointer ${n.unread ? 'bg-blue-500/5' : ''}`}>
                                                    <div className="flex gap-2">
                                                        <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${n.unread ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                                                        <div>
                                                            <p className={`text-sm ${n.unread ? 'text-white font-medium' : 'text-gray-400'}`}>{n.text}</p>
                                                            <p className="text-[10px] text-gray-500 mt-1">{n.time}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <div className="p-2 text-center border-t border-tactical-border bg-slate-900/30">
                                        <button className="text-xs text-gray-400 hover:text-white">View All History</button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-3 pl-4 border-l border-tactical-border">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-medium text-white">Admin Officer</p>
                            <p className="text-xs text-gray-500">MCD Infrastructure</p>
                        </div>
                        <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center text-gray-300 border border-gray-600">
                            <User size={18} />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
