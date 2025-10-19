import { neon } from '@neondatabase/serverless';
import { User, Post, DailyIdea } from '@/types';
import { generateDailyIdeas } from '@/lib/lyzr';

const DATABASE_URL = process.env.DATABASE_URL;

function isValidDatabaseUrl(url?: string) {
  // Basic validation + ensure we didn't leave placeholders
  return !!url && /^postgres(?:ql)?:\/\//.test(url) && !/username|password|host|database_name/.test(url);
}

let sql: ReturnType<typeof neon> | null = null;

if (isValidDatabaseUrl(DATABASE_URL)) {
  try {
    sql = neon(DATABASE_URL!);
  } catch (e) {
    console.warn('Failed to initialize database client:', e);
    sql = null;
  }
} else {
  console.warn('DATABASE_URL is missing or still a placeholder. Falling back to mock data.');
}

// Database schema creation functions
export async function createTables() {
  if (!sql) {
    console.warn('Skipping table creation: DATABASE_URL not configured.');
    return;
  }
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        clerk_id TEXT UNIQUE NOT NULL,
        email TEXT NOT NULL,
        username TEXT,
        credits INTEGER DEFAULT 100,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    // Create posts table
    await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT REFERENCES users(id),
        content TEXT NOT NULL,
        virality_score INTEGER,
        hook_score INTEGER,
        clarity_score INTEGER, 
        breadth_score INTEGER,
        tension_score INTEGER,
        reply_score INTEGER,
        target_age TEXT,
        target_profession TEXT,
        target_interests JSONB,
        target_sentiment TEXT,
        controversiality TEXT,
        suggestions JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    // Create daily_ideas table
    await sql`
      CREATE TABLE IF NOT EXISTS daily_ideas (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        content TEXT NOT NULL,
        author_name TEXT DEFAULT 'Saran Kumar',
        category TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating database tables:', error);
    throw error;
  }
}

// Helper to normalize Neon results across return variants (array vs FullQueryResults)
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toRows<T = Record<string, unknown>>(res: unknown): T[] {
  // Neon can return either a plain array of rows or an object with a `rows` array
  if (Array.isArray(res)) return res as T[];
  if (isObject(res)) {
    const rows = res['rows'];
    if (Array.isArray(rows)) return rows as T[];
  }
  return [] as T[];
}

// User operations
export async function createUser(data: Omit<User, 'created_at'>) {
  if (!sql) {
    console.warn('createUser: Database not configured. No-op.');
    // Return a mocked user-like object with current timestamp
    return {
      ...data,
      created_at: new Date(),
    } as unknown as User;
  }
  const result = await sql`
    INSERT INTO users (id, clerk_id, email, username, credits)
    VALUES (${data.id}, ${data.clerk_id}, ${data.email}, ${data.username || null}, ${data.credits})
    RETURNING *;
  `;
  const rows = toRows<User>(result);
  return rows[0] as User;
}

export async function getUserByClerkId(clerkId: string) {
  if (!sql) {
    console.warn('getUserByClerkId: Database not configured. Returning undefined.');
    return undefined;
  }
  const result = await sql`
    SELECT * FROM users WHERE clerk_id = ${clerkId} LIMIT 1;
  `;
  const rows = toRows<User>(result);
  return rows[0] as User | undefined;
}

export async function getUserById(id: string) {
  if (!sql) {
    console.warn('getUserById: Database not configured. Returning undefined.');
    return undefined;
  }
  const result = await sql`
    SELECT * FROM users WHERE id = ${id} LIMIT 1;
  `;
  const rows = toRows<User>(result);
  return rows[0] as User | undefined;
}

export async function updateUserCredits(userId: string, credits: number) {
  if (!sql) {
    console.warn('updateUserCredits: Database not configured. No-op.');
    // Return a mocked user
    return {
      id: userId,
      clerk_id: userId,
      email: 'mock@example.com',
      username: 'mock',
      credits,
      created_at: new Date(),
    } as unknown as User;
  }
  const result = await sql`
    UPDATE users 
    SET credits = ${credits}
    WHERE id = ${userId}
    RETURNING *;
  `;
  const rows = toRows<User>(result);
  return rows[0] as User;
}

// Post operations
export async function savePost(data: Omit<Post, 'id' | 'created_at'>) {
  if (!sql) {
    console.warn('savePost: Database not configured. No-op.');
    return {
      id: `mock_${Date.now()}`,
      ...data,
      created_at: new Date(),
    } as unknown as Post;
  }
  const result = await sql`
    INSERT INTO posts (
      user_id, content, virality_score, hook_score, clarity_score,
      breadth_score, tension_score, reply_score, target_age,
      target_profession, target_interests, target_sentiment,
      controversiality, suggestions
    )
    VALUES (
      ${data.user_id}, ${data.content}, ${data.virality_score || null},
      ${data.hook_score || null}, ${data.clarity_score || null},
      ${data.breadth_score || null}, ${data.tension_score || null},
      ${data.reply_score || null}, ${data.target_age || null},
      ${data.target_profession || null}, 
      ${data.target_interests ? JSON.stringify(data.target_interests) : null},
      ${data.target_sentiment || null}, ${data.controversiality || null},
      ${data.suggestions ? JSON.stringify(data.suggestions) : null}
    )
    RETURNING *;
  `;
  const rows = toRows<Post>(result);
  return rows[0] as Post;
}

export async function getUserPosts(userId: string, limit = 10) {
  if (!sql) {
    console.warn('getUserPosts: Database not configured. Returning empty list.');
    return [] as Post[];
  }
  const result = await sql`
    SELECT * FROM posts 
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT ${limit};
  `;
  return toRows<Post>(result);
}

// Daily ideas operations
export async function getDailyIdeas(limit = 20) {
  if (!sql) {
    console.warn('getDailyIdeas: Database not configured. Returning generated ideas.');
    return await generateDailyIdeas(limit);
  }
  const result = await sql`
    SELECT * FROM daily_ideas 
    ORDER BY created_at DESC
    LIMIT ${limit};
  `;
  return toRows<DailyIdea>(result);
}

export async function createDailyIdea(content: string, authorName = 'Saran Kumar', category?: string) {
  if (!sql) {
    console.warn('createDailyIdea: Database not configured. Returning mock idea.');
    return {
      id: `mock_${Date.now()}`,
      content,
      author_name: authorName,
      category,
      created_at: new Date(),
      timeAgo: '0m'
    } as unknown as DailyIdea;
  }
  const result = await sql`
    INSERT INTO daily_ideas (content, author_name, category)
    VALUES (${content}, ${authorName}, ${category || null})
    RETURNING *;
  `;
  const rows = toRows<DailyIdea>(result);
  return rows[0] as DailyIdea;
}

// Utility function to check database connection
export async function checkDatabaseConnection() {
  if (!sql) {
    return false;
  }
  try {
    const result = await sql`SELECT 1 as connected`;
    const rows = toRows<{ connected: number }>(result);
    return rows.length > 0;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

export { sql };
