#  POST2X- AI-Powered Social Media Content Analyzer

Post2x is a powerful web application that uses AI to analyze social media content for virality, engagement potential, and target audience insights. Built with Next.js 15, Clerk authentication, Neon database, and Lyzr AI.

##  Features

### Core Features
- **Content Analysis**: AI-powered analysis of social media posts with virality scoring
- **Performance Breakdown**: Detailed insights on Hook, Clarity, Breadth, Tension, and Reply potential
- **Target Audience Insights**: Age groups, professions, interests, and sentiment analysis
- **Improvement Suggestions**: Actionable recommendations with impact scores
- **Daily Ideas Feed**: AI-generated content ideas for inspiration
- **Credit System**: Usage-based credit system for content analysis

### Technical Features
- **Modern Stack**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Authentication**: Secure user authentication with Clerk
- **Database**: Neon PostgreSQL for scalable data storage
- **AI Integration**: Lyzr AI for content analysis and idea generation
- **Responsive Design**: Mobile-first design with dark theme
- **Real-time Updates**: Dynamic content loading and updates

##  Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **Authentication**: Clerk
- **Database**: Neon PostgreSQL
- **AI/ML**: Lyzr AI API
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

##  Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- npm or yarn package manager
- A Clerk account ([sign up here](https://clerk.com))
- A Neon database ([sign up here](https://neon.tech))
- A Lyzr AI account ([sign up here](https://lyzr.ai))

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd post2x
npm install
```

### 2. Environment Variables

Copy the example environment file and fill in your actual values:

```bash
cp .env.example .env.local
```

Update `.env.local` with your actual keys:

```env
# Clerk Authentication - Get from https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key
CLERK_SECRET_KEY=sk_test_your_actual_key
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret

# Neon Database - Get from https://console.neon.tech
DATABASE_URL=postgresql://username:password@host/database_name?sslmode=require

# Lyzr AI - Get from your Lyzr dashboard
LYZR_API_KEY=your_actual_lyzr_api_key

# Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Clerk Authentication

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Copy your Publishable Key and Secret Key
4. Configure sign-in/sign-up URLs:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in URL: `/`
   - After sign-up URL: `/`

### 4. Set Up Neon Database

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project
3. Copy your connection string
4. The database tables will be created automatically on first run

### 5. Set Up Webhooks (Optional but recommended)

1. In Clerk Dashboard, go to Webhooks
2. Add endpoint: `https://your-domain.com/api/webhook/clerk`
3. Subscribe to `user.created` and `user.updated` events
4. Copy the webhook secret to your environment variables

### 6. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application!

##  Project Structure

```
src/
├── app/
│   ├── (auth)/                 # Authentication pages
│   │   ├── sign-in/           # Sign-in page
│   │   └── sign-up/           # Sign-up page
│   ├── (dashboard)/           # Main dashboard
│   │   ├── layout.tsx         # Dashboard layout
│   │   ├── page.tsx           # Daily ideas page
│   │   └── analyze/           # Content analyzer
│   ├── api/
│   │   ├── analyze/           # Content analysis endpoint
│   │   ├── daily-ideas/       # Daily ideas endpoint
│   │   └── webhook/           # Clerk webhooks
│   └── globals.css
├── components/
│   ├── ui/                    # shadcn/ui components
│   └── custom/                # Custom components
│       ├── ContentAnalyzer.tsx
│       ├── ScoreCards.tsx
│       ├── SuggestionsList.tsx
│       ├── DailyIdeasFeed.tsx
│       └── Navigation.tsx
├── lib/
│   ├── db.ts                  # Database functions
│   ├── lyzr.ts               # Lyzr AI integration
│   └── utils.ts              # Utility functions
└── types/
    └── index.ts               # TypeScript types
```

##  Usage

### Content Analysis
1. Navigate to the "Analyze" page
2. Paste your social media content
3. Click "Improve" to get AI analysis
4. Review scores, breakdown, and suggestions
5. Apply improvements to optimize your content

### Daily Ideas
1. Visit the home page to see daily ideas
2. Click "More Ideas" to generate fresh content
3. Use "Get Inspired By" to analyze similar content
4. Build your content strategy with AI assistance

##  Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to add all environment variables in your deployment platform:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET`
- `DATABASE_URL`
- `LYZR_API_KEY`
- `NEXT_PUBLIC_APP_URL` (your production URL)

##  Database Schema

The database includes three main tables:
- **users**: Stores user data synced with Clerk
- **posts**: Stores content analysis results
- **daily_ideas**: Stores AI-generated post ideas

##  Security

- Authentication handled by Clerk
- API routes protected with authentication
- Environment variables for sensitive data
- Input validation and sanitization

---

Built with ❤️ by Sarankumar S  using Next.js, Clerk, Neon, and Lyzr AI.
