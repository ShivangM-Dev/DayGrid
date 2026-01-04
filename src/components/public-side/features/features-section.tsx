import { 
  RevealOnScroll, 
  GradientShift
} from '@/components/shared/animations/landing-animations'
import { 
  Calendar, 
  Clock, 
  Target, 
  CheckCircle, 
  BarChart3,
  Shield
} from 'lucide-react'
import { FeaturesSectionProps, Feature } from '@/types/public-side'

/**
 * FeaturesSection component - Showcases core product features
 * Displays premium features in an elegant grid layout with animations
 */
export function FeaturesSection({ className }: FeaturesSectionProps = {}) {
  const leftFeatures: Feature[] = [
    {
      icon: Calendar,
      title: "Intelligent Scheduling",
      description: "Smart task placement with business hours awareness and conflict prevention. Your time, perfectly optimized.",
      tags: ["Automated", "Smart Intelligence"]
    },
    {
      icon: Clock,
      title: "Time Architecture",
      description: "Visual 24-hour grid with drag-and-drop functionality. Plan your day with precision and fluidity.",
      tags: ["Visual", "Interactive"]
    },
    {
      icon: Shield,
      title: "Day Progression",
      description: "Flow from Planning to Active to Completed. Lock in your schedule and execute with unwavering confidence.",
      tags: ["Workflow", "Confidence"]
    }
  ]

  const rightFeatures: Feature[] = [
    {
      icon: Target,
      title: "Priority Intelligence",
      description: "Exclusive high-priority system ensures focus on what truly matters. Eliminate decision paralysis.",
      tags: ["Focus", "Amplifier"]
    },
    {
      icon: CheckCircle,
      title: "Task Taxonomy",
      description: "Six distinct categories from meetings to deadlines. Organize work the way you naturally think about it.",
      tags: ["Smart", "Organization"]
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Track completion rates, identify patterns, and continuously optimize your productivity ecosystem.",
      tags: ["Data", "Insights"]
    }
  ]

  return (
    <section id="features" className={`py-32 px-6 lg:px-8 relative ${className || ''}`}>
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <RevealOnScroll delay={0.2} direction="up">
          <GradientShift>
            <div className="text-center mb-32">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-900/60 to-gray-800/30 backdrop-blur-2xl rounded-full text-sm text-gray-200 mb-12 border border-gray-700/50 shadow-2xl">
                <span className="font-light tracking-wide">Core Features</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-light mb-8 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent tracking-tight leading-[1.1]">
                Designed for
                <br />
                Excellence
              </h2>
              <p className="text-2xl md:text-3xl text-gray-400 max-w-5xl mx-auto leading-relaxed font-light">
                Every element meticulously crafted to 
                <span className="text-gray-200 font-normal"> eliminate friction</span> and 
                <span className="text-gray-200 font-normal"> amplify focus</span>
              </p>
            </div>
          </GradientShift>
        </RevealOnScroll>

        {/* Features Grid */}
        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            
            {/* Left Column Features */}
            <div className="space-y-16">
              {leftFeatures.map((feature, index) => (
                <RevealOnScroll key={index} delay={0.3 + index * 0.1} direction="left">
                  <div className="group relative pl-12 border-l border-gray-800/50 hover:border-gray-700/70 transition-all duration-500">
                    <div className="absolute -left-8 top-0 w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-300 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl group-hover:shadow-gray-300/40">
                      <feature.icon className="w-8 h-8 text-black" />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-3xl font-light text-white group-hover:text-gray-100 transition-colors tracking-wide">
                        {feature.title}
                      </h3>
                      <p className="text-lg text-gray-300 leading-relaxed font-light">
                        <span className="text-gray-100 font-normal">
                          {feature.description.split(' ').slice(0, 2).join(' ')}
                        </span>
                        {feature.description.split(' ').slice(2).join(' ')}
                      </p>
                      <div className="flex items-center space-x-4 text-gray-500 text-sm font-light">
                        <span className="px-3 py-1 bg-gray-800/50 rounded-full">{feature.tags[0]}</span>
                        <span>•</span>
                        <span>{feature.tags[1]}</span>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>

            {/* Right Column Features */}
            <div className="space-y-16 mt-16 lg:mt-0">
              {rightFeatures.map((feature, index) => (
                <RevealOnScroll key={index} delay={0.35 + index * 0.1} direction="right">
                  <div className="group relative pr-12 border-r border-gray-800/50 hover:border-gray-700/70 transition-all duration-500">
                    <div className="absolute -right-8 top-0 w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-300 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-xl group-hover:shadow-gray-300/40">
                      <feature.icon className="w-8 h-8 text-black" />
                    </div>
                    <div className="space-y-4 text-right">
                      <h3 className="text-3xl font-light text-white group-hover:text-gray-100 transition-colors tracking-wide">
                        {feature.title}
                      </h3>
                      <p className="text-lg text-gray-300 leading-relaxed font-light">
                        <span className="text-gray-100 font-normal">
                          {feature.description.split(' ').slice(0, 2).join(' ')}
                        </span>
                        {feature.description.split(' ').slice(2).join(' ')}
                      </p>
                      <div className="flex items-center justify-end space-x-4 text-gray-500 text-sm font-light">
                        <span>{feature.tags[0]}</span>
                        <span>•</span>
                        <span className="px-3 py-1 bg-gray-800/50 rounded-full">{feature.tags[1]}</span>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>

          {/* Connecting Visual Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/2 w-px h-32 bg-gradient-to-b from-transparent via-gray-700 to-transparent opacity-30"></div>
            <div className="absolute top-1/2 left-1/2 w-px h-32 bg-gradient-to-b from-transparent via-gray-700 to-transparent opacity-30"></div>
            <div className="absolute top-3/4 left-1/2 w-px h-32 bg-gradient-to-b from-transparent via-gray-700 to-transparent opacity-30"></div>
          </div>
        </div>
      </div>
    </section>
  )
}