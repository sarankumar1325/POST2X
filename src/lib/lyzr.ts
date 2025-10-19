import { AnalysisResult, DailyIdea } from '@/types';

const RAW_LYZR_KEY = process.env.LYZR_API_KEY;
const LYZR_OFFLINE = process.env.LYZR_OFFLINE === '1' || process.env.LYZR_OFFLINE === 'true';

// Agent IDs for inference
const AGENT_IDS = {
  CONTENT_ANALYZER: '68bc42b8cc9c7b45bbcc0fcb',
  CONTENT_RANKER: '68bc43a723454f14b14b1c3b',
  CONTENT_GEN: '68bc43a723454f14b14b1c3b'
};

const LYZR_INFERENCE_API = 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/';
const LYZR_API_KEY = process.env.LYZR_API_KEY || '';
const USER_ID = process.env.LYZR_USER_ID || 'anonymous';

// Runtime validation for missing API key
if (process.env.NODE_ENV !== 'test' && !process.env.LYZR_API_KEY) {
  console.warn('LYZR_API_KEY not set; Lyzr calls will fail');
}

function lyzrKeyLooksConfigured(key?: string) {
  // Treat placeholders or demo keys as not configured
  return !!key && !/your_|_here$|^demo_key$/.test(key);
}

if (!lyzrKeyLooksConfigured(RAW_LYZR_KEY) || LYZR_OFFLINE) {
  console.warn('LYZR_API_KEY not configured or offline mode enabled - using mock responses');
}

const LYZR_API_BASE = process.env.LYZR_API_BASE || 'https://api.lyzr.ai'; // Replace with actual Lyzr API URL

// Mock data for development
const mockAnalysisResult: AnalysisResult = {
  scores: {
    virality: 49,
    hook: 29,
    clarity: 75,
    breadth: 68,
    tension: 42,
    reply: 46
  },
  targetGroup: {
    age: '25-34',
    profession: 'Tech Professional',
    interests: ['Technology', 'Productivity', 'Career Growth'],
    sentiment: 'Optimistic'
  },
  controversiality: 'Safe & Broad',
  suggestions: [
    {
      id: 1,
      text: 'Add a compelling hook at the beginning to grab attention immediately. Start with a question or bold statement.',
      impact: '+3-7',
      type: 'hook'
    },
    {
      id: 2,
      text: 'Include more specific examples or data points to increase credibility and engagement.',
      impact: '+4-6',
      type: 'context'
    },
    {
      id: 3,
      text: 'Create more tension by presenting a problem or challenge that needs solving.',
      impact: '+3-5',
      type: 'tension'
    },
    {
      id: 4,
      text: 'Make your language more conversational and relatable to your target audience.',
      impact: '+2-4',
      type: 'clarity'
    },
    {
      id: 5,
      text: 'End with a clear call-to-action or question to encourage replies and engagement.',
      impact: '+5-8',
      type: 'engagement'
    }
  ]
};

const mockTrendingIdeas: DailyIdea[] = [
  {
    id: 'trend_1',
    content: 'Just shipped my first AI-powered app using @vercel and @openai. The developer experience is incredible - went from idea to production in under 24 hours. What\'s your go-to stack for rapid prototyping? #AI #WebDev #IndieHacker',
    author_name: 'Community Trend',
    category: 'AI',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    timeAgo: '2h'
  },
  {
    id: 'trend_2',
    content: 'The future of coding is here: GitHub Copilot just wrote 70% of my React component. But here\'s the real game-changer - understanding when NOT to use AI. Sometimes the best code is the one you write yourself. #Programming #AI #Tech',
    author_name: 'Community Trend',
    category: 'Programming',
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    timeAgo: '4h'
  },
  {
    id: 'trend_3',
    content: 'From $0 to $10k MRR in 6 months. The secret? Building in public, consistent content, and actually talking to your users. No fancy marketing hacks, just real conversations. #Startups #SaaS #IndieDev',
    author_name: 'Community Trend',
    category: 'Startups',
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    timeAgo: '6h'
  },
  {
    id: 'trend_4',
    content: 'Productivity hack: Delete social media from your phone. Use the web versions only. You\'ll be shocked how much time you get back. Bonus: Better focus, deeper work, more meaningful connections. #Productivity #LifeHacks',
    author_name: 'Community Trend',
    category: 'Productivity',
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    timeAgo: '8h'
  },
  {
    id: 'trend_5',
    content: 'The AI revolution isn\'t coming. It\'s here. Last week I automated my entire content workflow with @anthropic Claude. Writing, editing, scheduling - all handled. What\'s the most impactful AI tool you\'ve adopted? #AI #Automation #FutureOfWork',
    author_name: 'Community Trend',
    category: 'AI',
    created_at: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
    timeAgo: '10h'
  }
];

