# Clerk Credentials & Configuration Backup

## Environment Variables (from .env.local)
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_cHJlY2lvdXMtZWdyZXQtMzMuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_c1sQTMMHEEJenJ1gmz3iK2GEQjn92nq7lWD3wFStBr
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Other Environment Variables
DATABASE_URL=postgresql://username:password@host/database_name?sslmode=require
LYZR_API_KEY=your_lyzr_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Dependencies (Clerk-related)
```json
"@clerk/nextjs": "^6.31.9",
"svix": "^1.76.1"
```

## Important Files to Preserve
- src/middleware.ts (Clerk middleware)
- src/app/api/webhook/clerk/route.ts (Clerk webhooks)
- src/app/(auth)/sign-in/[[...sign-in]]/page.tsx
- src/app/(auth)/sign-up/[[...sign-up]]/page.tsx
- src/lib/db.ts (Database configuration)

## Notes
- Current Clerk setup uses test keys
- Webhook endpoint configured for user management
- Authentication pages use Clerk's built-in components
- Database integration with Neon PostgreSQL
