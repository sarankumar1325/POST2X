'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ContentScores, TargetGroup } from '@/types';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Users, 
  Briefcase, 
  Heart,
  TrendingUp,
  Target,
  BarChart3
} from 'lucide-react';

interface ScoreCardsProps {
  scores: ContentScores;
  targetGroup: TargetGroup;
  controversiality: string;
}

export default function ScoreCards({ scores, targetGroup, controversiality }: ScoreCardsProps) {
  // Determine color based on virality score
  const getScoreColor = (score: number) => {
    if (score >= 70) return { color: 'text-green-400', bg: 'bg-green-400' };
    if (score >= 50) return { color: 'text-blue-400', bg: 'bg-blue-400' };
    return { color: 'text-orange-400', bg: 'bg-orange-400' };
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return 'Strong';
    if (score >= 50) return 'Good';
    return 'Weak';
  };

  const viralityStyle = getScoreColor(scores.virality);

  // Prepare radar chart data
  const radarData = [
    { subject: 'Hook', score: scores.hook, fullMark: 100 },
    { subject: 'Clarity', score: scores.clarity, fullMark: 100 },
    { subject: 'Breadth', score: scores.breadth, fullMark: 100 },
    { subject: 'Tension', score: scores.tension, fullMark: 100 },
    { subject: 'Reply', score: scores.reply, fullMark: 100 },
  ];

  // Get sentiment emoji
  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'optimistic': return '😊';
      case 'neutral': return '😐';
      case 'negative': return '😕';
      case 'excited': return '🤩';
      case 'curious': return '🤔';
      default: return '😊';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Virality Score Card */}
      <Card className="p-6 bg-gray-900/50 border-gray-800">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="mr-2 h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-white">Virality</h3>
          </div>
          
          <div className="relative mb-4">
            {/* Circular Progress */}
            <div className="relative w-24 h-24 mx-auto">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-700"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - scores.virality / 100)}`}
                  className={viralityStyle.color}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{scores.virality}</span>
              </div>
            </div>
          </div>
          
          <div>
            <span className={`text-sm font-medium ${viralityStyle.color}`}>
              {getScoreLabel(scores.virality)}
            </span>
            <p className="text-xs text-gray-400 mt-1">
              {scores.virality}/100
            </p>
          </div>
        </div>
      </Card>

      {/* Breakdown Radar Chart */}
      <Card className="p-6 bg-gray-900/50 border-gray-800">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <BarChart3 className="mr-2 h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-white">Breakdown</h3>
          </div>
          
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                />
                <PolarRadiusAxis 
                  domain={[0, 100]} 
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-5 gap-1 mt-2 text-xs text-gray-400">
            <div>Hook {scores.hook}%</div>
            <div>Clarity {scores.clarity}%</div>
            <div>Breadth {scores.breadth}%</div>
            <div>Tension {scores.tension}%</div>
            <div>Reply {scores.reply}%</div>
          </div>
        </div>
      </Card>

      {/* Target Group Card */}
      <Card className="p-6 bg-gray-900/50 border-gray-800">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Target className="mr-2 h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-white">Target Group</h3>
          </div>
          
          <div className="space-y-4">
            {/* Age */}
            <div className="flex items-center justify-center">
              <Users className="mr-2 h-4 w-4 text-gray-400" />
              <span className="text-white font-medium">{targetGroup.age}</span>
            </div>
            
            {/* Profession */}
            <div className="flex items-center justify-center">
              <Briefcase className="mr-2 h-4 w-4 text-gray-400" />
              <span className="text-white text-sm">{targetGroup.profession}</span>
            </div>
            
            {/* Interests */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1 justify-center">
                {targetGroup.interests.slice(0, 3).map((interest, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Sentiment */}
            <div className="flex items-center justify-center">
              <Heart className="mr-2 h-4 w-4 text-gray-400" />
              <span className="text-white text-sm mr-2">{targetGroup.sentiment}</span>
              <span className="text-lg">
                {getSentimentEmoji(targetGroup.sentiment)}
              </span>
            </div>
            
            {/* Controversiality */}
            <div className="pt-2 border-t border-gray-700">
              <div className="text-xs text-gray-400 mb-1">Controversiality</div>
              <span className={`text-sm font-medium ${
                controversiality.includes('Safe') 
                  ? 'text-green-400' 
                  : 'text-orange-400'
              }`}>
                {controversiality}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