// Helper function to parse Lyzr agent response
function parseLyzrAnalysisResponse(data: { response?: string; message?: string; [key: string]: unknown }): AnalysisResult {
  try {
    // The response from Lyzr comes in data.response or data.message
    const responseText = data.response || data.message || '';
    
    // Try to extract JSON if the response contains structured data
    let parsedData: Record<string, unknown> = {};
    
    // Look for JSON in the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsedData = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
      } catch {
        console.warn('Could not parse JSON from response, using text analysis');
      }
    }
    
    // Extract scores (look for numbers between 0-100)
    const scorePatterns = {
      virality: /virality[:\s]+(\d+)/i,
      hook: /hook[:\s]+(\d+)/i,
      clarity: /clarity[:\s]+(\d+)/i,
      breadth: /breadth[:\s]+(\d+)/i,
      tension: /tension[:\s]+(\d+)/i,
      reply: /reply[:\s]+(\d+)/i
    };
    
    const scores: Record<string, number> = {};
    for (const [key, pattern] of Object.entries(scorePatterns)) {
      const match = responseText.match(pattern);
      const parsedScores = parsedData.scores as Record<string, number> | undefined;
      scores[key] = match ? parseInt(match[1]) : parsedScores?.[key] || Math.floor(Math.random() * 40) + 40;
    }
    
    // Extract target audience
    const ageMatch = responseText.match(/age[:\s]+([0-9-]+)/i);
    const professionMatch = responseText.match(/profession[:\s]+([^,\n]+)/i);
    
    // Extract suggestions (look for numbered lists or bullet points)
    const suggestionMatches = responseText.match(/(?:\d+\.|[-•])\s*([^\n]+)/g) || [];
    const suggestions = suggestionMatches.slice(0, 5).map((text: string, index: number) => {
      const types: Array<'hook' | 'context' | 'tension' | 'clarity' | 'engagement'> = ['hook', 'context', 'tension', 'clarity', 'engagement'];
      return {
        id: index + 1,
        text: text.replace(/^\d+\.\s*|^[-•]\s*/, '').trim(),
        impact: `+${Math.floor(Math.random() * 6) + 2}-${Math.floor(Math.random() * 4) + 5}`,
        type: types[index] || 'engagement'
      };
    });
    
    const targetGroup = parsedData.targetGroup as { age?: string; profession?: string; interests?: string[]; sentiment?: string } | undefined;
    const controversialityValue = parsedData.controversiality as string | undefined;
    const validControversiality: 'Safe & Broad' | 'Niche & Safe' | 'Spicy & Broad' | 'Niche & Spicy' = 
      (controversialityValue === 'Niche & Safe' || controversialityValue === 'Spicy & Broad' || controversialityValue === 'Niche & Spicy') 
        ? controversialityValue 
        : 'Safe & Broad';
    
    return {
      scores: {
        virality: scores.virality,
        hook: scores.hook,
        clarity: scores.clarity,
        breadth: scores.breadth,
        tension: scores.tension,
        reply: scores.reply
      },
      targetGroup: {
        age: ageMatch?.[1] || targetGroup?.age || '25-34',
        profession: professionMatch?.[1]?.trim() || targetGroup?.profession || 'Tech Professional',
        interests: targetGroup?.interests || ['Technology', 'Social Media', 'Content Creation'],
        sentiment: targetGroup?.sentiment || 'Neutral'
      },
      controversiality: validControversiality,
      suggestions: suggestions.length > 0 ? suggestions : mockAnalysisResult.suggestions
    };
  } catch (error) {
    console.error('Error parsing Lyzr response:', error);
    return mockAnalysisResult;
  }
}

