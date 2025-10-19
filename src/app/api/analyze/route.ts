import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { analyzeContent } from '@/lib/lyzr';
import { savePost, getUserByClerkId, updateUserCredits, createUser } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { content } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
      );
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: 'Content must be less than 2000 characters' },
        { status: 400 }
      );
    }

    // Get or create user in database
    let user = await getUserByClerkId(userId);
    if (!user) {
      // Check if database is configured
      const isDatabaseConfigured = process.env.DATABASE_URL &&
        /^postgres(?:ql)?:\/\//.test(process.env.DATABASE_URL) &&
        !/username|password|host|database_name/.test(process.env.DATABASE_URL);

      if (!isDatabaseConfigured) {
        // Use mock user when database is not configured
        console.log('Database not configured, using mock user for analysis');
        user = {
          id: `mock_user_${userId}`,
          clerk_id: userId,
          email: 'mock@example.com',
          username: 'Mock User',
          credits: 100,
          created_at: new Date(),
        };
      } else {
        // Auto-create user if they don't exist and database is configured
        try {
          const clerkUser = await (await clerkClient()).users.getUser(userId);
          user = await createUser({
            id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            clerk_id: userId,
            email: clerkUser.emailAddresses[0]?.emailAddress || '',
            username: clerkUser.username || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || undefined,
            credits: 100, // Default credits for new users
          });
        } catch (error) {
          console.error('Error creating user:', error);
          return NextResponse.json({ error: 'Failed to create user account' }, { status: 500 });
        }
      }
    }

    // Check if user has enough credits
    if (user.credits < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits. Please upgrade your plan.' },
        { status: 402 }
      );
    }

    // Analyze content with Lyzr
    const analysisResult = await analyzeContent(content);

    // Deduct credit (only if database is configured)
    const isDatabaseConfigured = process.env.DATABASE_URL &&
      /^postgres(?:ql)?:\/\//.test(process.env.DATABASE_URL) &&
      !/username|password|host|database_name/.test(process.env.DATABASE_URL);

    let newCredits = user.credits - 1;
    if (isDatabaseConfigured) {
      await updateUserCredits(user.id, newCredits);

      // Save analysis to database
      await savePost({
        user_id: user.id,
        content,
        virality_score: analysisResult.scores.virality,
        hook_score: analysisResult.scores.hook,
        clarity_score: analysisResult.scores.clarity,
        breadth_score: analysisResult.scores.breadth,
        tension_score: analysisResult.scores.tension,
        reply_score: analysisResult.scores.reply,
        target_age: analysisResult.targetGroup.age,
        target_profession: analysisResult.targetGroup.profession,
        target_interests: analysisResult.targetGroup.interests,
        target_sentiment: analysisResult.targetGroup.sentiment,
        controversiality: analysisResult.controversiality,
        suggestions: analysisResult.suggestions,
      });
    } else {
      console.log('Database not configured, skipping credit deduction and post saving');
    }

    // Return analysis result
    return NextResponse.json({
      ...analysisResult,
      creditsRemaining: newCredits,
    });
  } catch (error) {
    console.error('Error analyzing content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
