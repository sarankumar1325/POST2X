// User types
export interface User {
  id: string;
  clerk_id: string;
  email: string;
  username?: string;
  credits: number;
  created_at: Date;
}

// Content analysis types
export interface ContentScores {
  virality: number;
  hook: number;
  clarity: number;
  breadth: number;
  tension: number;
  reply: number;
}

export interface TargetGroup {
  age: string;
  profession: string;
  interests: string[];
  sentiment: string;
}

export interface Suggestion {
  id: number;
  text: string;
  impact: string;
  type: 'context' | 'tension' | 'clarity' | 'hook' | 'engagement';
}

export interface AnalysisResult {
  scores: ContentScores;
  targetGroup: TargetGroup;
  controversiality: 'Safe & Broad' | 'Niche & Safe' | 'Spicy & Broad' | 'Niche & Spicy';
  suggestions: Suggestion[];
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  virality_score?: number;
  hook_score?: number;
  clarity_score?: number;
  breadth_score?: number;
  tension_score?: number;
  reply_score?: number;
  target_age?: string;
  target_profession?: string;
  target_interests?: string[];
  target_sentiment?: string;
  controversiality?: string;
  suggestions?: Suggestion[];
  created_at: Date;
}

// Daily ideas types
export interface DailyIdea {
  id: string;
  content: string;
  author_name: string;
  category?: string;
  created_at: Date;
  timeAgo?: string;
}

// API Response types
export interface AnalyzeResponse extends AnalysisResult {}

export interface DailyIdeasResponse {
  ideas: DailyIdea[];
}

// Component prop types
export interface ScoreCardProps {
  title: string;
  score: number;
  maxScore?: number;
  color?: 'orange' | 'blue' | 'green';
  className?: string;
}

export interface RadarChartData {
  subject: string;
  score: number;
  fullMark: 100;
}
