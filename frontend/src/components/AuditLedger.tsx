import { useState, useEffect } from 'react';
import { Search, Filter, Download, ShieldCheck } from 'lucide-react';

interface AuditLog {
    id: string;
    event_type: 'VIOLATION_DETECTED' | 'TEAM_DEPLOYED' | 'ZONE_LOCKED' | 'MANUAL_OVERRIDE' | 'SYSTEM_BOOT';
    entity: string;
    initiated_by: string;
    timestamp: string;
    hash: string;
}

export default function AuditLedger() {
    const [initialLogs] = useState<AuditLog[]>([
        { id: 'LOG-8821', event_type: 'VIOLATION_DETECTED', entity: 'Connaught Place A', initiated_by: 'SYSTEM', timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), hash: '0x8f...2e91' },
        { id: 'LOG-8820', event_type: 'TEAM_DEPLOYED', entity: 'Response Unit Alpha', initiated_by: 'Admin_991', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), hash: '0x7a...b12c' },
        { id: 'LOG-8819', event_type: 'ZONE_LOCKED', entity: 'Saket Citywalk', initiated_by: 'SYSTEM', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), hash: '0x3c...991d' },
        { id: 'LOG-8818', event_type: 'MANUAL_OVERRIDE', entity: 'Gate 3', initiated_by: 'Officer_Singh', timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), hash: '0x1b...442a' },
        { id: 'LOG-8817', event_type: 'SYSTEM_BOOT', entity: 'Core Server', initiated_by: 'SYSTEM', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), hash: '0x00...0001' },
    ]);

    const [logs, setLogs] = useState<AuditLog[]>(initialLogs);
    const [filterType, setFilterType] = useState<string>('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    // Real-time Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            const newLog: AuditLog = {
                id: `LOG-${Math.floor(8822 + Math.random() * 1000)}`,
                event_type: Math.random() > 0.7 ? 'VIOLATION_DETECTED' : Math.random() > 0.5 ? 'TEAM_DEPLOYED' : 'ZONE_LOCKED',
                entity: `Zone ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
                initiated_by: Math.random() > 0.5 ? 'SYSTEM' : 'Admin_Auto',
                timestamp: new Date().toISOString(),
                hash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`
            };
            setLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50
        }, 5000); // New log every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const filteredLogs = logs.filter(log => {
        const matchesType = filterType === 'ALL' || log.event_type === filterType;
        const matchesSearch = log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.initiated_by.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
    });

    const handleExport = () => {
        const headers = ["LOG ID", "EVENT TYPE", "ENTITY", "INITIATED BY", "TIMESTAMP", "HASH"];
        const csvContent = [
            headers.join(","),
            ...filteredLogs.map(log => [
                log.id,
                log.event_type,
                log.entity,
                log.initiated_by,
                new Date(log.timestamp).toLocaleString(),
                log.hash
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "security_ledger_export.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="flex flex-col h-full gap-6 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="text-emerald-500" />
                        Security Ledger
                    </h1>
                    <p className="text-gray-400 text-sm">Immutable audit log of all system actions</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <select
                            className="appearance-none bg-tactical-card border border-tactical-border text-white px-4 py-2 rounded-lg pr-8 focus:outline-none focus:border-blue-500"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="ALL">All Events</option>
                            <option value="VIOLATION_DETECTED">Violations</option>
                            <option value="TEAM_DEPLOYED">Deployments</option>
                            <option value="ZONE_LOCKED">Zone Locks</option>
                            <option value="MANUAL_OVERRIDE">Overrides</option>
                            <option value="SYSTEM_BOOT">System</option>
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                    <button
                        onClick={handleExport}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
                    >
                        <Download size={18} />
                        Export Report
                    </button>
                </div>
            </div>

            <div className="bg-tactical-card border border-tactical-border rounded-xl flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="p-4 border-b border-tactical-border">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by hash, user, or event type..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900 border border-tactical-border rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-auto scrollbar-thin">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-800/50 text-gray-400 text-xs uppercase sticky top-0 z-10">
                            <tr>
                                <th className="p-4 font-bold">Log ID</th>
                                <th className="p-4 font-bold">Event Type</th>
                                <th className="p-4 font-bold">Entity</th>
                                <th className="p-4 font-bold">Initiated By</th>
                                <th className="p-4 font-bold">Timestamp</th>
                                <th className="p-4 font-bold">Blockchain Hash</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-tactical-border">
                            {filteredLogs.map(log => (
                                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors group animate-in slide-in-from-left-2 duration-300">
                                    <td className="p-4 font-mono text-blue-400 text-sm">{log.id}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${log.event_type === 'VIOLATION_DETECTED' ? 'bg-red-500/20 text-red-500' :
                                                log.event_type === 'TEAM_DEPLOYED' ? 'bg-blue-500/20 text-blue-500' :
                                                    log.event_type === 'ZONE_LOCKED' ? 'bg-amber-500/20 text-amber-500' :
                                                        'bg-gray-700 text-gray-300'
                                            }`}>
                                            {log.event_type.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="p-4 text-white text-sm">{log.entity}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                                            <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-xs">
                                                {log.initiated_by.charAt(0)}
                                            </div>
                                            {log.initiated_by}
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-500 text-xs font-mono">
                                        {new Date(log.timestamp).toLocaleTimeString()}
                                    </td>
                                    <td className="p-4 font-mono text-xs text-emerald-500/70 group-hover:text-emerald-400 transition-colors">
                                        {log.hash}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
