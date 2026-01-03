'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PublicNavigation } from '@/components/navigation/public-navigation'
import { 
  AnimatedText, 
  AnimatedCard, 
  FadeInOnScroll, 
  GradientShift
} from '@/components/animations/landing-animations'
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  Target, 
  CheckCircle, 
  BarChart3,
  Zap,
  Shield,
  Users,
  Star,
  Sparkles,
  TrendingUp,
  Award,
  Rocket
} from 'lucide-react'

export default function LandingPage() {

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Single Continuous Background for Entire Page */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Refined Gradient Orbs */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-r from-gray-800 via-transparent to-gray-700 rounded-full opacity-5 blur-3xl animate-pulse"></div>
        <div className="absolute top-32 right-32 w-[700px] h-[700px] bg-gradient-to-l from-gray-700 via-transparent to-gray-600 rounded-full opacity-3 blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-0 left-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-gray-800 via-transparent to-gray-700 rounded-full opacity-4 blur-3xl animate-pulse" style={{animationDelay: '5s'}}></div>
        
        {/* Minimal Particles */}
        <div className="absolute top-1/3 left-20 w-1 h-1 bg-gray-600 rounded-full opacity-40 animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute top-1/2 right-32 w-0.5 h-0.5 bg-gray-500 rounded-full opacity-30 animate-pulse" style={{animationDuration: '5s', animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-gray-600 rounded-full opacity-35 animate-pulse" style={{animationDuration: '4.5s', animationDelay: '1s'}}></div>
        
        {/* Subtle Grid Lines */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
          <div className="absolute top-2/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
          <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
        </div>
      </div>

      {/* Navigation */}
      <PublicNavigation currentPath="/" />

      {/* Premium Hero Section */}
      <section className="pt-48 pb-40 px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <AnimatedText delay={0.3}>
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-900/40 to-gray-800/20 backdrop-blur-2xl rounded-full text-sm text-gray-300 mb-16 border border-gray-800/50 shadow-2xl">
              <Sparkles className="w-4 h-4 mr-3 text-gray-200" style={{animationDuration: '4s'}} />
              <span className="font-light tracking-wide">Intelligent Daily Management</span>
              <span className="mx-3 text-gray-600">•</span>
              <span className="text-gray-400">AI-Enhanced Scheduling</span>
            </div>
          </AnimatedText>
          
          <AnimatedText delay={0.5}>
            <h1 className="text-7xl md:text-9xl font-light mb-12 leading-none tracking-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Precision
              </span>
              <br />
              <span className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-500 bg-clip-text text-transparent font-extralight">
                Meets Purpose
              </span>
            </h1>
          </AnimatedText>
          
          <AnimatedText delay={0.7}>
            <p className="text-2xl md:text-3xl text-gray-400 mb-20 max-w-5xl mx-auto leading-relaxed font-light">
              Transform <span className="text-gray-200 font-light">daily chaos</span> into 
              <span className="text-gray-100 font-light"> elegant clarity</span>. 
              Experience task management crafted for those who demand excellence in every detail.
            </p>
          </AnimatedText>
          
          <AnimatedText delay={0.9}>
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <Link href="/waitlist">
                <Button size="lg" className="bg-gradient-to-r from-gray-50 to-gray-200 text-black hover:from-gray-100 hover:to-gray-300 text-lg px-12 py-5 shadow-2xl hover:shadow-gray-300/30 transition-all duration-500 font-light tracking-wide rounded-2xl">
                  <Rocket className="mr-3 w-5 h-5" />
                  Request Early Access
                  <ArrowRight className="ml-3 w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-gray-700 text-gray-300 hover:bg-gray-900/50 hover:text-white hover:border-gray-600 text-lg px-12 py-5 backdrop-blur-sm transition-all duration-500 font-light tracking-wide rounded-2xl">
                <TrendingUp className="mr-3 w-5 h-5" />
                Discover
              </Button>
            </div>
          </AnimatedText>
          
          {/* Premium Indicators */}
          <AnimatedText delay={1.1}>
            <div className="flex flex-col sm:flex-row gap-12 justify-center items-center mt-24 text-gray-500">
              <div className="flex items-center gap-3 group">
                <div className="w-2 h-2 bg-gray-400 rounded-full group-hover:bg-gray-300 transition-colors duration-300"></div>
                <span className="text-xs font-light tracking-widest uppercase">Limited Availability</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-2 h-2 bg-gray-400 rounded-full group-hover:bg-gray-300 transition-colors duration-300"></div>
                <span className="text-xs font-light tracking-widest uppercase">Founding Member Benefits</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-2 h-2 bg-gray-400 rounded-full group-hover:bg-gray-300 transition-colors duration-300"></div>
                <span className="text-xs font-light tracking-widest uppercase">Priority Support</span>
              </div>
            </div>
          </AnimatedText>
        </div>
      </section>

      {/* Premium Features Section */}
      <section id="features" className="py-32 px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeInOnScroll>
            <div className="text-center mb-24">
              <h2 className="text-6xl md:text-7xl font-light mb-8 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent tracking-tight leading-[1.15] pb-2">
                Designed for Excellence
              </h2>
              <p className="text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed font-light">
                Every element meticulously crafted to <span className="text-gray-200">eliminate friction</span> and 
                <span className="text-gray-200"> amplify focus</span>
              </p>
            </div>
          </FadeInOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            <AnimatedCard delay={0.1}>
              <Card className="bg-gradient-to-br from-gray-950/80 to-gray-900/40 border border-gray-800/30 hover:border-gray-700/50 transition-all duration-700 group hover:shadow-2xl hover:shadow-gray-700/10 backdrop-blur-xl rounded-3xl overflow-hidden h-full flex flex-col">
                <CardContent className="p-10 flex flex-col flex-grow">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-300 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-105 transition-transform duration-500 shadow-lg group-hover:shadow-gray-300/20">
                    <Calendar className="w-7 h-7 text-black" />
                  </div>
                  <h3 className="text-xl font-light mb-6 text-white group-hover:text-gray-100 transition-colors tracking-wide">Intelligent Scheduling</h3>
                  <p className="text-gray-400 leading-relaxed text-base font-light flex-grow">
                    Smart task placement with business hours awareness and conflict prevention. Your time, perfectly optimized.
                  </p>
                </CardContent>
              </Card>
            </AnimatedCard>

            <AnimatedCard delay={0.2}>
              <Card className="bg-gradient-to-br from-gray-950/80 to-gray-900/40 border border-gray-800/30 hover:border-gray-700/50 transition-all duration-700 group hover:shadow-2xl hover:shadow-gray-700/10 backdrop-blur-xl rounded-3xl overflow-hidden h-full flex flex-col">
                <CardContent className="p-10 flex flex-col flex-grow">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-300 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-105 transition-transform duration-500 shadow-lg group-hover:shadow-gray-300/20">
                    <Target className="w-7 h-7 text-black" />
                  </div>
                  <h3 className="text-xl font-light mb-6 text-white group-hover:text-gray-100 transition-colors tracking-wide">Priority Intelligence</h3>
                  <p className="text-gray-400 leading-relaxed text-base font-light flex-grow">
                    Exclusive high-priority system ensures focus on what truly matters. Eliminate decision paralysis.
                  </p>
                </CardContent>
              </Card>
            </AnimatedCard>

            <AnimatedCard delay={0.3}>
              <Card className="bg-gradient-to-br from-gray-950/80 to-gray-900/40 border border-gray-800/30 hover:border-gray-700/50 transition-all duration-700 group hover:shadow-2xl hover:shadow-gray-700/10 backdrop-blur-xl rounded-3xl overflow-hidden h-full flex flex-col">
                <CardContent className="p-10 flex flex-col flex-grow">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-300 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-105 transition-transform duration-500 shadow-lg group-hover:shadow-gray-300/20">
                    <Clock className="w-7 h-7 text-black" />
                  </div>
                  <h3 className="text-xl font-light mb-6 text-white group-hover:text-gray-100 transition-colors tracking-wide">Time Architecture</h3>
                  <p className="text-gray-400 leading-relaxed text-base font-light flex-grow">
                    Visual 24-hour grid with drag-and-drop functionality. Plan your day with precision and fluidity.
                  </p>
                </CardContent>
              </Card>
            </AnimatedCard>

            <AnimatedCard delay={0.4}>
              <Card className="bg-gradient-to-br from-gray-950/80 to-gray-900/40 border border-gray-800/30 hover:border-gray-700/50 transition-all duration-700 group hover:shadow-2xl hover:shadow-gray-700/10 backdrop-blur-xl rounded-3xl overflow-hidden h-full flex flex-col">
                <CardContent className="p-10 flex flex-col flex-grow">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-300 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-105 transition-transform duration-500 shadow-lg group-hover:shadow-gray-300/20">
                    <CheckCircle className="w-7 h-7 text-black" />
                  </div>
                  <h3 className="text-xl font-light mb-6 text-white group-hover:text-gray-100 transition-colors tracking-wide">Task Taxonomy</h3>
                  <p className="text-gray-400 leading-relaxed text-base font-light flex-grow">
                    Six distinct categories from meetings to deadlines. Organize work the way you naturally think about it.
                  </p>
                </CardContent>
              </Card>
            </AnimatedCard>

            <AnimatedCard delay={0.5}>
              <Card className="bg-gradient-to-br from-gray-950/80 to-gray-900/40 border border-gray-800/30 hover:border-gray-700/50 transition-all duration-700 group hover:shadow-2xl hover:shadow-gray-700/10 backdrop-blur-xl rounded-3xl overflow-hidden h-full flex flex-col">
                <CardContent className="p-10 flex flex-col flex-grow">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-300 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-105 transition-transform duration-500 shadow-lg group-hover:shadow-gray-300/20">
                    <Shield className="w-7 h-7 text-black" />
                  </div>
                  <h3 className="text-xl font-light mb-6 text-white group-hover:text-gray-100 transition-colors tracking-wide">Day Progression</h3>
                  <p className="text-gray-400 leading-relaxed text-base font-light flex-grow">
                    Flow from Planning to Active to Completed. Lock in your schedule and execute with unwavering confidence.
                  </p>
                </CardContent>
              </Card>
            </AnimatedCard>

            <AnimatedCard delay={0.6}>
              <Card className="bg-gradient-to-br from-gray-950/80 to-gray-900/40 border border-gray-800/30 hover:border-gray-700/50 transition-all duration-700 group hover:shadow-2xl hover:shadow-gray-700/10 backdrop-blur-xl rounded-3xl overflow-hidden h-full flex flex-col">
                <CardContent className="p-10 flex flex-col flex-grow">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-300 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-105 transition-transform duration-500 shadow-lg group-hover:shadow-gray-300/20">
                    <BarChart3 className="w-7 h-7 text-black" />
                  </div>
                  <h3 className="text-xl font-light mb-6 text-white group-hover:text-gray-100 transition-colors tracking-wide">Performance Analytics</h3>
                  <p className="text-gray-400 leading-relaxed text-base font-light flex-grow">
                    Track completion rates, identify patterns, and continuously optimize your productivity ecosystem.
                  </p>
                </CardContent>
              </Card>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Premium How It Works */}
      <section id="how-it-works" className="py-24 px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeInOnScroll>
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-light mb-8 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent tracking-tight">
                How DayGrid Works
              </h2>
              <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed font-light">
                <span className="text-gray-200">Three powerful steps</span> to regain complete control of your day
              </p>
            </div>
          </FadeInOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <FadeInOnScroll>
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-8 text-3xl font-light text-black shadow-xl group-hover:scale-105 transition-transform duration-500">
                  1
                </div>
                <h3 className="text-xl font-light mb-6 text-white group-hover:text-gray-100 transition-colors tracking-wide">Plan Your Day</h3>
                <p className="text-gray-400 leading-relaxed text-base font-light">
                  <span className="text-gray-200">Create tasks</span> and organize them by priority. Define what needs to get done before you start your day.
                </p>
              </div>
            </FadeInOnScroll>

            <FadeInOnScroll>
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-8 text-3xl font-light text-black shadow-xl group-hover:scale-105 transition-transform duration-500">
                  2
                </div>
                <h3 className="text-xl font-light mb-6 text-white group-hover:text-gray-100 transition-colors tracking-wide">Schedule & Commit</h3>
                <p className="text-gray-400 leading-relaxed text-base font-light">
                  <span className="text-gray-200">Drag tasks</span> onto your 24-hour grid. Activate your day to lock in the schedule and commit to success.
                </p>
              </div>
            </FadeInOnScroll>

            <FadeInOnScroll>
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-8 text-3xl font-light text-black shadow-xl group-hover:scale-105 transition-transform duration-500">
                  3
                </div>
                <h3 className="text-xl font-light mb-6 text-white group-hover:text-gray-100 transition-colors tracking-wide">Execute & Track</h3>
                <p className="text-gray-400 leading-relaxed text-base font-light">
                  <span className="text-gray-200">Follow your plan</span> with confidence. Monitor progress and celebrate every completed task.
                </p>
              </div>
            </FadeInOnScroll>
          </div>
          
          {/* Connecting Line Animation */}
          <div className="hidden md:block relative mt-16">
            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
          </div>
        </div>
      </section>



      {/* Premium CTA Section */}
      <section className="py-32 px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <FadeInOnScroll>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light mb-12 leading-none tracking-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Master Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-500 bg-clip-text text-transparent font-extralight">
                Daily Potential
              </span>
            </h2>
            <p className="text-2xl text-gray-400 mb-16 max-w-4xl mx-auto leading-relaxed font-light">
              Join <span className="text-gray-200">discerning professionals</span> who've elevated their productivity with DayGrid. 
              <span className="text-gray-200"> Begin your transformation.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <Link href="/waitlist">
                <Button size="lg" className="bg-gradient-to-r from-gray-50 to-gray-200 text-black hover:from-gray-100 hover:to-gray-300 text-xl px-16 py-6 shadow-2xl hover:shadow-gray-300/40 transition-all duration-500 font-light tracking-wide rounded-2xl group">
                  <Rocket className="mr-4 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                  Request Early Access
                  <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-gray-700 text-gray-300 hover:bg-gray-900/50 hover:text-white hover:border-gray-600 text-xl px-16 py-6 backdrop-blur-sm transition-all duration-500 font-light tracking-wide rounded-2xl group">
                <TrendingUp className="mr-4 w-6 h-6 group-hover:translate-y-1 transition-transform duration-300" />
                Explore
              </Button>
            </div>
            
            {/* Premium Badges */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mt-20">
              <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-900/60 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/50">
                <Shield className="w-5 h-5 mr-3 text-emerald-400" />
                <span className="text-gray-200 font-light tracking-wide">Lifetime Access Guarantee</span>
              </div>
              <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-900/60 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/50">
                <Award className="w-5 h-5 mr-3 text-yellow-400" />
                <span className="text-gray-200 font-light tracking-wide">Founding Member Status</span>
              </div>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="py-20 px-6 lg:px-8 bg-black border-t border-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="w-6 h-6 text-black" />
                </div>
                <span className="text-2xl font-light tracking-tight text-white">DayGrid</span>
              </div>
              <p className="text-gray-500 text-sm font-light leading-relaxed">
                Elevate your daily workflow with intelligent task management designed for excellence.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-light mb-6 text-sm tracking-widest uppercase">Product</h4>
              <ul className="space-y-4 text-gray-500 text-sm font-light">
                <li><a href="#features" className="hover:text-gray-300 transition-colors duration-300">Features</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors duration-300">Pricing</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors duration-300">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-light mb-6 text-sm tracking-widest uppercase">Company</h4>
              <ul className="space-y-4 text-gray-500 text-sm font-light">
                <li><a href="#" className="hover:text-gray-300 transition-colors duration-300">About</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors duration-300">Blog</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors duration-300">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-light mb-6 text-sm tracking-widest uppercase">Support</h4>
              <ul className="space-y-4 text-gray-500 text-sm font-light">
                <li><a href="#" className="hover:text-gray-300 transition-colors duration-300">Help Center</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors duration-300">Contact</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors duration-300">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-900/50 mt-16 pt-12 text-center text-gray-600 text-sm font-light">
            <p>&copy; 2024 DayGrid. Crafted with precision.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}