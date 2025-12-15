import React from 'react';
import { EnrichedStory, Language } from '../types';
import { ExternalLink, TrendingUp, Info } from 'lucide-react';

interface StoryCardProps {
  story: EnrichedStory;
  language: Language;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
  return (
    <div className="flex-none w-80 bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-lg hover:border-purple-500 transition-colors duration-300 flex flex-col justify-between h-64 snap-center mr-4">
      <div>
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
            {new Date(story.time * 1000).toLocaleDateString()}
          </span>
          <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-bold">
            <TrendingUp size={16} className="mr-1" />
            {story.predictedScore}
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight">
          <a href={story.url} target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            {story.title}
          </a>
        </h3>

        <div className="flex items-start mt-4 bg-gray-50 dark:bg-gray-700/50 p-2 rounded text-xs text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-transparent">
          <Info size={14} className="mt-0.5 mr-2 text-purple-500 dark:text-purple-400 flex-shrink-0" />
          <p className="italic leading-relaxed">"{story.explanation}"</p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <span className="text-xs text-gray-500">HN Score: {story.score}</span>
        {story.url && (
            <a 
              href={story.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-white transition-colors"
            >
              <ExternalLink size={18} />
            </a>
        )}
      </div>
    </div>
  );
};