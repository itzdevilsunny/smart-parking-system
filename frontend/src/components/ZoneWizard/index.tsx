import { useState } from 'react';
import { Layers } from 'lucide-react';
import Step1_Details from './Step1_Details';
import Step2_Capacity from './Step2_Capacity';
import Step3_Review from './Step3_Review';
import type { ParkingZone } from '../../types';

interface ZoneWizardProps {
    onCancel: () => void;
    onComplete: (zone: ParkingZone) => void;
}

export default function ZoneWizard({ onCancel, onComplete }: ZoneWizardProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<ParkingZone>>({
        name: '',
        location_name: '',
        location_lat: 28.6139,
        location_lng: 77.2090,
        max_capacity: 50,
        reserved_slots: 0,
        grace_threshold: 10,
        fine_per_excess: 500,
        status: 'active',
        capacity_status: 'normal',
        current_count: 0
    });

    const updateData = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => {
        if (step === 1) onCancel();
        else setStep(prev => prev - 1);
    };

    const handleSubmit = () => {
        // Generate ID and Timestamp
        const newZone = {
            ...formData,
            id: `z${Date.now()}`,
            last_updated: new Date().toISOString()
        } as ParkingZone;

        onComplete(newZone);
    };

    return (
        <div className="max-w-3xl mx-auto py-8">
            {/* Wizard Header */}
            <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/20 text-blue-500 mb-4 border border-blue-500/30">
                    <Layers size={32} />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Create New Zone</h1>
                <p className="text-gray-400">Configure a new parking zone for enforcement monitoring.</p>
            </div>

            {/* Stepper Indicator */}
            <div className="flex justify-between items-center mb-10 px-12 relative">
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-800 -z-10"></div>
                <StepIndicator num={1} label="Details" active={step >= 1} current={step === 1} />
                <StepIndicator num={2} label="Capacity" active={step >= 2} current={step === 2} />
                <StepIndicator num={3} label="Review" active={step >= 3} current={step === 3} />
            </div>

            {/* Step Content */}
            <div className="min-h-[400px]">
                {step === 1 && (
                    <Step1_Details
                        data={formData}
                        updateData={updateData}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                )}
                {step === 2 && (
                    <Step2_Capacity
                        data={formData}
                        updateData={updateData}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                )}
                {step === 3 && (
                    <Step3_Review
                        data={formData}
                        onSubmit={handleSubmit}
                        onBack={prevStep}
                    />
                )}
            </div>
        </div>
    );
}

function StepIndicator({ num, label, active, current }: { num: number, label: string, active: boolean, current: boolean }) {
    return (
        <div className="flex flex-col items-center gap-2 bg-tactical-bg px-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all border-2
                ${current ? 'border-blue-500 bg-blue-600 text-white scale-110 shadow-lg shadow-blue-900/50'
                    : active ? 'border-emerald-500 bg-emerald-600 text-white'
                        : 'border-slate-700 bg-slate-800 text-gray-500'}`}>
                {num}
            </div>
            <span className={`text-xs font-medium uppercase tracking-wider ${current ? 'text-white' : 'text-gray-500'}`}>
                {label}
            </span>
        </div>
    );
}
