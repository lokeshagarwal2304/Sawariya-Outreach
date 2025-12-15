import { HNStory } from '../types';

const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

export const fetchTopStories = async (limit: number = 20): Promise<HNStory[]> => {
  try {
    // 1. Get Top Story IDs
    const response = await fetch(`${BASE_URL}/topstories.json`);
    if (!response.ok) throw new Error('Failed to fetch top stories');
    
    const ids: number[] = await response.json();
    // Fetch a slightly larger batch to account for filtering
    const topIds = ids.slice(0, limit * 2);

    // 2. Fetch Story Details
    const storyPromises = topIds.map(async (id) => {
      const storyRes = await fetch(`${BASE_URL}/item/${id}.json`);
      return storyRes.json();
    });

    const storiesRaw = await Promise.all(storyPromises);
    
    // STRICT TIME FILTER: Last 7 Days
    const sevenDaysAgoSeconds = Math.floor((Date.now() - (7 * 24 * 60 * 60 * 1000)) / 1000);

    const validStories = storiesRaw.filter((s): s is HNStory => 
        s && 
        s.type === 'story' && 
        !s.deleted && 
        !s.dead &&
        s.time >= sevenDaysAgoSeconds // Enforce 1 week window
    ).slice(0, limit);

    // 3. Fetch Author Details to get Karma (Emerging User Signal)
    const authorPromises = validStories.map(async (story) => {
      try {
        const userRes = await fetch(`${BASE_URL}/user/${story.by}.json`);
        const userData = await userRes.json();
        return {
          ...story,
          authorKarma: userData?.karma || 0
        };
      } catch (e) {
        console.warn(`Failed to fetch user data for ${story.by}`);
        return { ...story, authorKarma: 0 };
      }
    });

    const storiesWithAuthors = await Promise.all(authorPromises);
    return storiesWithAuthors;
    
  } catch (error) {
    console.error("Error fetching HN stories:", error);
    return [];
  }
};