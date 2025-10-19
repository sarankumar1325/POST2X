'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validateEnvironment, getSetupInstructions } from '@/lib/env-check';
import { CheckCircle, XCircle, ExternalLink, Copy } from 'lucide-react';

export default function SetupPage() {
  const [envStatus, setEnvStatus] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setEnvStatus(validateEnvironment());
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const sampleEnvContent = `# Clerk Authentication - Get from https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key
CLERK_SECRET_KEY=sk_test_your_actual_secret_key
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret

# Neon Database - Get from https://console.neon.tech
DATABASE_URL=postgresql://username:password@host/database_name?sslmode=require

# Lyzr AI - Optional, app works with mock data
LYZR_API_KEY=your_lyzr_api_key

# Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000`;

  if (!envStatus) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Setup Post2x</h1>
          <p className="text-gray-400 text-lg">
            Let's get your environment configured properly
          </p>
        </div>

        {/* Environment Status */}
        <Card className="p-6 bg-gray-900/50 border-gray-800 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            {envStatus.isValid ? (
              <CheckCircle className="h-5 w-5 text-green-400" />
            ) : (
              <XCircle className="h-5 w-5 text-red-400" />
            )}
            Environment Status
          </h2>

          {envStatus.hasPlaceholders && (
            <Alert className="mb-4 bg-red-900/20 border-red-800">
              <XCircle className="h-4 w-4" />
              <AlertDescription className="text-red-400">
                You're using placeholder values in your environment variables. 
                Please update them with real keys from Clerk.
              </AlertDescription>
            </Alert>
          )}

          {envStatus.isValid && (
            <Alert className="mb-4 bg-green-900/20 border-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-green-400">
                Great! Your environment is properly configured. You can now use the application.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded">
              <span>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</span>
              {envStatus.invalidVars.includes('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY') ? (
                <XCircle className="h-5 w-5 text-red-400" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-400" />
              )}
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded">
              <span>CLERK_SECRET_KEY</span>
              {envStatus.invalidVars.includes('CLERK_SECRET_KEY') ? (
                <XCircle className="h-5 w-5 text-red-400" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-400" />
              )}
            </div>
          </div>
        </Card>

        {/* Setup Instructions */}
        {!envStatus.isValid && (
          <Card className="p-6 bg-gray-900/50 border-gray-800 mb-8">
            <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3 text-blue-400">Step 1: Create Clerk Account</h3>
                <div className="space-y-2 text-gray-300">
                  <p>1. Go to <a href="https://clerk.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-1">
                    clerk.com <ExternalLink className="h-4 w-4" />
                  </a> and create an account</p>
                  <p>2. Click "Create Application"</p>
                  <p>3. Choose "Next.js" and give it a name like "Post2x"</p>
                  <p>4. Go to "API Keys" in the sidebar</p>
                  <p>5. Copy your keys (publishable key starts with `pk_`, secret key starts with `sk_`)</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3 text-blue-400">Step 2: Update Environment File</h3>
                <p className="text-gray-300 mb-3">
                  Replace the placeholder values in your `.env.local` file with your real Clerk keys:
                </p>
                
                <div className="relative">
                  <pre className="bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{sampleEnvContent}</code>
                  </pre>
                  <Button
                    onClick={() => copyToClipboard(sampleEnvContent, 'env')}
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                  >
                    {copied === 'env' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3 text-blue-400">Step 3: Restart Development Server</h3>
                <p className="text-gray-300">After updating your environment file, restart your development server:</p>
                <div className="bg-gray-800 p-3 rounded mt-2 font-mono text-sm">
                  npm run dev
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="text-center">
          {envStatus.isValid ? (
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Go to Application
            </Button>
          ) : (
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Check Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
