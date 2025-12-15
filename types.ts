export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  subscriberCount: number; // For emerging user signal
  url: string;
}

export interface HNStory {
  id: number;
  title: string;
  url?: string;
  by: string;
  time: number;
  score: number;
  type: string;
  descendants?: number;
  kids?: number[];
  deleted?: boolean;
  dead?: boolean;
  authorKarma?: number;
}

export enum Category {
  CORE_TECH = "Core Tech (AI/ML/Data)",
  PRODUCT_DEV = "Product & Development",
  EXEC_STRATEGY = "Executive Strategy & Leadership",
  TALENT_ACQ = "Talent Acquisition (Hiring)",
  JOB_SEEKER = "Job Seeker/Career Growth",
  B2B_SALES = "B2B Marketing & Sales",
  OPINION = "Opinion/Hot Take",
  UNCATEGORIZED = "Uncategorized"
}

export interface EnrichedVideo extends YouTubeVideo {
  category: Category;
  predictedScore: number;
  explanation: string;
  isMotivatorPost: boolean;
  contentType: 'video';
}

export interface EnrichedStory extends HNStory {
  category: Category;
  predictedScore: number;
  explanation: string;
  isMotivatorPost: boolean;
  contentType: 'story';
}

export type EnrichedContent = EnrichedVideo | EnrichedStory;

export type AspectRatio = "1:1" | "2:3" | "3:2" | "3:4" | "4:3" | "9:16" | "16:9" | "21:9";
export type ImageSize = "1K" | "2K" | "4K";

export interface ImageGenerationConfig {
  prompt: string;
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
}

export type NavTab = 'All' | 'Technical' | 'Non-Technical' | 'Open-Hiring' | 'Entertainment' | 'Artificial Intelligence';

export type Language = 'en' | 'hi' | 'es' | 'fr' | 'de';
export type Theme = 'light' | 'dark';

export interface UserPreferences {
  language: Language;
  interestedCategories: Category[];
  theme: Theme;
}

export interface User {
  name: string;
  email: string;
  preferences?: UserPreferences;
  onboardingComplete?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}