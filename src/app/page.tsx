'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, TrendingUp, Users, Zap, Shield, Star, CheckCircle, Crown, Rocket, BarChart3, Calendar, Target } from 'lucide-react';
import Prism from '@/components/Prism';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Prism Background */}
      <div className="fixed inset-0 -z-10">
        <Prism
          animationType="rotate"
          timeScale={0.3}
          height={4}
          baseWidth={6}
          scale={4}
          hueShift={0}
          colorFrequency={0.8}
          noise={0.3}
          glow={0.8}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 border-b border-white/10 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Post2x</span>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/sign-in" className="text-slate-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/sign-up" className="btn-premium px-4 py-2 rounded-lg font-medium">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass-premium px-4 py-2 rounded-full mb-8 border border-accent/30">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-white">AI-Powered Content Intelligence</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl lg:text-6xl font-bold gradient-text mb-6 leading-tight">
              Transform Your Content<br />
              <span className="text-white">Into Viral Success</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Post2x uses advanced AI to analyze, optimize, and predict the viral potential of your content.
              Join thousands of creators who are 10x-ing their engagement.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/sign-up" className="btn-premium px-8 py-4 rounded-xl font-semibold text-lg inline-flex items-center gap-2 hover:scale-105 transition-all">
                <Rocket className="w-5 h-5" />
                Start Creating Better Content
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#features" className="text-slate-300 hover:text-white transition-colors font-medium">
                Learn More ↓
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">50K+</div>
                <div className="text-sm text-slate-400">Active Creators</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">2M+</div>
                <div className="text-sm text-slate-400">Posts Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">300%</div>
                <div className="text-sm text-slate-400">Avg. Engagement Boost</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold gradient-text mb-4">
              Everything You Need to Go Viral
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Powerful AI tools designed specifically for content creators who want to maximize their impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="glass-premium rounded-2xl p-8 border border-white/10 hover:border-accent/30 transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Viral Potential Analysis</h3>
              <p className="text-slate-400 mb-4">
                Get instant scores on your content&apos;s viral potential with detailed insights and optimization suggestions.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Real-time scoring
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Platform-specific insights
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  A/B testing recommendations
                </li>
              </ul>
            </div>

            {/* Feature Card 2 */}
            <div className="glass-premium rounded-2xl p-8 border border-white/10 hover:border-accent/30 transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Smart Content Calendar</h3>
              <p className="text-slate-400 mb-4">
                AI-powered scheduling that predicts the best times to post based on your audience and content type.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Optimal posting times
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Content series planning
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Automated reminders
                </li>
              </ul>
            </div>

            {/* Feature Card 3 */}
            <div className="glass-premium rounded-2xl p-8 border border-white/10 hover:border-accent/30 transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Trending Topic Discovery</h3>
              <p className="text-slate-400 mb-4">
                Stay ahead of trends with AI that identifies emerging topics and suggests content angles.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Real-time trend monitoring
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Niche-specific insights
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Competitive analysis
                </li>
              </ul>
            </div>

            {/* Feature Card 4 */}
            <div className="glass-premium rounded-2xl p-8 border border-white/10 hover:border-accent/30 transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Audience Insights</h3>
              <p className="text-slate-400 mb-4">
                Deep analytics on your audience behavior, preferences, and engagement patterns.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Demographic analysis
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Content preference mapping
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Growth opportunity identification
                </li>
              </ul>
            </div>

            {/* Feature Card 5 */}
            <div className="glass-premium rounded-2xl p-8 border border-white/10 hover:border-accent/30 transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Performance Analytics</h3>
              <p className="text-slate-400 mb-4">
                Comprehensive dashboards showing your content performance across all platforms.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Cross-platform metrics
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  ROI tracking
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Predictive analytics
                </li>
              </ul>
            </div>

            {/* Feature Card 6 */}
            <div className="glass-premium rounded-2xl p-8 border border-white/10 hover:border-accent/30 transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Content Protection</h3>
              <p className="text-slate-400 mb-4">
                Advanced AI detection and protection against content theft and plagiarism.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Plagiarism detection
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Copyright monitoring
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Brand protection
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold gradient-text mb-4">
              Loved by Content Creators Worldwide
            </h2>
            <p className="text-xl text-slate-300">
              See what creators are saying about their Post2x experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-premium rounded-2xl p-8 border border-white/10">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-300 mb-6 italic">
                &quot;Post2x transformed my content strategy completely. My engagement increased by 400% in just 2 months!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white">Sarah Chen</div>
                  <div className="text-slate-400 text-sm">Tech Influencer • 500K followers</div>
                </div>
              </div>
            </div>

            <div className="glass-premium rounded-2xl p-8 border border-white/10">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-300 mb-6 italic">
                &quot;The AI insights are incredibly accurate. Post2x helps me create content that actually resonates with my audience.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white">Marcus Johnson</div>
                  <div className="text-slate-400 text-sm">Business Coach • 250K followers</div>
                </div>
              </div>
            </div>

            <div className="glass-premium rounded-2xl p-8 border border-white/10">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-300 mb-6 italic">
                &quot;From struggling blogger to 6-figure creator. Post2x&apos;s analytics and suggestions are game-changing.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white">Emma Rodriguez</div>
                  <div className="text-slate-400 text-sm">Lifestyle Blogger • 1M followers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="glass-premium rounded-3xl p-12 border border-accent/20 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold gradient-text mb-6">
              Ready to 10x Your Content Performance?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Join thousands of creators who are already seeing massive growth with Post2x
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span>Cancel anytime</span>
              </div>
            </div>

            <Link href="/sign-up" className="btn-premium px-8 py-4 rounded-xl font-semibold text-lg inline-flex items-center gap-2 hover:scale-105 transition-all">
              <Rocket className="w-5 h-5" />
              Start Your Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 backdrop-blur-xl py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Post2x</span>
              </div>
              <p className="text-slate-400 mb-4 max-w-md">
                The AI-powered platform that helps content creators maximize their impact and grow their audience exponentially.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Twitter
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  LinkedIn
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Instagram
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-slate-400 text-sm">
              © 2024 Post2x. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}