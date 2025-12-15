import React from 'react';
import { EnrichedVideo, Category, Language } from '../types';
import { ExternalLink, TrendingUp, Info, Play, ThumbsUp, MessageCircle, Star, Briefcase } from 'lucide-react';
import { logAction } from '../services/analyticsService';
import { TRANSLATIONS } from '../constants/translations';

interface VideoCardProps {
  video: EnrichedVideo;
  language: Language;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, language }) => {
  const t = TRANSLATIONS[language];
  const isHiring = video.category === Category.TALENT_ACQ || video.category === Category.JOB_SEEKER;

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    logAction('click_apply', parseInt(video.id.replace(/\D/g, '')) || 0); // Mock ID conversion
    window.open(video.url, '_blank');
  };

  return (
    <div className="flex-none w-80 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg hover:border-purple-500/50 transition-all duration-300 flex flex-col h-[340px] snap-center mr-4 group overflow-hidden relative">
      
      {/* Thumbnail Section */}
      <div className="relative h-44 w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
        <img 
            src={video.thumbnailUrl} 
            alt={video.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20 group-hover:bg-transparent transition-colors"></div>
        
        {/* Play Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40">
                <Play fill="white" className="text-white ml-1" size={20} />
            </div>
        </div>

        {/* Motivator Badge */}
        {video.isMotivatorPost && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                <Star size={10} fill="white" /> 🌟 {t.discovery}
            </div>
        )}

        {/* Score Badge */}
        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-green-400 border border-white/10 flex items-center gap-1">
            <TrendingUp size={12} /> {video.predictedScore}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
            <a href={video.url} target="_blank" rel="noopener noreferrer">
                {video.title}
            </a>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{video.channelTitle} • {video.subscriberCount.toLocaleString()} subs</p>

            <div className="flex items-start gap-2 bg-gray-100 dark:bg-gray-800/50 p-2 rounded text-[10px] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800">
                <Info size={12} className="mt-0.5 text-purple-500 dark:text-purple-400 flex-shrink-0" />
                <p className="italic leading-relaxed line-clamp-2">{video.explanation}</p>
            </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-gray-500 text-xs">
            <div className="flex gap-3">
                <span className="flex items-center gap-1"><Play size={10} /> {video.viewCount.toLocaleString()}</span>
                <span className="flex items-center gap-1"><ThumbsUp size={10} /> {video.likeCount.toLocaleString()}</span>
            </div>
            {isHiring && (
                 <button 
                    onClick={handleApplyClick}
                    className="text-xs bg-purple-100 dark:bg-purple-600/20 hover:bg-purple-600 text-purple-600 dark:text-purple-300 hover:text-white px-2 py-1 rounded transition-colors flex items-center gap-1"
                >
                    <Briefcase size={10} /> {t.apply}
                </button>
            )}
        </div>
      </div>
    </div>
  );
};