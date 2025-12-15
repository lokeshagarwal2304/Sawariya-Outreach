import React from 'react';
import { User, Language, Theme, Category } from '../types';
import { TRANSLATIONS } from '../constants/translations';
import { User as UserIcon, Settings, Heart, Zap, Shield, LogOut } from 'lucide-react';

interface UserDashboardProps {
    user: User;
    onUpdatePreferences: (updates: Partial<User>) => void;
    onLogout: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ user, onUpdatePreferences, onLogout }) => {
    const prefs = user.preferences || { language: 'en', theme: 'dark', interestedCategories: [] };
    const t = TRANSLATIONS[prefs.language];

    const toggleTheme = () => {
        onUpdatePreferences({
            preferences: { ...prefs, theme: prefs.theme === 'dark' ? 'light' : 'dark' }
        });
    };

    const setLanguage = (lang: Language) => {
        onUpdatePreferences({
            preferences: { ...prefs, language: lang }
        });
    };

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 animate-fade-in-up">
            {/* Header Stats */}
            <div className="bg-gradient-to-r from-purple-800 to-indigo-900 rounded-3xl p-8 mb-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                
                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/20">
                        <UserIcon size={40} />
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
                        <p className="text-purple-200">{user.email}</p>
                        <div className="flex gap-3 mt-4 justify-center md:justify-start">
                            <span className="px-3 py-1 bg-black/20 rounded-full text-xs font-mono">Premium Member</span>
                            <span className="px-3 py-1 bg-black/20 rounded-full text-xs font-mono">{prefs.language.toUpperCase()}</span>
                        </div>
                    </div>
                    
                    <div className="ml-auto flex gap-4">
                        <div className="text-center px-4 py-2 bg-white/10 rounded-xl">
                            <div className="text-2xl font-bold">12</div>
                            <div className="text-xs text-purple-200">Saved</div>
                        </div>
                        <div className="text-center px-4 py-2 bg-white/10 rounded-xl">
                            <div className="text-2xl font-bold">850</div>
                            <div className="text-xs text-purple-200">Points</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Settings Column */}
                <div className="md:col-span-2 space-y-6">
                    {/* General Settings */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <Settings size={20} className="text-gray-500" /> General Preferences
                        </h3>
                        
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                                    <p className="text-sm text-gray-500">Toggle application theme</p>
                                </div>
                                <button 
                                    onClick={toggleTheme}
                                    className={`w-14 h-8 rounded-full p-1 transition-colors ${prefs.theme === 'dark' ? 'bg-purple-600' : 'bg-gray-300'}`}
                                >
                                    <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${prefs.theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Language</p>
                                    <p className="text-sm text-gray-500">Change dashboard language</p>
                                </div>
                                <select 
                                    value={prefs.language}
                                    onChange={(e) => setLanguage(e.target.value as Language)}
                                    className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                >
                                    <option value="en">English</option>
                                    <option value="hi">Hindi</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                    <option value="de">German</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Interests */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                         <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <Heart size={20} className="text-red-500" /> Active Interests
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {prefs.interestedCategories.map(cat => (
                                <span key={cat} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium border border-purple-200 dark:border-purple-800">
                                    {cat}
                                </span>
                            ))}
                            <button className="px-3 py-1 border border-dashed border-gray-400 text-gray-500 rounded-full text-sm hover:border-purple-500 hover:text-purple-500 transition-colors">
                                + Manage
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
                        <Zap size={32} className="mb-4 text-yellow-200" />
                        <h3 className="font-bold text-xl mb-2">Upgrade to Pro</h3>
                        <p className="text-sm text-white/90 mb-4">Get access to GPT-4o analysis, 4K Video Generation, and API access.</p>
                        <button className="w-full bg-white text-orange-600 font-bold py-2 rounded-lg hover:bg-orange-50 transition-colors">
                            View Plans
                        </button>
                    </div>

                     <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <button 
                            onClick={onLogout}
                            className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 py-3 rounded-lg transition-colors font-medium"
                        >
                            <LogOut size={18} /> Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};