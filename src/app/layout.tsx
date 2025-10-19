import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import {
  ClerkProvider,
} from "@clerk/nextjs";
import "./globals.css";
import PixelBlastBackground from "@/components/PixelBlastBackground";

const sans = Plus_Jakarta_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Post2x - AI-Powered Content Analysis",
  description: "Analyze your social media content with AI to increase virality and engagement",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const keyLooksValid =
    typeof publishableKey === "string" &&
    /^pk_(test|live)_/.test(publishableKey) &&
    !publishableKey.includes("your_");

  if (!keyLooksValid) {
    return (
      <html lang="en" className="dark">
        <body className={`${sans.variable} ${mono.variable} antialiased`}>
          <div className="min-h-screen flex items-center justify-center p-6 relative">
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
              <PixelBlastBackground />
            </div>
            <div className="max-w-2xl text-center relative z-10">
              <div className="glass p-8 rounded-2xl backdrop-blur-xl border border-white/10">
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-secondary to-primary rounded-2xl flex items-center justify-center shadow-lg shadow-secondary/20">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-4 gradient-text">Configuration Required</h1>
                <p className="text-slate-400 mb-6">
                  Your Clerk environment variables are missing or still using placeholders.
                </p>
                <div className="glass-dark p-6 rounded-xl mb-6 text-left">
                  <h2 className="text-xl font-semibold mb-4 text-white">Fix in 3 steps:</h2>
                  <ol className="space-y-3 text-slate-300 list-decimal list-inside">
                    <li>Open <code className="bg-white/10 px-2 py-0.5 rounded text-accent">.env.local</code></li>
                    <li>Set <code className="bg-white/10 px-2 py-0.5 rounded text-accent">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> to a real key (starts with <code className="text-accent">pk_</code>)</li>
                  <li>Restart the dev server: <code className="bg-white/10 px-2 py-0.5 rounded text-accent">npm run dev</code></li>
                </ol>
              </div>
              <a
                href="/setup"
                className="inline-block btn-premium px-8 py-3 rounded-xl font-medium transition-all transform hover:scale-105"
              >
                Open Setup Guide
              </a>
              </div>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html lang="en" className="dark">
        <body className={`${sans.variable} ${mono.variable} antialiased min-h-screen`}>
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <PixelBlastBackground />
          </div>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