export async function analyzeContent(content: string): Promise<AnalysisResult> {
  try {
    // Generate unique session ID
    const sessionId = `${AGENT_IDS.CONTENT_ANALYZER}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Call Lyzr Content Analyzer Agent
    const response = await fetch(LYZR_INFERENCE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': LYZR_API_KEY
      },
      body: JSON.stringify({
        user_id: USER_ID,
        agent_id: AGENT_IDS.CONTENT_ANALYZER,
        session_id: sessionId,
        message: `Analyze this social media content for virality, engagement, and audience insights. Provide scores (0-100) for: virality, hook, clarity, breadth, tension, and reply potential. Also identify target audience (age, profession, interests, sentiment), controversiality level, and 5 specific improvement suggestions with impact estimates. Content: "${content}"`
      })
    });

    if (!response.ok) {
      throw new Error(`Lyzr API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Parse the AI response to extract structured data
    return parseLyzrAnalysisResponse(data);
  } catch (error) {
    console.error('Error calling Lyzr Content Analyzer:', error);
    // Fallback to mock data on error
    console.warn('Falling back to mock analysis data');
    return {
      ...mockAnalysisResult,
      scores: {
        virality: Math.floor(Math.random() * 40) + 30,
        hook: Math.floor(Math.random() * 50) + 20,
        clarity: Math.floor(Math.random() * 30) + 60,
        breadth: Math.floor(Math.random() * 40) + 40,
        tension: Math.floor(Math.random() * 60) + 20,
        reply: Math.floor(Math.random() * 50) + 25
      }
    };
  }
}

export async function generateDailyIdeas(count: number = 10): Promise<DailyIdea[]> {
  // If no valid API key or offline, return mock trending data
  if (!lyzrKeyLooksConfigured(RAW_LYZR_KEY) || LYZR_OFFLINE) {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
    return mockTrendingIdeas.slice(0, count);
  }

  try {
    const response = await fetch(`${LYZR_API_BASE}/sonar/trending-tweets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RAW_LYZR_KEY}`
      },
      body: JSON.stringify({
        count,
        platform: 'twitter',
        communities: ['tech', 'programming', 'startups', 'ai', 'productivity'],
        timeframe: '24h',
        min_engagement: 100,
        model: 'sonar-pro',
        include_metrics: true
      })
    });

    if (!response.ok) {
      throw new Error(`Lyzr Sonar API error: ${response.status}`);
    }

    const data = await response.json();
    return transformTrendingResponse(data);
  } catch (error) {
    console.error('Error fetching trending tweets:', error);
    // Fallback to mock data
    return mockTrendingIdeas.slice(0, count);
  }
}

// Helper function to transform Lyzr API response to our format
function transformLyzrResponse(lyzrData: Record<string, unknown>): AnalysisResult {
  const scores = lyzrData.scores as Record<string, number> | undefined;
  const targetGroup = lyzrData.target_group as { age?: string; profession?: string; interests?: string[]; sentiment?: string } | undefined;
  const suggestions = lyzrData.suggestions as Array<{ id: number; text: string; impact: string; type: 'hook' | 'context' | 'tension' | 'clarity' | 'engagement' }> | undefined;
  
  return {
    scores: {
      virality: scores?.virality || 50,
      hook: scores?.hook || 50,
      clarity: scores?.clarity || 50,
      breadth: scores?.breadth || 50,
      tension: scores?.tension || 50,
      reply: scores?.reply || 50
    },
    targetGroup: {
      age: targetGroup?.age || '25-34',
      profession: targetGroup?.profession || 'General',
      interests: targetGroup?.interests || ['Technology'],
      sentiment: targetGroup?.sentiment || 'Neutral'
    },
    controversiality: (lyzrData.controversiality as 'Safe & Broad' | 'Niche & Safe' | 'Spicy & Broad' | 'Niche & Spicy') || 'Safe & Broad',
    suggestions: suggestions || []
  };
}

