import React, { useState } from 'react';
import { NavTab, User, Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';
import { MoreHorizontal, Sparkles, Image as ImageIcon, LogOut, User as UserIcon, LayoutDashboard, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onNavigate: (view: 'home' | 'studio' | 'dashboard') => void;
  onLogout: () => void;
  user: User;
}

const TABS: NavTab[] = ['Technical', 'Non-Technical', 'Open-Hiring', 'Entertainment', 'Artificial Intelligence'];

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, onNavigate, onLogout, user }) => {
  const [showMenu, setShowMenu] = useState(false);
  
  const prefs = user.preferences || { language: 'en', theme: 'dark' };
  const t = TRANSLATIONS[prefs.language as Language] || TRANSLATIONS['en'];

  return (
    <nav className="sticky top-0 z-40 bg-white/90 dark:bg-[#0f1117]/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 mr-8 cursor-pointer hover:opacity-80 transition-opacity"
        >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
                <span className="font-bold text-white text-lg">S</span>
            </div>
            <span className="text-lg font-bold hidden md:block tracking-tight text-gray-900 dark:text-white">Sawariya</span>
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 md:gap-2">
                {TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => { onTabChange(tab); onNavigate('home'); }}
                        className={`px-3 md:px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                            activeTab === tab 
                            ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-md' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>

        {/* Accessories / Menu */}
        <div className="ml-4 flex items-center gap-3 relative">
            <div className="hidden md:flex items-center text-xs font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-800">
                Hi, {user.name}
            </div>
            
            <div className="relative">
                <button 
                    onClick={() => setShowMenu(!showMenu)}
                    className={`p-2 rounded-full transition-colors ${
                        showMenu 
                        ? 'bg-gray-200 dark:bg-gray-800 text-black dark:text-white' 
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                    <MoreHorizontal size={20} />
                </button>

                {showMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200 ring-1 ring-black/5 z-50">
                        <button 
                            onClick={() => { onNavigate('dashboard'); setShowMenu(false); }}
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors"
                        >
                            <UserIcon size={18} className="text-blue-500" /> {t.profile}
                        </button>
                        <button 
                            onClick={() => { onNavigate('studio'); setShowMenu(false); }}
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors"
                        >
                            <ImageIcon size={18} className="text-purple-500" /> {t.studio}
                        </button>
                        <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>
                        <button 
                            onClick={() => { onLogout(); setShowMenu(false); }}
                            className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-3 transition-colors"
                        >
                            <LogOut size={18} /> {t.signOut}
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </nav>
  );
};