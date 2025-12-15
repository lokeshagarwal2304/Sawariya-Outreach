import React from 'react';
import { EnrichedStory, Category } from '../types';
import { TrendingUp, Briefcase, Flame } from 'lucide-react';
import { logAction } from '../services/analyticsService';

interface StoryGridItemProps {
  story: EnrichedStory;
  index: number;
}

export const StoryGridItem: React.FC<StoryGridItemProps> = ({ story, index }) => {
  // Deterministic random image based on story ID
  const imageUrl = `https://picsum.photos/seed/${story.id}/400/300`;
  const isHiring = story.category === Category.TALENT_ACQ || story.category === Category.JOB_SEEKER;

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    logAction('click_apply', story.id);
    window.open(story.url, '_blank');
  };

  return (
    <a 
        href={story.url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="block group animate-fade-in-up hover:-translate-y-1 transition-transform duration-300 relative"
        style={{ animationDelay: `${index * 100}ms` }}
    >
        <div className="relative h-48 rounded-xl overflow-hidden mb-3 ring-1 ring-white/5 group-hover:ring-purple-500/30 transition-all">
            <img 
                src={imageUrl} 
                alt="Story Thumbnail" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300"></div>
            
            {/* Top Right Badges */}
            <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-green-400 flex items-center border border-white/10">
                    <TrendingUp size={12} className="mr-1" /> {story.predictedScore}
                </div>
                {story.isMotivatorPost && (
                    <div className="bg-orange-500/90 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-white flex items-center shadow-lg">
                        <Flame size={10} fill="currentColor" className="mr-1" /> Discovery
                    </div>
                )}
            </div>
            
            {/* Interactive Layer: Apply Overlay on Hover */}
            {isHiring && (
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                        onClick={handleApplyClick}
                        className="bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg hover:bg-purple-500"
                    >
                        <Briefcase size={12} /> Apply
                    </button>
                </div>
            )}
        </div>
        
        <div className="space-y-1 px-1">
            <div className="flex justify-between items-center">
                <div className="text-xs text-purple-400 font-medium uppercase tracking-wide opacity-80 group-hover:opacity-100 transition-opacity">
                    {story.category.split(' ')[0]}
                </div>
            </div>
            
            <h3 className="font-bold text-white text-lg leading-snug group-hover:text-purple-300 transition-colors line-clamp-2">
                {story.title}
            </h3>
            <p className="text-xs text-gray-500 italic group-hover:text-gray-400 transition-colors">"{story.explanation}"</p>
        </div>
    </a>
  );
};
