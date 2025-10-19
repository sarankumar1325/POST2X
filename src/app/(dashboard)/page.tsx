import DailyIdeasFeed from '@/components/custom/DailyIdeasFeed';
import { getDailyIdeas } from '@/lib/db';
import { getTimeAgo } from '@/lib/lyzr';
import { DailyIdea } from '@/types';

export default async function HomePage() {
  // Get initial ideas from database
  let initialIdeas: DailyIdea[] = [];
  try {
    const ideas = await getDailyIdeas(10);
    // Add timeAgo to each idea
    initialIdeas = ideas.map(idea => ({
      ...idea,
      timeAgo: getTimeAgo(new Date(idea.created_at))
    }));
  } catch (error) {
    console.error('Error loading initial ideas:', error);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <DailyIdeasFeed initialIdeas={initialIdeas} />
    </div>
  );
}
