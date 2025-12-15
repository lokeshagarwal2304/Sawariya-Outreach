import React, { useState } from 'react';
import { Category, Language, UserPreferences, Theme } from '../types';
import { Check, Globe, Moon, Sun, ArrowRight, Sparkles } from 'lucide-react';

interface OnboardingProps {
    onComplete: (prefs: UserPreferences) => void;
    initialName: string;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, initialName }) => {
    const [step, setStep] = useState(1);
    const [language, setLanguage] = useState<Language>('en');
    const [theme, setTheme] = useState<Theme>('dark');
    const [selectedCats, setSelectedCats] = useState<Category[]>([]);

    const languages: { code: Language; label: string; flag: string }[] = [
        { code: 'en', label: 'English', flag: '🇺🇸' },
        { code: 'hi', label: 'हिंदी (Hindi)', flag: '🇮🇳' },
        { code: 'es', label: 'Español', flag: '🇪🇸' },
        { code: 'fr', label: 'Français', flag: '🇫🇷' },
        { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    ];

    const categories = Object.values(Category);

    const toggleCat = (cat: Category) => {
        if (selectedCats.includes(cat)) {
            setSelectedCats(selectedCats.filter(c => c !== cat));
        } else {
            setSelectedCats([...selectedCats, cat]);
        }
    };

    const handleFinish = () => {
        onComplete({
            language,
            theme,
            interestedCategories: selectedCats.length > 0 ? selectedCats : categories
        });
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#0f1117] flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                
                {/* Header */}
                <div className="text-center mb-8 relative z-10">
                    <div className="inline-flex p-3 rounded-2xl bg-gray-800 mb-4 animate-bounce">
                        <Sparkles className="text-yellow-400" size={24} />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                        {step === 1 ? `Namaste, ${initialName}!` : "Personalize Your Feed"}
                    </h2>
                    <p className="text-gray-400">
                        {step === 1 ? "Let's set up your experience." : "Select topics that interest you."}
                    </p>
                </div>

                {/* Step 1: Language & Theme */}
                {step === 1 && (
                    <div className="space-y-8 animate-fade-in-up">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider">
                                <Globe size={16} /> Select Language
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => setLanguage(lang.code)}
                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                            language === lang.code 
                                            ? 'bg-purple-600/20 border-purple-500 text-white' 
                                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750'
                                        }`}
                                    >
                                        <span className="text-xl">{lang.flag}</span>
                                        <span className="font-medium">{lang.label}</span>
                                        {language === lang.code && <Check size={16} className="ml-auto text-purple-400" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider">
                                <Sun size={16} /> Appearance
                            </label>
                            <div className="flex bg-gray-800 p-1 rounded-xl w-max border border-gray-700">
                                <button
                                    onClick={() => setTheme('light')}
                                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
                                        theme === 'light' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <Sun size={18} /> Light
                                </button>
                                <button
                                    onClick={() => setTheme('dark')}
                                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
                                        theme === 'dark' ? 'bg-gray-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <Moon size={18} /> Dark
                                </button>
                            </div>
                        </div>

                        <button 
                            onClick={() => setStep(2)}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-4 rounded-xl font-bold text-white text-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            Next Step <ArrowRight size={20} />
                        </button>
                    </div>
                )}

                {/* Step 2: Categories */}
                {step === 2 && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => toggleCat(cat)}
                                    className={`text-left p-4 rounded-xl border transition-all ${
                                        selectedCats.includes(cat)
                                        ? 'bg-blue-600/20 border-blue-500 text-white'
                                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                                    }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-sm">{cat}</span>
                                        {selectedCats.includes(cat) && <Check size={16} className="text-blue-400" />}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={() => setStep(1)}
                                className="px-6 py-4 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
                            >
                                Back
                            </button>
                            <button 
                                onClick={handleFinish}
                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 py-4 rounded-xl font-bold text-white text-lg hover:shadow-lg hover:shadow-green-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                Get Started <Sparkles size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};