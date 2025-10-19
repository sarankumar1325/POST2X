import ContentAnalyzer from '@/components/custom/ContentAnalyzer';

export default function AnalyzePage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Content Analyzer</h1>
        <p className="text-gray-400">
          Analyze your social media content with AI to get insights on virality, 
          engagement potential, and target audience.
        </p>
      </div>
      
      <ContentAnalyzer />
    </div>
  );
}
