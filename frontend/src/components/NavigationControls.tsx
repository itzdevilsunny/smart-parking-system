import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationControlsProps {
    onBack: () => void;
    onNext: () => void;
    disableBack?: boolean;
    disableNext?: boolean;
    isLastStep?: boolean;
    nextLabel?: string;
    backLabel?: string;
}

export default function NavigationControls({
    onBack,
    onNext,
    disableBack = false,
    disableNext = false,
    isLastStep = false,
    nextLabel = 'Next',
    backLabel = 'Back'
}: NavigationControlsProps) {
    return (
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-tactical-border">
            <button
                onClick={onBack}
                disabled={disableBack}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors border border-tactical-border
                    ${disableBack
                        ? 'text-gray-600 bg-slate-900/50 cursor-not-allowed border-transparent'
                        : 'text-gray-300 hover:text-white hover:bg-slate-800 hover:border-gray-500'
                    }`}
                aria-label="Go back to previous step"
            >
                <ChevronLeft size={16} />
                {backLabel}
            </button>

            <button
                onClick={onNext}
                disabled={disableNext}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg
                    ${disableNext
                        ? 'bg-slate-800 text-gray-500 cursor-not-allowed'
                        : isLastStep
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'
                    }`}
                aria-label={isLastStep ? "Submit form" : "Go to next step"}
            >
                {isLastStep ? (
                    'Submit'
                ) : (
                    <>
                        {nextLabel}
                        <ChevronRight size={16} />
                    </>
                )}
            </button>
        </div>
    );
}
