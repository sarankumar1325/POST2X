// Environment validation utility
export function validateEnvironment() {
  const requiredVars = {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  };

  const missingVars = [];
  const invalidVars = [];

  for (const [key, value] of Object.entries(requiredVars)) {
    if (!value) {
      missingVars.push(key);
    } else if (value.includes('your_') || value.includes('_here')) {
      invalidVars.push(key);
    }
  }

  return {
    isValid: missingVars.length === 0 && invalidVars.length === 0,
    missingVars,
    invalidVars,
    hasPlaceholders: invalidVars.length > 0,
  };
}

export function getSetupInstructions() {
  return {
    steps: [
      {
        title: "Set up Clerk Authentication",
        instructions: [
          "1. Go to https://clerk.com and create an account",
          "2. Create a new application",
          "3. Go to 'API Keys' in the sidebar",
          "4. Copy your 'Publishable key' (starts with pk_)",
          "5. Copy your 'Secret key' (starts with sk_)",
          "6. Update your .env.local file with these real keys"
        ]
      }
    ]
  };
}
