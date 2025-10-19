'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Suggestion } from '@/types';
import { 
  Lightbulb, 
  TrendingUp, 
  MessageCircle, 
  Eye, 
  Zap,
  CheckCircle2
} from 'lucide-react';

interface SuggestionsListProps {
  suggestions: Suggestion[];
  onApplyAll?: () => void;
}

export default function SuggestionsList({ suggestions, onApplyAll }: SuggestionsListProps) {
  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'hook': return <Zap className="h-4 w-4 text-yellow-400" />;
      case 'context': return <Eye className="h-4 w-4 text-blue-400" />;
      case 'tension': return <TrendingUp className="h-4 w-4 text-red-400" />;
      case 'clarity': return <MessageCircle className="h-4 w-4 text-green-400" />;
      case 'engagement': return <CheckCircle2 className="h-4 w-4 text-purple-400" />;
      default: return <Lightbulb className="h-4 w-4 text-gray-400" />;
    }
  };

  const getImpactColor = (impact: string) => {
    // Extract the number from impact string (e.g., "+3-7" -> 7)
    const maxImpact = parseInt(impact.split('-')[1] || impact.replace('+', ''));
    if (maxImpact >= 7) return 'text-green-400 bg-green-400/10';
    if (maxImpact >= 5) return 'text-blue-400 bg-blue-400/10';
    return 'text-orange-400 bg-orange-400/10';
  };

  return (
    <Card className="p-6 bg-gray-900/50 border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Suggestions to Improve</h3>
        </div>
        
        {suggestions.length > 0 && (
          <Button
            onClick={onApplyAll}
            variant="outline"
            size="sm"
            className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
          >
            Apply All Suggestions
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {suggestions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No suggestions available</p>
          </div>
        ) : (
          suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              className="flex gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
            >
              {/* Number */}
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{index + 1}</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getSuggestionIcon(suggestion.type)}
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-gray-200 text-sm leading-relaxed">
                      {suggestion.text}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-400 uppercase tracking-wider">
                        {suggestion.type}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getImpactColor(suggestion.impact)}`}>
                        {suggestion.impact} impact
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Apply Button */}
              <div className="flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-gray-700"
                  onClick={() => {
                    // TODO: Implement individual suggestion application
                    console.log('Apply suggestion:', suggestion.id);
                  }}
                >
                  Apply
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">
              {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''} available
            </span>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-gray-400 text-xs">High Impact</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span className="text-gray-400 text-xs">Medium Impact</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                <span className="text-gray-400 text-xs">Low Impact</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
