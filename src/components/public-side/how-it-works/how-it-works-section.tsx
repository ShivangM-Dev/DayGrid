import { 
  RevealOnScroll, 
  GradientShift, 
  SubtlePulse
} from '@/components/shared/animations/landing-animations'
import { 
  Target, 
  Calendar, 
  Clock, 
  CheckCircle 
} from 'lucide-react'
import { HowItWorksSectionProps, Phase } from '@/types/public-side'

/**
 * HowItWorksSection component - Explains the three-phase workflow
 * Shows the progression from Plan to Schedule to Execute
 */
export function HowItWorksSection({ className }: HowItWorksSectionProps = {}) {
  const phases: Phase[] = [
    {
      icon: Calendar,
      title: "Plan",
      subtitle: "Intention Creation",
      features: [
        "Create tasks with clear priorities and time estimates",
        "Organize by category — meetings, deep work, reviews", 
        "Set high-priority items that demand immediate focus"
      ],
      number: "01",
      delay: 0.8
    },
    {
      icon: Clock,
      title: "Schedule", 
      subtitle: "Time Architecture",
      features: [
        "Drag tasks onto your 24-hour grid with precision",
        "Business hours awareness prevents scheduling conflicts",
        "Optimize transitions between meetings and deep work"
      ],
      number: "02", 
      delay: 0.9
    },
    {
      icon: CheckCircle,
      title: "Execute",
      subtitle: "Focused Completion", 
      features: [
        "Activate your day to lock in your commitment",
        "Follow timeline with confidence and clarity",
        "Celebrate completion and reflect on progress"
      ],
      number: "03",
      delay: 1.0
    }
  ]

  return (
    <section id="how-it-works" className={`py-32 px-6 lg:px-8 relative ${className || ''}`}>
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <RevealOnScroll delay={0.2} direction="up">
          <GradientShift>
            <div className="text-center mb-32">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-900/60 to-gray-800/30 backdrop-blur-2xl rounded-full text-sm text-gray-200 mb-12 border border-gray-700/50 shadow-2xl">
                <Target className="w-4 h-4 mr-3" />
                <span className="font-light tracking-wide">Workflow Evolution</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-light mb-8 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent tracking-tight leading-[1.1]">
                How DayGrid
                <br />
                Works
              </h2>
              <p className="text-2xl md:text-3xl text-gray-400 max-w-4xl mx-auto leading-relaxed font-light">
                From <span className="text-gray-200 font-normal">intention to completion</span> in three refined stages
              </p>
            </div>
          </GradientShift>
        </RevealOnScroll>

        {/* Phase Indicators */}
        <div className="flex items-center justify-center mb-16">
          <div className="flex items-center space-x-12">
            <RevealOnScroll delay={0.3} direction="up">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-400 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-500 shadow-xl group-hover:shadow-gray-300/30">
                  <Calendar className="w-8 h-8 text-black" />
                </div>
                <span className="text-sm text-gray-400 font-light tracking-wide">PLAN</span>
              </div>
            </RevealOnScroll>
            
            <RevealOnScroll delay={0.4} direction="up">
              <div className="flex items-center">
                <div className="w-24 h-px bg-gradient-to-r from-gray-700 to-gray-600"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full mx-2"></div>
                <div className="w-24 h-px bg-gradient-to-r from-gray-600 to-gray-700"></div>
              </div>
            </RevealOnScroll>
            
            <RevealOnScroll delay={0.5} direction="up">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-400 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-500 shadow-xl group-hover:shadow-gray-300/30">
                  <Clock className="w-8 h-8 text-black" />
                </div>
                <span className="text-sm text-gray-400 font-light tracking-wide">SCHEDULE</span>
              </div>
            </RevealOnScroll>
            
            <RevealOnScroll delay={0.6} direction="up">
              <div className="flex items-center">
                <div className="w-24 h-px bg-gradient-to-r from-gray-700 to-gray-600"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full mx-2"></div>
                <div className="w-24 h-px bg-gradient-to-r from-gray-600 to-gray-700"></div>
              </div>
            </RevealOnScroll>
            
            <RevealOnScroll delay={0.7} direction="up">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-400 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-500 shadow-xl group-hover:shadow-gray-300/30">
                  <CheckCircle className="w-8 h-8 text-black" />
                </div>
                <span className="text-sm text-gray-400 font-light tracking-wide">EXECUTE</span>
              </div>
            </RevealOnScroll>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {phases.map((phase, index) => (
            <RevealOnScroll key={index} delay={phase.delay} direction="up">
              <SubtlePulse scale={1.02} duration={5 + index * 0.5}>
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-xl rounded-3xl border border-gray-700/50 hover:border-gray-600/60 transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-gray-700/20">
                    <div 
                      className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-600 via-gray-500 to-transparent opacity-50"
                      style={{opacity: 0.5 + index * 0.1}}
                    ></div>
                  </div>
                  <div className="relative p-10">
                    {/* Phase Header */}
                    <div className="flex items-center space-x-4 mb-8">
                      <div className="w-14 h-14 bg-gradient-to-br from-gray-200 to-gray-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <phase.icon className="w-7 h-7 text-black" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-light text-white tracking-wide">{phase.title}</h3>
                        <p className="text-sm text-gray-400 font-light">{phase.subtitle}</p>
                      </div>
                    </div>
                    
                    {/* Features */}
                    <div className="space-y-4 mb-8">
                      {phase.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-3">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                          <p className="text-gray-300 leading-relaxed font-light">
                            <span className="text-gray-100 font-normal">
                              {feature.split(' ').slice(0, 2).join(' ')}
                            </span>
                            {feature.split(' ').slice(2).join(' ')}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    {/* Phase Number */}
                    <div className="text-right">
                      <span className="text-4xl font-light text-gray-600">{phase.number}</span>
                    </div>
                  </div>
                </div>
              </SubtlePulse>
            </RevealOnScroll>
          ))}
        </div>

        {/* Flow Visualization */}
        <div className="relative mt-16">
          <div className="hidden lg:block">
            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"></div>
            <div className="absolute -top-2 left-1/4 w-4 h-4 bg-gray-700 rounded-full"></div>
            <div className="absolute -top-2 left-1/2 w-4 h-4 bg-gray-600 rounded-full"></div>
            <div className="absolute -top-2 right-1/4 w-4 h-4 bg-gray-700 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  )
}