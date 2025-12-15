import { GoogleGenAI, Type, Schema, Chat } from "@google/genai";
import { YouTubeVideo, HNStory, EnrichedVideo, EnrichedStory, Category, ImageGenerationConfig, Language } from '../types';

// Initialize Gemini Client
// We use a getter or loose initialization to prevent crashing if API_KEY is missing during module load in dev
const getAiClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
};

const ANALYSIS_MODEL = "gemini-2.5-flash";
const IMAGE_MODEL = "gemini-3-pro-image-preview";
const CHAT_MODEL = "gemini-2.5-flash";

// Helper to calculate Reach Metric
const calculateReachMetric = (video: YouTubeVideo): number => {
  const baseScore = (video.viewCount * 0.001) + (video.likeCount * 0.5) + (video.commentCount * 1.0);
  const normalized = Math.min(Math.floor(baseScore), 999);
  const modifier = Math.floor(Math.random() * 50); 
  return normalized + modifier;
};

// Helper for HN Score
const calculateStoryReach = (story: HNStory): number => {
    return Math.min(story.score * 2 + Math.floor(Math.random() * 20), 999);
};

// Common logic to parse category from loose string
const parseCategory = (returnedCat: string | undefined): Category => {
    let category = Category.UNCATEGORIZED;
    if (!returnedCat) return category;

    const values = Object.values(Category);
    const matched = values.find(v => v.toLowerCase() === returnedCat.toLowerCase()) || 
                    values.find(v => returnedCat.toLowerCase().includes(v.toLowerCase().split(' ')[0]));
    
    if (matched) category = matched;
    return category;
};

export const analyzeVideoBatch = async (videos: YouTubeVideo[], language: Language = 'en'): Promise<EnrichedVideo[]> => {
  const ai = getAiClient();
  if (!ai) {
    return videos.map(v => ({
      ...v,
      category: Category.CORE_TECH,
      predictedScore: calculateReachMetric(v),
      explanation: "Mock analysis (No API Key).",
      isMotivatorPost: v.subscriberCount < 10000,
      contentType: 'video' as const
    }));
  }
  
  const promises = videos.map(async (video) => {
    try {
      const safeTitle = video.title.replace(/"/g, "'");
      const safeDesc = video.description.substring(0, 400).replace(/"/g, "'");

      const prompt = `
        Perform a comprehensive Multi-Stage Content Analysis on this video metadata.
        
        Input Data:
        - Title: "${safeTitle}"
        - Channel: "${video.channelTitle}"
        - Description: "${safeDesc}..."
        
        Tasks:
        1. Identify the semantic cluster.
        2. Map to one of the 7 allowed categories.
        3. Generate a concise "Why" explanation in the **${language}** language.

        Return JSON.
      `;

      const response = await ai.models.generateContent({
        model: ANALYSIS_MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              cluster: { type: Type.STRING },
              category: { type: Type.STRING },
              explanation: { type: Type.STRING, description: `Reasoning in ${language}` }
            },
            required: ["cluster", "category", "explanation"]
          } as Schema
        }
      });

      const result = JSON.parse(response.text || "{}");
      const category = parseCategory(result.category);
      const isMotivatorPost = (video.subscriberCount || 0) < 10000;

      return {
        ...video,
        category,
        predictedScore: calculateReachMetric(video),
        explanation: result.explanation || "Analysis failed.",
        isMotivatorPost,
        contentType: 'video' as const
      };

    } catch (error) {
      console.error(`Failed to analyze video ${video.id}`, error);
      return {
        ...video,
        category: Category.UNCATEGORIZED,
        predictedScore: calculateReachMetric(video),
        explanation: "AI Analysis unavailable.",
        isMotivatorPost: (video.subscriberCount || 0) < 10000,
        contentType: 'video' as const
      };
    }
  });

  return Promise.all(promises);
};

export const analyzeStoryBatch = async (stories: HNStory[], language: Language = 'en'): Promise<EnrichedStory[]> => {
    const ai = getAiClient();
    if (!ai) {
        return stories.map(s => ({
            ...s,
            category: Category.CORE_TECH,
            predictedScore: calculateStoryReach(s),
            explanation: "Mock HN Analysis.",
            isMotivatorPost: (s.authorKarma || 0) < 500,
            contentType: 'story' as const
        }));
    }

    const promises = stories.map(async (story) => {
        try {
            const safeTitle = story.title.replace(/"/g, "'");
            const prompt = `
            Perform Semantic Clustering and Classification on this technical news story.
            
            Input Data:
            - Title: "${safeTitle}"
            - URL: "${story.url || 'No URL'}"
            
            Tasks:
            1. Identify semantic cluster.
            2. Map to one of the 7 allowed categories.
            3. Generate a concise "Why" explanation in the **${language}** language.
    
            Return JSON.
            `;
    
            const response = await ai.models.generateContent({
                model: ANALYSIS_MODEL,
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            category: { type: Type.STRING },
                            explanation: { type: Type.STRING, description: `Reasoning in ${language}` }
                        },
                        required: ["category", "explanation"]
                    } as Schema
                }
            });
    
            const result = JSON.parse(response.text || "{}");
            const category = parseCategory(result.category);
            const isMotivatorPost = (story.authorKarma || 0) < 1000 && story.score > 100;
    
            return {
                ...story,
                category,
                predictedScore: calculateStoryReach(story),
                explanation: result.explanation || "Text analysis",
                isMotivatorPost,
                contentType: 'story' as const
            };
        } catch (error) {
            return {
                ...story,
                category: Category.UNCATEGORIZED,
                predictedScore: calculateStoryReach(story),
                explanation: "Analysis failed",
                isMotivatorPost: false,
                contentType: 'story' as const
            };
        }
    });
    
    return Promise.all(promises);
};

// Chatbot functionality
export const createChatSession = (): Chat | null => {
    const ai = getAiClient();
    if (!ai) return null;
    
    return ai.chats.create({
        model: CHAT_MODEL,
        config: {
            systemInstruction: "You are an intelligent assistant for the Sawariya Outreach dashboard. You help users analyze trends, understand metrics, and find insights from the dashboard data. Be concise, professional, and helpful."
        }
    });
};

export const generateImage = async (config: ImageGenerationConfig): Promise<string | null> => {
  const ai = getAiClient();
  if (!ai) throw new Error("API Key missing");

  try {
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: {
        parts: [{ text: config.prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: config.aspectRatio,
          imageSize: config.imageSize
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed:", error);
    throw error;
  }
};