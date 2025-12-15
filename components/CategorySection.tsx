import React from 'react';
import { EnrichedContent, Category, Language } from '../types';
import { VideoCard } from './VideoCard';
import { StoryCard } from './StoryCard';
import { UserPlus } from 'lucide-react';
import { logAction } from '../services/analyticsService';
import { TRANSLATIONS } from '../constants/translations';

interface CategorySectionProps {
  category: Category;
  items: EnrichedContent[];
  language: Language;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ category, items, language }) => {
  if (items.length === 0) return null;

  const t = TRANSLATIONS[language];
  const isHiringWidget = category === Category.TALENT_ACQ;

  const handleHireNow = () => {
    logAction('click_hire');
    alert("Opening Job Creation Flow...");
  };

  return (
    <div className="mb-10 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4 px-4 md:px-8">
        <div className="flex items-center">
            <div className="h-6 w-1.5 bg-gradient-to-b from-purple-500 to-blue-600 mr-3 rounded-full"></div>
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white tracking-tight">{category}</h2>
            <span className="ml-3 text-[10px] font-bold bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full border border-gray-300 dark:border-gray-700">
            {items.length}
            </span>
        </div>
        
        {isHiringWidget && (
            <button 
                onClick={handleHireNow}
                className="flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-600/10 hover:bg-emerald-200 dark:hover:bg-emerald-600 text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-white border border-emerald-200 dark:border-emerald-600/50 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
            >
                <UserPlus size={14} /> {t.hireNow}
            </button>
        )}
      </div>
      
      {/* Horizontal Scroll Container */}
      <div className="flex overflow-x-auto pb-6 px-4 md:px-8 no-scrollbar snap-x cursor-grab active:cursor-grabbing">
        {items.map((item) => (
            <React.Fragment key={item.id}>
                {item.contentType === 'video' ? (
                    <VideoCard video={item} language={language} />
                ) : (
                    <StoryCard story={item} language={language} />
                )}
            </React.Fragment>
        ))}
        {/* Spacer for end of scroll */}
        <div className="w-4 flex-none"></div>
      </div>
    </div>
  );
};