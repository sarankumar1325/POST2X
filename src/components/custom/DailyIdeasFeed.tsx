'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DailyIdea } from '@/types';
import {
  RefreshCw,
  Sparkles,
  Clock,
  TrendingUp,
  Hash,
  Users,
  Flame
} from 'lucide-react';

interface DailyIdeasFeedProps {
  initialIdeas?: DailyIdea[];
}

export default function DailyIdeasFeed({ initialIdeas = [] }: DailyIdeasFeedProps) {
  const [ideas, setIdeas] = useState<DailyIdea[]>(initialIdeas);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load ideas on component mount if none provided
  useEffect(() => {
    if (ideas.length === 0) {
      loadIdeas();
    }
  }, []);

  const loadIdeas = async (refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await fetch(`/api/daily-ideas?${refresh ? 'refresh=true' : ''}`);
      const data = await response.json();

      if (response.ok) {
        setIdeas(data.ideas || []);
      } else {
        console.error('Failed to load ideas:', data.error);
      }
    } catch (error) {
      console.error('Error loading ideas:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadIdeas(true);
  };

  const handleGetInspired = (idea: DailyIdea) => {
    // TODO: Implement inspiration functionality (e.g., pre-fill analyzer)
    console.log('Get inspired by:', idea.content);
  };

  if (isLoading && ideas.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 bg-gray-900/50 border-gray-800">
            <div className="animate-pulse">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-24"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="glass-premium rounded-2xl p-6 border border-primary/10 backdrop-blur-xl card-premium">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary via-secondary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 float-premium">
              <TrendingUp className="h-6 w-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold gradient-text">Community Trends</h2>
              <p className="text-xs text-slate-400">Trending content from social media communities</p>
            </div>
          </div>

          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="glass border border-primary/20 text-white hover:bg-primary/10 px-4 py-2 rounded-xl transition-all hover:scale-105 btn-premium"
          >
            {isRefreshing ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            {isRefreshing ? 'Refreshing...' : 'Get Trends'}
          </Button>
        </div>
      </div>

      {/* Ideas Feed */}
      <div className="space-y-6">
        {ideas.length === 0 ? (
          <div className="glass-premium rounded-2xl p-12 border border-primary/10 text-center backdrop-blur-xl card-premium">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30 float-premium">
              <TrendingUp className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Discover What's Trending</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">Get real-time trending content from social communities to stay ahead of the conversation</p>
            <Button
              onClick={handleRefresh}
              className="btn-premium text-white font-semibold px-8 py-3 rounded-xl transform transition-all hover:scale-105"
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              Get Community Trends
            </Button>
          </div>
        ) : (
          ideas.map((idea, index) => (
            <div
              key={idea.id}
              className={`glass-premium rounded-2xl p-6 border border-primary/10 backdrop-blur-xl card-premium animate-[slide-up_0.5s_ease-out] animate-delay-${(index % 5 + 1) * 100}`}
            >
              {/* Trend Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                      <Hash className="h-5 w-5 text-white" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">Trending Topic</span>
                      <Flame className="h-4 w-4 text-secondary drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
                      <span className="text-xs bg-gradient-to-r from-secondary/20 to-primary/20 text-secondary px-2 py-0.5 rounded-full border border-secondary/30">
                        Hot 🔥
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Users className="h-3 w-3 text-accent" />
                      <span className="text-accent">Community</span>
                      <span className="text-muted">•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{idea.timeAgo || '2h ago'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {idea.category && (
                  <span className="text-xs glass px-3 py-1 rounded-full border border-accent/20 text-accent bg-accent/5">
                    #{idea.category}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl blur-xl"></div>
                <p className="relative text-slate-100 leading-relaxed whitespace-pre-wrap text-lg p-4 rounded-xl bg-white/5">
                  {idea.content}
                </p>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-between pt-4 border-t border-primary/10">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="glass px-3 py-1 rounded-lg border border-accent/20 bg-accent/5">
                      <div className="flex items-center gap-1.5">
                        <Flame className="h-4 w-4 text-accent" />
                        <span className="text-accent font-medium">Trending</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleGetInspired(idea)}
                  className="btn-premium text-white font-medium px-4 py-2 rounded-xl shadow-lg transform transition-all hover:scale-105"
                >
                  <Sparkles className="mr-2 h-4 w-4 drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]" />
                  Use This Trend
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {ideas.length > 0 && (
        <div className="text-center pt-6">
          <Button
            onClick={() => loadIdeas(true)}
            disabled={isRefreshing}
            className="glass-premium border border-primary/20 text-slate-300 hover:text-white hover:bg-primary/10 px-6 py-3 rounded-xl transition-all hover:scale-105 card-premium"
          >
            {isRefreshing ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Loading more trends...</span>
              </div>
            ) : (
              <span>Load More Trends</span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
