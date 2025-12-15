import React, { useEffect, useState } from 'react';
import { EnrichedContent, EnrichedVideo, Category, NavTab, User, UserPreferences } from './types';
import { fetchTrendingVideos } from './services/youtubeService';
import { fetchTopStories } from './services/hnService';
import { analyzeVideoBatch, analyzeStoryBatch } from './services/geminiService';
import { ImageGenerator } from './components/ImageGenerator';
import { AuthPage } from './components/AuthPage';
import { Navbar } from './components/Navbar';
import { HeroCard } from './components/HeroCard';
import { CategorySection } from './components/CategorySection';
import { Onboarding } from './components/Onboarding';
import { UserDashboard } from './components/UserDashboard';
import { Chatbot } from './components/Chatbot';
import { TRANSLATIONS } from './constants/translations';
import { Loader2, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  // Auth & User State
  const [user, setUser] = useState<User | null>(null);

  // App View State
  const [currentView, setCurrentView] = useState<'home' | 'studio' | 'dashboard'>('home');
  const [activeTab, setActiveTab] = useState<NavTab>('All');
  
  // Data State
  const [content, setContent] = useState<EnrichedContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Theme Effect
  useEffect(() => {
    if (user?.preferences?.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [user?.preferences?.theme]);

  // Data Loading Effect
  useEffect(() => {
    if (!user || !user.onboardingComplete) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      const language = user.preferences?.language || 'en';

      try {
        const [rawVideos, rawStories] = await Promise.all([
            fetchTrendingVideos(),
            fetchTopStories(15)
        ]);

        const [analyzedVideos, analyzedStories] = await Promise.all([
            analyzeVideoBatch(rawVideos, language),
            analyzeStoryBatch(rawStories, language)
        ]);

        // Filter based on user interests if available
        let combined = [...analyzedVideos, ...analyzedStories];
        
        // Optionally filter by preferences here, or just prioritize them
        // For now, we show everything but sorted by score
        combined = combined.sort((a, b) => b.predictedScore - a.predictedScore);
        
        setContent(combined);

      } catch (err) {
        console.error(err);
        setError("Failed to load trending intelligence.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.onboardingComplete, user?.preferences?.language]); // Reload if language changes

  const handleUpdatePreferences = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const handleOnboardingComplete = (prefs: UserPreferences) => {
    handleUpdatePreferences({
        preferences: prefs,
        onboardingComplete: true
    });
  };

  // --- Views ---

  const DashboardView = () => {
    const t = TRANSLATIONS[user?.preferences?.language || 'en'];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-gray-500 dark:text-gray-400 animate-pulse">
                <Loader2 size={48} className="animate-spin mb-4 text-purple-500" />
                <p>{t.generating}</p>
            </div>
        );
    }

    if (!content.length && !loading) {
        return (
             <div className="text-center py-20 bg-gray-100 dark:bg-gray-800/30 rounded-3xl border border-dashed border-gray-300 dark:border-gray-800 m-4 animate-fade-in-up">
                <h3 className="text-xl text-gray-600 dark:text-gray-400">{t.noContent}</h3>
            </div>
        );
    }

    // Explicitly find a video for the hero section
    const heroVideo = content.find((c): c is EnrichedVideo => c.contentType === 'video');
    
    // Group by Category
    const categoryGroups = Object.values(Category).map(cat => ({
        category: cat,
        items: content.filter(c => c.category === cat)
    }));

    return (
        <div className="w-full space-y-8">
            {heroVideo && (
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-4 px-2">
                        <Sparkles className="text-purple-500 dark:text-purple-400" size={18} />
                        <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{t.highestSignal}</h2>
                    </div>
                    <HeroCard video={heroVideo} language={user?.preferences?.language || 'en'} />
                </div>
            )}

            <div className="space-y-4">
                {categoryGroups.map((group) => (
                    <CategorySection 
                        key={group.category} 
                        category={group.category} 
                        items={group.items} 
                        language={user?.preferences?.language || 'en'}
                    />
                ))}
            </div>
        </div>
    );
  };

  // --- Main Render Logic ---

  if (!user) {
    return <AuthPage onLogin={(u) => setUser(u)} />;
  }

  if (!user.onboardingComplete) {
      return <Onboarding onComplete={handleOnboardingComplete} initialName={user.name} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <Navbar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onNavigate={setCurrentView}
        onLogout={() => setUser(null)}
        user={user}
      />

      <main className="max-w-[1600px] mx-auto px-4 md:px-6 py-8 min-h-[calc(100vh-64px)]">
        {currentView === 'studio' && (
            <div className="animate-in slide-in-from-right duration-500">
                 <div className="flex items-center gap-2 mb-6">
                    <button 
                        onClick={() => setCurrentView('home')}
                        className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                    >
                        Home
                    </button>
                    <span className="text-gray-400">/</span>
                    <span className="font-medium">Studio</span>
                 </div>
                <ImageGenerator />
            </div>
        )}
        
        {currentView === 'dashboard' && (
             <UserDashboard 
                user={user} 
                onUpdatePreferences={handleUpdatePreferences} 
                onLogout={() => setUser(null)} 
             />
        )}

        {currentView === 'home' && <DashboardView />}
      </main>

      <Chatbot language={user.preferences?.language || 'en'} />
    </div>
  );
};

export default App;