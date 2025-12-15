import React from 'react';
import { EnrichedStory } from '../types';
import { Flame } from 'lucide-react';

interface StoryListItemProps {
  story: EnrichedStory;
  rank: number;
  index: number;
}

export const StoryListItem: React.FC<StoryListItemProps> = ({ story, rank, index }) => {
  return (
    <a 
        href={story.url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-start gap-3 group p-3 rounded-xl transition-all duration-200 hover:bg-gray-800 animate-fade-in-up hover:translate-x-1"
        style={{ animationDelay: `${(index + 3) * 75}ms` }}
    >
        <span className="text-xl font-bold text-gray-700 group-hover:text-purple-500 transition-colors w-6 flex-shrink-0 text-center font-mono">
            {rank}
        </span>
        <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-200 group-hover:text-white line-clamp-2 mb-1 leading-relaxed">
                {story.title}
            </h4>
            <div className="flex items-center gap-2 text-xs text-gray-500 group-hover:text-gray-400">
                <span className="text-green-500/70 group-hover:text-green-400 transition-colors font-mono">Score: {story.predictedScore}</span>
                {story.isMotivatorPost && (
                    <span className="flex items-center text-orange-400 font-medium ml-1" title="Emerging Creator">
                        <Flame size={10} fill="currentColor" className="mr-0.5" /> New
                    </span>
                )}
            </div>
        </div>
    </a>
  );
};
