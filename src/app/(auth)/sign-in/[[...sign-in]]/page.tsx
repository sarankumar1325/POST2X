'use client';

import Link from 'next/link';
import { SignIn } from '@clerk/nextjs';
import LightRays from '@/components/LightRays';
import { Sparkles, TrendingUp, Users, BarChart3, Target, Shield, Heart, ArrowRight, Cpu, LineChart, Layers } from 'lucide-react';
import Image from 'next/image';

export default function SignInPage() {
  return (
  <div className="min-h-screen relative overflow-x-hidden overflow-y-auto bg-slate-950">
      {/* LightRays Background - Full Screen */}
      <div className="fixed inset-0 w-full h-full">
        <LightRays
          raysOrigin="top-center"
          raysColor="#00ffff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
        />
        {/* Soft dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-[radial-gradient(at_top_left,rgba(0,40,60,0.45),rgba(2,6,23,0.85))] mix-blend-plus-lighter pointer-events-none" />
      </div>

      {/* Content Layout */}
      <div className="relative z-10 min-h-screen">
  <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 py-8 md:py-12 min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-12">
        {/* Left (Marketing) */}
        <div className="flex items-center order-2 lg:order-1">
          <div className="w-full max-w-xl mx-auto space-y-10">
            <header className="space-y-6">
              {/* Removed marketing badge text */}
              <h1 className="text-3xl md:text-5xl font-bold leading-tight text-white">
                Elevate Your <span className="text-cyan-400">Posting Power</span>
              </h1>
              <p className="text-base md:text-lg text-slate-300 max-w-prose">
                Post2x is your translucent, intelligent layer for ideation, scoring, and refinement. See what resonates before you hit publish.
              </p>
            </header>

            {/* Feature Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: <TrendingUp className="w-4 h-4" />, title: 'Virality Scoring', desc: 'Predictive reach & engagement' },
                { icon: <BarChart3 className="w-4 h-4" />, title: 'Deep Analytics', desc: 'Lifecycle & retention metrics' },
                { icon: <Target className="w-4 h-4" />, title: 'Smart Optimizer', desc: 'AI rewrite + tonal tuning' },
                { icon: <Users className="w-4 h-4" />, title: 'Audience Lens', desc: 'Persona resonance mapping' },
              ].map((f, i) => (
                <div key={i} className="group relative rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2 shadow-[0_0_0_1px_rgba(255,255,255,0.05)] hover:border-cyan-400/40 hover:shadow-cyan-500/10 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-cyan-400/15 text-cyan-300 flex items-center justify-center shadow-inner shadow-cyan-500/30">
                      {f.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white tracking-wide">{f.title}</h3>
                      <p className="text-[11px] leading-snug text-slate-400">{f.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Lower translucent meta cards */}
            <div className="grid sm:grid-cols-3 gap-4 pt-2">
              {[
                { icon: <Cpu className="w-4 h-4" />, label: 'ML MODELS', value: '12+' },
                { icon: <LineChart className="w-4 h-4" />, label: 'POSTS SCORED', value: '2M+' },
                { icon: <Layers className="w-4 h-4" />, label: 'DATA SIGNALS', value: '150+' },
              ].map((m, i) => (
                <div key={i} className="backdrop-blur-xl bg-white/4 border border-white/10 rounded-lg p-3 flex flex-col gap-1 text-center">
                  <div className="mx-auto w-7 h-7 rounded-md bg-cyan-400/15 text-cyan-300 flex items-center justify-center">
                    {m.icon}
                  </div>
                  <div className="text-xs font-medium text-slate-400 tracking-wide">{m.label}</div>
                  <div className="text-sm font-semibold text-cyan-300">{m.value}</div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-500 tracking-wide uppercase">Engineered for creators, teams & growth labs</p>
          </div>
        </div>

        {/* Right Side - Sign In Form (wider for full Clerk content) */}
        <div className="w-full max-w-lg lg:max-w-xl min-w-0 sm:min-w-[400px] flex items-center justify-start p-5 md:p-7 lg:p-8 order-1 lg:order-2 lg:pl-6">
          <div className="w-full">
            {/* Sign In Card */}
            <div className="relative rounded-3xl p-8 md:p-9 lg:p-10 border border-white/15 backdrop-blur-2xl bg-white/5 shadow-[0_10px_55px_-6px_rgba(0,255,255,0.2)] before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-cyan-400/20 before:to-transparent before:pointer-events-none">
              {/* Logo */}
              <div className="text-center mb-6">
                <div className="mx-auto mb-3 rounded-xl flex items-center justify-center">
                  <Image
                    src="/post2x-mark.svg"
                    alt="Post2x logo"
                    width={36}
                    height={36}
                    priority
                    unoptimized
                    sizes="36px"
                    className="drop-shadow-[0_6px_18px_rgba(34,211,238,0.35)]"
                  />
                </div>
                <h2 className="text-lg font-semibold text-white mb-1 tracking-wide">Welcome Back</h2>
                <p className="text-slate-400 text-xs">Access your Post2x intelligence hub</p>
              </div>

              {/* Clerk Sign In */}
              <SignIn
                appearance={{
                  variables: {
                    colorPrimary: '#00ffff',
                    colorText: '#ffffff',
                    colorBackground: 'transparent',
                    colorInputBackground: 'rgba(255,255,255,0.05)',
                    colorInputText: '#ffffff',
                    borderRadius: '14px',
                    fontSize: '13px'
                  },
                  elements: {
                    rootBox: 'w-full',
                    card: 'bg-transparent shadow-none border-none',
                    header: 'hidden',
                    headerTitle: 'hidden',
                    headerSubtitle: 'hidden',
                    socialButtonsBlockButton: '!bg-white/10 !border !border-white/10 !text-white hover:!bg-white/20 !backdrop-blur-xl !transition-all !duration-200 !font-medium !py-2 !rounded-lg !text-xs !whitespace-nowrap',
                    socialButtonsBlockButtonText: '!text-white !font-medium !text-[11px] tracking-wide !whitespace-nowrap',
                    formFieldLabel: 'text-slate-300 font-medium text-[11px] mb-1 tracking-wide',
                    formFieldInput: '!bg-white/5 !border !border-white/10 !text-white !placeholder:text-slate-500 !focus:border-cyan-400 !focus:ring-2 !focus:ring-cyan-400/30 !rounded-lg !py-2 !text-xs !transition-all !duration-200',
                    formButtonPrimary: '!bg-gradient-to-r !from-cyan-500 !to-blue-500 !hover:from-cyan-400 !hover:to-cyan-600 !text-white !font-semibold !py-2.5 !rounded-lg !transition-all !duration-300 !shadow-lg !hover:shadow-cyan-500/30 !text-sm tracking-wide',
                    footerActionText: 'text-slate-400 text-[11px]',
                    footerActionLink: 'text-cyan-300 hover:text-cyan-200 transition-colors font-medium',
                    dividerLine: 'bg-white/10',
                    dividerText: 'text-slate-500 text-[10px] tracking-wide'
                  }
                }}
                routing="hash"
                afterSignInUrl="/analyze"
                afterSignUpUrl="/analyze"
              />

              {/* Footer Links */}
              <div className="mt-4 text-center">
                <p className="text-xs text-slate-400">
                  By signing in, you agree to our{' '}
                  <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-center mt-6">
              <p className="text-slate-400 text-xs">
                New to Post2x?{' '}
                <Link href="/sign-up" className="text-cyan-300 hover:text-cyan-200 transition-colors font-medium inline-flex items-center gap-1">
                  Create an account
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">Post2x</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-cyan-400 transition-colors">About</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Support</a>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-slate-400">Enterprise Security</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-slate-400">Made for Creators</span>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-6 pt-6 text-center">
            <p className="text-xs text-slate-500">
              © 2024 Post2x. All rights reserved. Empowering creators worldwide with AI-driven content insights.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
