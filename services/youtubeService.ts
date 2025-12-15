import { YouTubeVideo } from '../types';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Mock data generator for fallback/demo
const generateMockVideo = (id: string, index: number): YouTubeVideo => {
  const topics = [
    "AI Agents Tutorial", "Startup Hiring Spree", "B2B Sales Strategy", 
    "Python for Data Science", "Career Advice 2025", "Tech Leadership Principles", 
    "Hot Take: React is Dead"
  ];
  const channels = ["TechFlow", "StartupGrind", "CareerKarma", "IndieHacker", "CodeMaster", "BizInsider"];
  
  const isSmallCreator = Math.random() > 0.7;
  const subscriberCount = isSmallCreator ? Math.floor(Math.random() * 9000) + 100 : Math.floor(Math.random() * 500000) + 10000;
  
  // STRICT DATE GENERATION: Ensure mock date is within the last 7 days
  const now = Date.now();
  const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000;
  const sevenDaysAgo = now - sevenDaysInMillis;
  const randomTime = sevenDaysAgo + Math.floor(Math.random() * sevenDaysInMillis);

  const topic = topics[index % topics.length];

  return {
    id: `mock_${id}_${index}`, // Use clear mock prefix
    title: `${topic} - Deep Dive #${index}`,
    description: "In this video we explore the latest trends in technology and business. Learn how to leverage these insights for your career.",
    thumbnailUrl: `https://picsum.photos/seed/${id}${index}/640/360`,
    channelTitle: channels[index % channels.length],
    publishedAt: new Date(randomTime).toISOString(),
    viewCount: Math.floor(Math.random() * 50000) + 1000,
    likeCount: Math.floor(Math.random() * 2000) + 50,
    commentCount: Math.floor(Math.random() * 200) + 10,
    subscriberCount,
    // CRITICAL FIX: Use search URL to prevent linking to old/arbitrary videos
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}`
  };
};

export const fetchTrendingVideos = async (): Promise<YouTubeVideo[]> => {
  // STRICT Time Window Calculation
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const publishedAfter = sevenDaysAgo.toISOString();

  if (!YOUTUBE_API_KEY) {
    console.warn("YouTube API Key not found. Using Mock Data.");
    return Array.from({ length: 30 }, (_, i) => generateMockVideo('mock', i));
  }

  try {
    // 1. Search for Recent Videos (Last 7 Days)
    // Refined query to exclude music/gaming and focus on professional/tech content
    const query = "(AI OR Technology OR Startup OR Career OR Marketing OR Leadership OR Business) -music -gameplay -minecraft -fortnite";
    
    const searchRes = await fetch(
      `${BASE_URL}/search?part=id&order=viewCount&publishedAfter=${publishedAfter}&type=video&maxResults=30&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!searchRes.ok) throw new Error('YouTube API search request failed');
    
    const searchData = await searchRes.json();
    const items = searchData.items || [];
    
    if (items.length === 0) return [];

    const videoIds = items.map((item: any) => item.id.videoId).join(',');
    if (!videoIds) return [];

    // 2. Fetch Video Details (Snippet & Statistics)
    const videosRes = await fetch(
      `${BASE_URL}/videos?part=snippet,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    );
    const videoData = await videosRes.json();
    const videoItems = videoData.items || [];

    if (videoItems.length === 0) return [];

    // 3. Fetch Channel Details (for Subscriber Count)
    const channelIds = [...new Set(videoItems.map((v: any) => v.snippet.channelId))].join(',');
    const channelRes = await fetch(
      `${BASE_URL}/channels?part=statistics&id=${channelIds}&key=${YOUTUBE_API_KEY}`
    );
    const channelDataRes = await channelRes.json();
    const channelMap = new Map();
    channelDataRes.items?.forEach((c: any) => {
      channelMap.set(c.id, parseInt(c.statistics.subscriberCount));
    });

    // 4. Map and STRICTLY FILTER by date
    // Even though we asked for publishedAfter, we verify client-side to be 100% sure
    const validVideos: YouTubeVideo[] = videoItems
      .map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        viewCount: parseInt(item.statistics.viewCount),
        likeCount: parseInt(item.statistics.likeCount),
        commentCount: parseInt(item.statistics.commentCount),
        subscriberCount: channelMap.get(item.snippet.channelId) || 0,
        url: `https://www.youtube.com/watch?v=${item.id}`
      }))
      .filter((v: YouTubeVideo) => {
        const pubDate = new Date(v.publishedAt);
        return pubDate >= sevenDaysAgo;
      });

    return validVideos;

  } catch (error) {
    console.error("Failed to fetch YouTube data:", error);
    // Fallback to mock data on error, ensuring mock data is also fresh
    return Array.from({ length: 30 }, (_, i) => generateMockVideo('fallback', i));
  }
};