function transformTrendingResponse(lyzrData: Record<string, unknown>): DailyIdea[] {
  const trends = lyzrData.trends as Array<Record<string, unknown>> | undefined;
  
  return trends?.map((trend: Record<string, unknown>, index: number) => ({
    id: `sonar_${Date.now()}_${index}`,
    content: (trend.content as string) || (trend.text as string) || '',
    author_name: 'Community Trend',
    category: (trend.category as string) || (trend.community as string) || 'Trending',
    created_at: new Date((trend.timestamp as number) || Date.now() - Math.random() * 24 * 60 * 60 * 1000),
    timeAgo: (trend.timeAgo as string) || `${Math.floor(Math.random() * 24) + 1}h`
  })) || mockTrendingIdeas;
}

// Inference functions for Lyzr agents
export async function analyzeContentWithAgent(content: string): Promise<AnalysisResult> {
  if (LYZR_OFFLINE) {
    console.log('LYZR offline mode - using mock analysis');
    return mockAnalysisResult;
  }

  try {
    const sessionId = `${AGENT_IDS.CONTENT_ANALYZER}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const response = await fetch(LYZR_INFERENCE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': LYZR_API_KEY
      },
      body: JSON.stringify({
        user_id: USER_ID,
        agent_id: AGENT_IDS.CONTENT_ANALYZER,
        session_id: sessionId,
        message: `Analyze this social media content for virality, engagement, and audience insights: "${content}"`
      })
    });

    if (!response.ok) {
      throw new Error(`Lyzr API error: ${response.status}`);
    }

    const data = await response.json();

    // Parse the structured output from the agent
    try {
      const parsedOutput = JSON.parse(data.response || data.message || '{}');
      return transformLyzrResponse(parsedOutput);
    } catch (parseError) {
      console.error('Error parsing agent response:', parseError);
      return mockAnalysisResult;
    }
  } catch (error) {
    console.error('Error calling Content Analyzer Agent:', error);
    return mockAnalysisResult;
  }
}

interface RankingResult {
  rankings: Array<{
    rank: number;
    content_id: string;
    overall_score: number;
    breakdown: {
      virality: number;
      engagement: number;
      reach: number;
    };
    strengths: string[];
    platform_fit: string;
  }>;
  comparison: {
    top_performer: string;
    key_differentiators: string[];
    optimization_opportunities: string[];
  };
}

interface GenerationResult {
  generated_content: {
    type: string;
    platform: string;
    content: string;
    hashtags: string[];
    trending_topics: string[];
    engagement_prediction: number;
    trend_sources: string[];
    publish_suggestion: string;
  };
  metadata: {
    generation_time: string;
    trend_freshness: number;
    data_sources: string[];
    confidence_score: number;
  };
}

export async function rankContentWithAgent(contents: string[]): Promise<RankingResult> {
  if (LYZR_OFFLINE) {
    console.log('LYZR offline mode - using mock ranking');
    return {
      rankings: contents.map((content, index) => ({
        rank: index + 1,
        content_id: `mock_${index}`,
        overall_score: Math.floor(Math.random() * 40) + 60,
        breakdown: {
          virality: Math.floor(Math.random() * 40) + 60,
          engagement: Math.floor(Math.random() * 40) + 60,
          reach: Math.floor(Math.random() * 40) + 60
        },
        strengths: ['Good structure', 'Clear message'],
        platform_fit: 'Twitter'
      })),
      comparison: {
        top_performer: 'mock_0',
        key_differentiators: ['Better hook', 'Clearer message'],
        optimization_opportunities: ['Add more tension', 'Include call to action']
      }
    };
  }

  try {
    const sessionId = `${AGENT_IDS.CONTENT_RANKER}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const contentList = contents.map((content, index) => `${index + 1}. "${content}"`).join('\n');

    const response = await fetch(LYZR_INFERENCE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': LYZR_API_KEY
      },
      body: JSON.stringify({
        user_id: USER_ID,
        agent_id: AGENT_IDS.CONTENT_RANKER,
        session_id: sessionId,
        message: `Rank and compare these content pieces by performance potential:\n${contentList}`
      })
    });

    if (!response.ok) {
      throw new Error(`Lyzr API error: ${response.status}`);
    }

    const data = await response.json();

    // Parse the structured output from the agent
    try {
      const parsedOutput = JSON.parse(data.response || data.message || '{}');
      return parsedOutput;
    } catch (parseError) {
      console.error('Error parsing ranker response:', parseError);
      return {
        rankings: contents.map((content, index) => ({
          rank: index + 1,
          content_id: `fallback_${index}`,
          overall_score: 75 - index * 10,
          breakdown: {
            virality: 75 - index * 10,
            engagement: 75 - index * 10,
            reach: 75 - index * 10
          },
          strengths: ['Fallback ranking'],
          platform_fit: 'General'
        })),
        comparison: {
          top_performer: 'fallback_0',
          key_differentiators: ['Fallback analysis'],
          optimization_opportunities: ['Fallback suggestions']
        }
      };
    }
  } catch (error) {
    console.error('Error calling Content Ranker Agent:', error);
    return {
      rankings: contents.map((content, index) => ({
        rank: index + 1,
        content_id: `error_${index}`,
        overall_score: 50,
        breakdown: { virality: 50, engagement: 50, reach: 50 },
        strengths: ['Error fallback'],
        platform_fit: 'Unknown'
      })),
      comparison: {
        top_performer: 'error_0',
        key_differentiators: ['Error occurred'],
        optimization_opportunities: ['Retry analysis']
      }
    };
  }
}

