# 🚀 Post2x Quick Setup Guide

Follow these steps to get your Post2x application up and running!

## ✅ Checklist

### 1. Environment Setup
- [ ] Copy `.env.example` to `.env.local`
- [ ] Set up Clerk authentication keys
- [ ] Set up Neon database connection
- [ ] Set up Lyzr AI API key (optional for development)

### 2. Clerk Authentication Setup

1. **Create Clerk Account**: Go to [clerk.com](https://clerk.com) and sign up
2. **Create Application**: 
   - Click "Add application"
   - Choose "Next.js" as your framework
   - Give it a name like "Post2x"

3. **Get API Keys**:
   - Copy `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` from the dashboard
   - Copy `CLERK_SECRET_KEY` from the dashboard
   - Add both to your `.env.local` file

4. **Configure URLs** (in Clerk Dashboard > Paths):
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up` 
   - After sign-in URL: `/`
   - After sign-up URL: `/`

### 3. Neon Database Setup

1. **Create Neon Account**: Go to [neon.tech](https://neon.tech) and sign up
2. **Create Project**:
   - Click "Create Project"
   - Choose a region close to your users
   - Give it a name like "post2x-db"

3. **Get Connection String**:
   - Copy the connection string from the dashboard
   - Add it to your `.env.local` file as `DATABASE_URL`

### 4. Lyzr AI Setup (Optional)

> **Note**: The app works with mock data if you don't have Lyzr AI keys. You can skip this for development.

1. **Create Lyzr Account**: Go to [lyzr.ai](https://lyzr.ai) and sign up
2. **Get API Key**: From your dashboard, copy your API key
3. **Add to Environment**: Add `LYZR_API_KEY` to your `.env.local` file

### 5. Run the Application

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit `http://localhost:3000` - you should see the Post2x application!

## 🐛 Troubleshooting

### Database Connection Issues
- Make sure your `DATABASE_URL` is correctly formatted
- Check that your Neon database is running (it auto-sleeps after inactivity)
- Verify the connection string includes `?sslmode=require`

### Authentication Issues
- Double-check your Clerk publishable key starts with `pk_`
- Ensure your secret key starts with `sk_`
- Verify the sign-in/sign-up URLs are configured correctly in Clerk dashboard

### AI Features Not Working
- If you don't have Lyzr API key, the app will use mock data (this is normal for development)
- Mock data provides realistic examples of the AI analysis features

## 📝 Your Environment File Should Look Like This

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_actual_secret_key_here
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Neon Database
DATABASE_URL=postgresql://username:password@host/database_name?sslmode=require

# Lyzr AI (optional)
LYZR_API_KEY=your_lyzr_api_key_here

# Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🎉 Success!

Once everything is set up, you should be able to:

1. **Sign Up/Sign In**: Create an account and log in
2. **View Daily Ideas**: See AI-generated content ideas on the home page
3. **Analyze Content**: Go to the Analyze page and test content analysis
4. **See Real Data**: If connected to Lyzr, get actual AI insights; otherwise, see realistic mock data

## 🚀 Next Steps

- **Customize**: Modify the mock data in `src/lib/lyzr.ts` to match your needs
- **Deploy**: Follow the deployment guide in the main README
- **Add Features**: The codebase is well-structured for adding new features

## 💡 Development Tips

- The app uses mock data by default, so you can develop without AI API keys
- All database tables are created automatically on first run
- The dark theme is optimized for the content analysis workflow
- Use the TypeScript types in `src/types/index.ts` for consistent data structures

---

**Need help?** Check the main README.md for more detailed information!
