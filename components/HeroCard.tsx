import React from 'react';
import { EnrichedVideo, Category, Language } from '../types';
import { TrendingUp, Briefcase, Play, Star, Eye } from 'lucide-react';
import { logAction } from '../services/analyticsService';
import { TRANSLATIONS } from '../constants/translations';

interface HeroCardProps {
  video: EnrichedVideo;
  language: Language;
}

export const HeroCard: React.FC<HeroCardProps> = ({ video, language }) => {
  const t = TRANSLATIONS[language];
  const isHiring = video.category === Category.TALENT_ACQ || video.category === Category.JOB_SEEKER;

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    logAction('click_apply', parseInt(video.id.replace(/\D/g, '')) || 0);
    window.open(video.url, '_blank');
  };

  return (
    <div className="animate-fade-in-up relative h-[400px] md:h-[450px] w-full rounded-2xl overflow-hidden group shadow-2xl ring-1 ring-black/5 dark:ring-white/10 hover:ring-purple-500/50 transition-all duration-500">
      {/* Background Image */}
      <img 
        src={video.thumbnailUrl.replace('mqdefault', 'maxresdefault').replace('default', 'maxresdefault')} // Try to get higher res
        alt="Video Cover" 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform opacity-90 dark:opacity-60"
        onError={(e) => {
             // Fallback if maxres doesn't exist
            (e.target as HTMLImageElement).src = video.thumbnailUrl; 
        }}
      />
      
      {/* Overlay Gradient (Dark Mode aware) */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent dark:from-[#0f1117] dark:via-[#0f1117]/60 dark:to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500"></div>

      {/* Badges Overlay */}
      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
         {video.isMotivatorPost && (
             <span className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-500 to-orange-600 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-orange-900/20 animate-pulse">
                <Star size={12} fill="currentColor" /> {t.discovery}
             </span>
         )}
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 transform transition-transform duration-500 group-hover:-translate-y-1">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                    <span className="px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded-md uppercase tracking-wider shadow-lg shadow-purple-900/20">
                        {video.category.split(' ')[0]}
                    </span>
                    <span className="flex items-center text-green-400 text-sm font-bold bg-black/60 px-2 py-1 rounded backdrop-blur-sm border border-white/10">
                        <TrendingUp size={14} className="mr-1" /> {video.predictedScore} {t.reach}
                    </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 leading-tight drop-shadow-lg line-clamp-2">
                    <a href={video.url} target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 transition-colors">
                        {video.title}
                    </a>
                </h2>

                <p className="text-gray-200 dark:text-gray-300 text-sm max-w-2xl mb-4 line-clamp-2">
                    {video.explanation}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-300 dark:text-gray-400 font-mono">
                    <span className="text-white font-bold">{video.channelTitle}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                    <span className="flex items-center gap-1"><Eye size={12}/> {video.viewCount.toLocaleString()} views</span>
                    <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                    <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                </div>
            </div>

            {/* Interactive Layer: Apply Button */}
            {isHiring ? (
                <button 
                    onClick={handleApplyClick}
                    className="flex items-center justify-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors shadow-xl whitespace-nowrap"
                >
                    <Briefcase size={18} />
                    {t.applyNow}
                </button>
            ) : (
                <a 
                    href={video.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/20 px-6 py-3 rounded-full font-bold hover:bg-white/20 transition-colors shadow-xl whitespace-nowrap"
                >
                    <Play size={18} fill="currentColor" /> {t.watchVideo}
                </a>
            )}
        </div>
      </div>
    </div>
  );
};