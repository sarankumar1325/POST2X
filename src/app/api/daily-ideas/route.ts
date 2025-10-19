import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { getDailyIdeas, createDailyIdea } from '@/lib/db';
import { generateDailyIdeas, getTimeAgo } from '@/lib/lyzr';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const refresh = searchParams.get('refresh') === 'true';

    // Get ideas from database
    let ideas = await getDailyIdeas(limit);

    // If no ideas in database or refresh requested, generate new ones
    if (ideas.length === 0 || refresh) {
      console.log('Generating new daily ideas...');
      const newIdeas = await generateDailyIdeas(10);
      
      // Save new ideas to database
      for (const idea of newIdeas) {
        await createDailyIdea(idea.content, 'Community Trend', idea.category);
      }
      
      // Fetch updated ideas from database
      ideas = await getDailyIdeas(limit);
    }

    // Add timeAgo to each idea
    const ideasWithTimeAgo = ideas.map(idea => ({
      ...idea,
      timeAgo: getTimeAgo(new Date(idea.created_at))
    }));

    return NextResponse.json({ ideas: ideasWithTimeAgo });
  } catch (error) {
    console.error('Error fetching daily ideas:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { content, authorName, category } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
      );
    }

    // Create new daily idea
    const newIdea = await createDailyIdea(
      content,
      authorName || 'Community Trend',
      category
    );

    return NextResponse.json({ idea: newIdea });
  } catch (error) {
    console.error('Error creating daily idea:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
