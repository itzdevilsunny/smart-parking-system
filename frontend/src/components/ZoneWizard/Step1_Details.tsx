import { MapPin, Info } from 'lucide-react';
import NavigationControls from '../NavigationControls';

interface Step1Props {
    data: any;
    updateData: (key: string, value: any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function Step1_Details({ data, updateData, onNext, onBack }: Step1Props) {
    const isValid = data.name && data.location_name;

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="bg-tactical-card border border-tactical-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Info size={20} className="text-blue-500" />
                    Zone Identification
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Zone Name</label>
                        <input
                            type="text"
                            value={data.name || ''}
                            onChange={(e) => updateData('name', e.target.value)}
                            placeholder="e.g. Connaught Place Block A"
                            className="w-full bg-slate-900 border border-tactical-border rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-blue-500 outline-none"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Location / Area</label>
                        <input
                            type="text"
                            value={data.location_name || ''}
                            onChange={(e) => updateData('location_name', e.target.value)}
                            placeholder="e.g. Central Delhi"
                            className="w-full bg-slate-900 border border-tactical-border rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-tactical-card border border-tactical-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <MapPin size={20} className="text-emerald-500" />
                    Geoposition
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Latitude</label>
                        <input
                            type="number"
                            value={data.location_lat || ''}
                            onChange={(e) => updateData('location_lat', parseFloat(e.target.value))}
                            step="0.0001"
                            className="w-full bg-slate-900 border border-tactical-border rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-blue-500 outline-none font-mono"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Longitude</label>
                        <input
                            type="number"
                            value={data.location_lng || ''}
                            onChange={(e) => updateData('location_lng', parseFloat(e.target.value))}
                            step="0.0001"
                            className="w-full bg-slate-900 border border-tactical-border rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-blue-500 outline-none font-mono"
                        />
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                    <Info size={12} />
                    Coordinates are required for map placement and navigation.
                </p>
            </div>

            <NavigationControls
                onBack={onBack}
                onNext={onNext}
                disableBack={false} // Allow going back to Dashboard
                disableNext={!isValid}
                backLabel="Cancel"
            />
        </div>
    );
}
