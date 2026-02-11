import { Car, AlertTriangle } from 'lucide-react';
import NavigationControls from '../NavigationControls';

interface Step2Props {
    data: any;
    updateData: (key: string, value: any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function Step2_Capacity({ data, updateData, onNext, onBack }: Step2Props) {
    const isValid = data.max_capacity > 0;

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="bg-tactical-card border border-tactical-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Car size={20} className="text-blue-500" />
                    Capacity Management
                </h3>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Total Capacity</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={data.max_capacity || ''}
                                onChange={(e) => updateData('max_capacity', parseInt(e.target.value))}
                                className="w-full bg-slate-900 border border-tactical-border rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-blue-500 outline-none font-bold text-lg"
                            />
                            <span className="absolute right-4 top-3 text-xs text-gray-500 font-bold">SPOTS</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Reserved Slots</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={data.reserved_slots || 0}
                                onChange={(e) => updateData('reserved_slots', parseInt(e.target.value))}
                                className="w-full bg-slate-900 border border-tactical-border rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                            <span className="absolute right-4 top-3 text-xs text-gray-500 font-bold">VIP/GOV</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-tactical-card border border-tactical-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle size={20} className="text-amber-500" />
                    Enforcement Rules
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Grace Period (Minutes)</label>
                        <input
                            type="number"
                            value={data.grace_threshold || 10}
                            onChange={(e) => updateData('grace_threshold', parseInt(e.target.value))}
                            className="bg-slate-900 border border-tactical-border rounded-lg px-4 py-2.5 text-white w-32 focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">Time allowed before violation is triggered.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Fine per Excess Hour</label>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400">₹</span>
                            <input
                                type="number"
                                value={data.fine_per_excess || 500}
                                onChange={(e) => updateData('fine_per_excess', parseInt(e.target.value))}
                                className="bg-slate-900 border border-tactical-border rounded-lg px-4 py-2.5 text-white w-32 focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <NavigationControls
                onBack={onBack}
                onNext={onNext}
                disableNext={!isValid}
            />
        </div>
    );
}