export async function generateContentWithAgent(prompt: string): Promise<GenerationResult> {
  if (LYZR_OFFLINE) {
    console.log('LYZR offline mode - using mock generation');
    return {
      generated_content: {
        type: 'post',
        platform: 'twitter',
        content: 'This is a mock generated post about trending topics in tech and AI.',
        hashtags: ['#AI', '#Tech', '#Innovation'],
        trending_topics: ['Artificial Intelligence', 'Machine Learning'],
        engagement_prediction: 75,
        trend_sources: ['Twitter Trends', 'Tech News'],
        publish_suggestion: 'Post during peak hours for maximum engagement'
      },
      metadata: {
        generation_time: new Date().toISOString(),
        trend_freshness: 2,
        data_sources: ['Real-time trends', 'Social media analytics'],
        confidence_score: 85
      }
    };
  }

  try {
    const sessionId = `${AGENT_IDS.CONTENT_GEN}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const response = await fetch(LYZR_INFERENCE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': LYZR_API_KEY
      },
      body: JSON.stringify({
        user_id: USER_ID,
        agent_id: AGENT_IDS.CONTENT_GEN,
        session_id: sessionId,
        message: `Generate engaging social media content based on this prompt: "${prompt}". Include current trends and make it optimized for maximum engagement.`
      })
    });

    if (!response.ok) {
      throw new Error(`Lyzr API error: ${response.status}`);
    }

    const data = await response.json();

    // Parse the structured output from the agent
    try {
      const parsedOutput = JSON.parse(data.response || data.message || '{}');
      return parsedOutput;
    } catch (parseError) {
      console.error('Error parsing generator response:', parseError);
      return {
        generated_content: {
          type: 'post',
          platform: 'twitter',
          content: data.response || data.message || 'Generated content placeholder',
          hashtags: ['#Content', '#SocialMedia'],
          trending_topics: ['Current trends'],
          engagement_prediction: 70,
          trend_sources: ['AI Generation'],
          publish_suggestion: 'Test and optimize based on audience response'
        },
        metadata: {
          generation_time: new Date().toISOString(),
          trend_freshness: 1,
          data_sources: ['AI Model'],
          confidence_score: 70
        }
      };
    }
  } catch (error) {
    console.error('Error calling Content Gen Agent:', error);
    return {
      generated_content: {
        type: 'post',
        platform: 'twitter',
        content: 'Error generating content. Please try again.',
        hashtags: ['#Error'],
        trending_topics: [],
        engagement_prediction: 0,
        trend_sources: [],
        publish_suggestion: 'Retry generation'
      },
      metadata: {
        generation_time: new Date().toISOString(),
        trend_freshness: 0,
        data_sources: ['Error'],
        confidence_score: 0
      }
    };
  }
}

// Helper function to get time ago string
export function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)}h`;
  } else {
    return `${Math.floor(diffInMinutes / 1440)}d`;
  }
}
