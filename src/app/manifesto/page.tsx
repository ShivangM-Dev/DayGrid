'use client'

import Link from 'next/link'
import { Button } from '@/components/shared/ui/button'
import { PublicNavigation } from '@/components/shared/navigation/public-navigation'
import { ArrowLeft, ArrowRight, Target, Sparkles, Quote, Star } from 'lucide-react'
import { AnimatedText, FadeInOnScroll, FloatingElement, GradientShift, RevealOnScroll, SubtlePulse } from '@/components/shared/animations/landing-animations'

export default function ManifestoPage() {
  return (
    <>
      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(circle at center, transparent 0%, transparent 50%, rgba(0, 0, 0, 0.2) 100%);
        }
      `}</style>
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Enhanced Animated gradient orbs - Increased Brightness */}
        <FloatingElement duration={20} amplitude={30}>
          <div className="absolute -top-20 -left-20 w-[800px] h-[800px] bg-gradient-to-br from-gray-300 via-gray-400 to-transparent rounded-full opacity-20 blur-3xl"></div>
        </FloatingElement>
        <FloatingElement duration={25} amplitude={20}>
          <div className="absolute top-40 -right-32 w-[900px] h-[900px] bg-gradient-to-bl from-gray-200 via-gray-300 to-transparent rounded-full opacity-18 blur-3xl" style={{animationDelay: '5s'}}></div>
        </FloatingElement>
        <FloatingElement duration={18} amplitude={25}>
          <div className="absolute -bottom-32 left-1/3 w-[700px] h-[700px] bg-gradient-to-tr from-gray-400 via-transparent to-gray-300 rounded-full opacity-22 blur-3xl" style={{animationDelay: '10s'}}></div>
        </FloatingElement>
        
        {/* Enhanced floating particles - Increased Brightness */}
        <div className="absolute top-1/4 left-16 w-1 h-1 bg-gray-200 rounded-full opacity-50 animate-pulse" style={{animationDuration: '3s'}}></div>
        <div className="absolute top-1/3 right-24 w-0.5 h-0.5 bg-gray-100 rounded-full opacity-45 animate-pulse" style={{animationDuration: '4s', animationDelay: '1s'}}></div>
        <div className="absolute top-2/3 left-1/4 w-1 h-1 bg-gray-200 rounded-full opacity-50 animate-pulse" style={{animationDuration: '3.5s', animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 right-1/3 w-0.5 h-0.5 bg-gray-100 rounded-full opacity-40 animate-pulse" style={{animationDuration: '5s', animationDelay: '3s'}}></div>
        
        {/* Enhanced grid lines */}
        <div className="absolute inset-0 opacity-2">
          <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
          <div className="absolute top-2/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
          <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
        </div>
        
        {/* Radial gradient overlay for depth */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(circle at center, transparent 0%, transparent 50%, rgba(0, 0, 0, 0.2) 100%)'
        }}></div>
      </div>

      {/* Navigation */}
      <PublicNavigation currentPath="/manifesto" />

      {/* Content */}
      <div className="px-6 lg:px-8 pb-32 relative pt-32">
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeInOnScroll>
            {/* Back Button */}
            <Link href="/" className="inline-flex items-center text-gray-400 hover:text-gray-200 transition-colors duration-300 mb-16">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="text-sm font-light tracking-wide">Back to Home</span>
            </Link>
          </FadeInOnScroll>

            {/* Header */}
            <div className="text-center mb-20">
              <GradientShift>
                <AnimatedText delay={0.2}>
                  <SubtlePulse scale={1.05} duration={4}>
                    <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-900/60 to-gray-800/30 backdrop-blur-2xl rounded-full text-sm text-gray-200 mb-12 border border-gray-700/50 shadow-2xl hover:shadow-gray-300/10 transition-all duration-500">
                      <Sparkles className="w-4 h-4 mr-3 text-gray-100" />
                      <span className="font-light tracking-wide">Our Philosophy</span>
                    </div>
                  </SubtlePulse>
                </AnimatedText>
              </GradientShift>
              
               <AnimatedText delay={0.4}>
                 <h1 className="text-6xl md:text-8xl font-light mb-8 leading-none tracking-tight">
                   <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                     The DayGrid
                   </span>
                   <br />
                   <span className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 bg-clip-text text-transparent font-extralight">
                     Manifesto
                   </span>
                 </h1>
               </AnimatedText>
              
               <AnimatedText delay={0.6}>
                 <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
                   We believe in the power of 
                   <span className="text-gray-200 font-normal"> intentional design</span> and the beauty of 
                   <span className="text-gray-200 font-normal"> focused execution</span>. 
                   <br className="hidden md:block" />
                   This is our <span className="text-gray-200 font-normal">sacred promise</span> to you.
                 </p>
               </AnimatedText>
            </div>

            {/* Enhanced Manifesto Points */}
            <div className="space-y-32">
              <RevealOnScroll delay={0.2} direction="left">
                <div className="group relative">
                  <div className="absolute -left-8 top-0 w-0.5 h-full bg-gradient-to-b from-gray-600 via-gray-700 to-transparent opacity-50"></div>
                  <div className="border-l-2 border-gray-700 pl-12 hover:border-gray-600 transition-all duration-500">
                    <div className="flex items-start space-x-4 mb-6">
                      <Star className="w-6 h-6 text-gray-400 mt-1 flex-shrink-0 group-hover:text-gray-300 transition-colors duration-300" />
                       <h2 className="text-3xl md:text-4xl font-light text-white tracking-wide">Clarity Over Complexity</h2>
                     </div>
                     <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light">
                       In a world of endless notifications and competing priorities, we choose <span className="text-gray-100 font-normal">simplicity</span>. Every feature in DayGrid exists to bring clarity to your day, not add to the noise. We strip away the unnecessary so you can focus on what <span className="text-gray-100 font-normal">truly matters</span>.
                     </p>
                  </div>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={0.3} direction="right">
                <div className="group relative">
                  <div className="absolute -left-8 top-0 w-0.5 h-full bg-gradient-to-b from-gray-600 via-gray-700 to-transparent opacity-50"></div>
                  <div className="border-l-2 border-gray-700 pl-12 hover:border-gray-600 transition-all duration-500">
                    <div className="flex items-start space-x-4 mb-6">
                      <Target className="w-6 h-6 text-gray-400 mt-1 flex-shrink-0 group-hover:text-gray-300 transition-colors duration-300" />
                       <h2 className="text-3xl md:text-4xl font-light text-white tracking-wide">Precision Planning Meets Flexible Execution</h2>
                     </div>
                     <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light">
                       Structure should <span className="text-gray-100 font-normal">serve you</span>, not constrain you. DayGrid provides the framework for intentional planning while maintaining the flexibility needed in a dynamic world. Plan with <span className="text-gray-100 font-normal">precision</span>, execute with confidence, adapt when needed.
                     </p>
                  </div>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={0.4} direction="left">
                <div className="group relative">
                  <div className="absolute -left-8 top-0 w-0.5 h-full bg-gradient-to-b from-gray-600 via-gray-700 to-transparent opacity-50"></div>
                  <div className="border-l-2 border-gray-700 pl-12 hover:border-gray-600 transition-all duration-500">
                    <div className="flex items-start space-x-4 mb-6">
                      <Sparkles className="w-6 h-6 text-gray-400 mt-1 flex-shrink-0 group-hover:text-gray-300 transition-colors duration-300" />
                       <h2 className="text-3xl md:text-4xl font-light text-white tracking-wide">Excellence in Every Interaction</h2>
                     </div>
                     <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light">
                       We <span className="text-gray-100 font-normal">obsess over the details</span> because you shouldn't have to. From the way animations feel to the precision of our scheduling algorithms, every pixel and every interaction is crafted to serve your <span className="text-gray-100 font-normal">productivity journey</span>.
                     </p>
                  </div>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={0.5} direction="right">
                <div className="group relative">
                  <div className="absolute -left-8 top-0 w-0.5 h-full bg-gradient-to-b from-gray-600 via-gray-700 to-transparent opacity-50"></div>
                  <div className="border-l-2 border-gray-700 pl-12 hover:border-gray-600 transition-all duration-500">
                    <div className="flex items-start space-x-4 mb-6">
                      <Quote className="w-6 h-6 text-gray-400 mt-1 flex-shrink-0 group-hover:text-gray-300 transition-colors duration-300" />
                       <h2 className="text-3xl md:text-4xl font-light text-white tracking-wide">Your Time, Your Rules</h2>
                     </div>
                     <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light">
                       Productivity tools should <span className="text-gray-100 font-normal">adapt to your rhythm</span>, not force you into theirs. DayGrid respects your unique workflow, supporting rather than dictating how you should manage your most <span className="text-gray-100 font-normal">valuable resource</span>: your attention.
                     </p>
                  </div>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={0.6} direction="left">
                <div className="group relative">
                  <div className="absolute -left-8 top-0 w-0.5 h-full bg-gradient-to-b from-gray-600 via-gray-700 to-transparent opacity-50"></div>
                  <div className="border-l-2 border-gray-700 pl-12 hover:border-gray-600 transition-all duration-500">
                    <div className="flex items-start space-x-4 mb-6">
                      <Star className="w-6 h-6 text-gray-400 mt-1 flex-shrink-0 group-hover:text-gray-300 transition-colors duration-300" />
                       <h2 className="text-3xl md:text-4xl font-light text-white tracking-wide">Sustainable Achievement</h2>
                     </div>
                     <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light">
                       True productivity isn't about <span className="text-gray-100 font-normal">doing more</span>—it's about achieving what matters most, consistently. DayGrid is designed for the <span className="text-gray-100 font-normal">long game</span>, helping you build sustainable habits that lead to meaningful progress over time.
                     </p>
                  </div>
                </div>
              </RevealOnScroll>
            </div>

            {/* Enhanced Closing Statement */}
            <RevealOnScroll delay={0.7} direction="up">
              <div className="text-center mt-32 pt-20 border-t border-gray-800/50">
                <GradientShift>
                  <div className="max-w-2xl mx-auto">
                    <FloatingElement duration={6} amplitude={8}>
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-xl mb-8 border border-gray-700/50">
                        <Target className="w-8 h-8 text-gray-200" />
                      </div>
                    </FloatingElement>
                    
                    <h2 className="text-4xl md:text-5xl font-light mb-8 text-white tracking-tight">
                      <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                        This is our
                      </span>
                      <br />
                      <span className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                        commitment
                      </span>
                    </h2>
                    
                    <p className="text-xl md:text-2xl text-gray-400 mb-12 leading-relaxed font-light">
                      To provide you with a tool that not only manages your tasks but 
                      <span className="text-gray-200 font-normal"> elevates your entire relationship </span> 
                       with time and focus.
                    </p>
                    
                    <SubtlePulse scale={1.05} duration={3}>
                      <Link href="/waitlist">
                        <Button size="lg" className="bg-gradient-to-r from-gray-100 to-gray-300 text-black hover:from-gray-200 hover:to-gray-400 text-lg px-16 py-6 shadow-2xl hover:shadow-gray-300/40 transition-all duration-700 font-light tracking-wide rounded-2xl group border border-gray-200/20 hover:border-gray-300/40">
                          <Target className="mr-4 w-5 h-5" />
                          Join Our Mission
                          <ArrowRight className="ml-4 w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                        </Button>
                      </Link>
                    </SubtlePulse>
                  </div>
                </GradientShift>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </>
  )
}