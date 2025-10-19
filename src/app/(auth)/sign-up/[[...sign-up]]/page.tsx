'use client';

import Link from 'next/link';
import { SignUp } from '@clerk/nextjs';
import Image from 'next/image';
import LightRays from '@/components/LightRays';
import { Sparkles, TrendingUp, Users, BarChart3, Target, Shield, Heart, ArrowLeft } from 'lucide-react';

export default function SignUpPage() {
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
      </div>

      {/* Content Layout */}
      <div className="relative z-10 min-h-screen">
  <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 py-8 md:py-12 min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-12">
        {/* Left Side - Marketing Content */}
        <div className="flex items-center">
          <div className="w-full max-w-xl mx-auto space-y-10">
            {/* Hero Section */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 glass-premium px-4 py-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 mb-6">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-300">AI-Powered Content Platform</span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold gradient-text mb-6 leading-tight">
                Start Your<br />
                <span className="text-cyan-400">Content Journey</span>
              </h1>

              <p className="text-xl text-slate-300 leading-relaxed mb-8">
                Join thousands of creators who use Post2x to analyze, optimize, and grow their content with advanced AI insights.
              </p>

              {/* Key Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="glass-premium rounded-xl p-4 border border-cyan-400/20 bg-cyan-400/5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-cyan-400/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="font-semibold text-white">Viral Prediction</span>
                  </div>
                  <p className="text-sm text-slate-400">AI-powered analysis of content potential</p>
                </div>

                <div className="glass-premium rounded-xl p-4 border border-cyan-400/20 bg-cyan-400/5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-cyan-400/20 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="font-semibold text-white">Performance Analytics</span>
                  </div>
                  <p className="text-sm text-slate-400">Detailed engagement and growth metrics</p>
                </div>

                <div className="glass-premium rounded-xl p-4 border border-cyan-400/20 bg-cyan-400/5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-cyan-400/20 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="font-semibold text-white">Smart Optimization</span>
                  </div>
                  <p className="text-sm text-slate-400">Personalized content improvement suggestions</p>
                </div>

                <div className="glass-premium rounded-xl p-4 border border-cyan-400/20 bg-cyan-400/5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-cyan-400/20 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="font-semibold text-white">Community Insights</span>
                  </div>
                  <p className="text-sm text-slate-400">Audience behavior and trend analysis</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-cyan-400 mb-1">50K+</div>
                <div className="text-sm text-slate-400">Active Creators</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cyan-400 mb-1">2M+</div>
                <div className="text-sm text-slate-400">Posts Analyzed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cyan-400 mb-1">95%</div>
                <div className="text-sm text-slate-400">Accuracy Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="w-full max-w-lg lg:max-w-xl min-w-0 sm:min-w-[400px] flex items-center justify-start p-5 md:p-7 lg:p-8 lg:pl-6">
          <div className="w-full">
            {/* Sign Up Card */}
            <div className="relative rounded-3xl p-8 md:p-9 lg:p-10 border border-white/15 backdrop-blur-2xl bg-white/5 shadow-[0_10px_55px_-6px_rgba(0,255,255,0.2)] before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-cyan-400/20 before:to-transparent before:pointer-events-none">
              {/* Logo */}
              <div className="text-center mb-6">
                <div className="mx-auto mb-3 rounded-xl flex items-center justify-center">
                  <Image
                    src="/post2x-mark.svg"
                    alt="Post2x logo"
                    width={40}
                    height={40}
                    priority
                    unoptimized
                    sizes="40px"
                    style={{ height: 'auto', width: 'auto' }}
                    className="drop-shadow-[0_6px_18px_rgba(34,211,238,0.35)]"
                  />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">Join Post2x</h2>
                <p className="text-slate-400 text-sm">Create your account to get started</p>
              </div>

              {/* Clerk Sign Up */}
              <SignUp
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
                  By signing up, you agree to our{' '}
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
              <p className="text-slate-400 text-sm">
                Already have an account?{' '}
                <Link href="/sign-in" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium inline-flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" />
                  Sign in
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
