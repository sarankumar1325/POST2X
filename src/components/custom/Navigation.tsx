'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, BarChart3, Menu, X, Coins } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface NavigationProps {
  credits?: number;
}

export default function Navigation({ credits = 100 }: NavigationProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      href: '/',
      label: 'Daily Ideas',
      icon: <Sparkles className="h-5 w-5" />,
      description: 'Get inspired by AI-generated content ideas'
    },
    {
      href: '/analyze',
      label: 'Analyze',
      icon: <BarChart3 className="h-5 w-5" />,
      description: 'Analyze your content for virality and engagement'
    }
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden glass-dark border-b border-muted px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-muted-foreground hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            
            <div className="flex items-center gap-2">
              <Image
                src="/post2x-mark.svg"
                alt="Post2x"
                width={24}
                height={24}
                priority
                unoptimized
                sizes="24px"
                style={{ height: 'auto', width: 'auto' }}
              />
              <span className="text-white font-semibold gradient-text">Post2x</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="glass flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/20">
              <Coins className="h-4 w-4 text-accent drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
              <span className="text-white text-sm font-medium">{credits}</span>
            </div>
            
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mt-4 pb-4 animate-[slide-up_0.3s_ease-out]">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl transition-all transform hover:scale-[1.02] ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20'
                      : 'text-muted-foreground hover:text-white hover:bg-white/10 glass'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={isActive(item.href) ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : ''}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs opacity-70">{item.description}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 z-50">
        <div className="flex flex-col flex-1 glass-dark border-r border-muted backdrop-blur-xl">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-8 border-b border-muted">
            <Image
              src="/post2x-mark.svg"
              alt="Post2x"
              width={36}
              height={36}
              priority
              unoptimized
              sizes="36px"
              style={{ height: 'auto', width: 'auto' }}
            />
            <div>
              <h1 className="text-white font-bold text-xl gradient-text">Post2x</h1>
              <p className="text-slate-400 text-xs font-medium">AI Content Analyzer</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group hover-lift ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-xl shadow-primary/20'
                    : 'text-muted-foreground hover:text-white hover:bg-white/10 glass'
                }`}
              >
                <div className={`transition-all duration-300 ${
                  isActive(item.href)
                    ? 'drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]'
                    : 'group-hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]'
                }`}>
                  {item.icon}
                </div>
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs opacity-70 group-hover:opacity-100 transition-opacity">
                    {item.description}
                  </div>
                </div>
              </Link>
            ))}
          </nav>

          {/* Credits & User */}
          <div className="p-4 space-y-4 border-t border-muted">
            <div className="glass p-4 rounded-xl border border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-accent drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                  <span className="text-white text-sm font-medium">Credits</span>
                </div>
                <span className="text-white font-bold text-lg gradient-text">{credits}</span>
              </div>
              <div className="text-xs text-slate-400">
                Use credits to analyze content and get insights
              </div>
              <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                {(() => {
                  const pct = Math.min(100, Math.max(0, credits));
                  const step = Math.round(pct / 5) * 5;
                  const widthMap: Record<number, string> = {
                    0: 'w-[0%]', 5: 'w-[5%]', 10: 'w-[10%]', 15: 'w-[15%]', 20: 'w-[20%]',
                    25: 'w-[25%]', 30: 'w-[30%]', 35: 'w-[35%]', 40: 'w-[40%]', 45: 'w-[45%]',
                    50: 'w-[50%]', 55: 'w-[55%]', 60: 'w-[60%]', 65: 'w-[65%]', 70: 'w-[70%]',
                    75: 'w-[75%]', 80: 'w-[80%]', 85: 'w-[85%]', 90: 'w-[90%]', 95: 'w-[95%]',
                    100: 'w-[100%]'
                  };
                  const widthClass = step >= 100 ? 'w-full' : (widthMap[step] || 'w-[0%]');
                  return (
                    <div className={`h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-500 ${widthClass}`} />
                  );
                })()}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <SignedIn>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                    }
                  }}
                />
              </SignedIn>
              <SignedOut>
                <div className="text-center">
                  <p className="text-slate-400 text-sm mb-2">Sign in to continue</p>
                  <Button size="sm" className="w-full btn-premium">
                    Sign In
                  </Button>
                </div>
              </SignedOut>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Content Offset */}
      <div className="hidden lg:block lg:pl-72">
        {/* This div creates the offset for desktop content */}
      </div>
    </>
  );
}
