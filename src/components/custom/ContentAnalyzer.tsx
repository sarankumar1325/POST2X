'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { AnalysisResult } from '@/types';
import ScoreCards from './ScoreCards';
import SuggestionsList from './SuggestionsList';

interface ContentAnalyzerProps {
  onAnalysisComplete?: (result: AnalysisResult) => void;
}

export default function ContentAnalyzer({ onAnalysisComplete }: ContentAnalyzerProps) {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!content.trim()) {
      setError('Please enter some content to analyze');
      return;
    }

    if (content.length > 2000) {
      setError('Content must be less than 2000 characters');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze content');
      }

      setAnalysisResult(data);
      onAnalysisComplete?.(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setContent('');
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Input Section */}
      <div className="glass-premium rounded-2xl p-8 border border-yellow-500/10 backdrop-blur-xl card-premium">
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-cyan-500 rounded-full"></div>
              <label className="text-lg font-semibold text-white">
                Content to Analyze
              </label>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your social media content here to get AI-powered insights on virality, engagement, and target audience..."
                className="relative min-h-[150px] bg-white/5 border-yellow-500/20 text-white placeholder-gray-400 resize-none rounded-xl p-4 input-premium focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300"
                maxLength={2000}
              />
            </div>
            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-300 w-progress-${Math.round(Math.min((content.length / 2000) * 10, 10)) * 10}`}
                  />
                </div>
                <span className="text-sm text-gray-400">
                  {content.length}/2000
                </span>
              </div>
              {analysisResult && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>

          {error && (
            <div className="glass p-4 border border-red-500/20 bg-red-500/10 rounded-xl">
              <p className="text-red-400 text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            </div>
          )}

          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !content.trim()}
            className="w-full btn-premium text-white font-semibold py-6 rounded-xl transform transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isAnalyzing ? (
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-lg">Analyzing Content...</span>
              </div>
            ) : (
              <span className="text-lg flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Analyze & Improve
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Results Section */}
      {analysisResult && (
        <div className="space-y-6">
          <ScoreCards 
            scores={analysisResult.scores}
            targetGroup={analysisResult.targetGroup}
            controversiality={analysisResult.controversiality}
          />
          <SuggestionsList 
            suggestions={analysisResult.suggestions}
            onApplyAll={() => {
              // TODO: Implement apply all suggestions functionality
              console.log('Apply all suggestions clicked');
            }}
          />
        </div>
      )}

      {/* Loading State for Results */}
      {isAnalyzing && (
        <div className="space-y-6 animate-[fade-in_0.5s_ease-out]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-premium p-6 rounded-xl border border-yellow-500/10 card-premium">
                <div className="animate-pulse">
                  <div className="h-4 bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 rounded mb-3"></div>
                  <div className="h-8 bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 rounded mb-2"></div>
                  <div className="h-3 bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 rounded"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-premium p-6 rounded-xl border border-yellow-500/10 card-premium">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 rounded w-1/3"></div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
