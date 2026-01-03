'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Target, ArrowRight, CheckCircle, Users, Clock, Shield } from 'lucide-react'
import { PublicNavigation } from '@/components/navigation/public-navigation'
import { 
  AnimatedText, 
  AnimatedCard, 
  FloatingElement,
  FadeInOnScroll
} from '@/components/animations/landing-animations'

export default function WaitlistPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [reason, setReason] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitted(true)
    setIsLoading(false)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black text-white">
        <PublicNavigation />
        
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <FloatingElement duration={2} amplitude={3}>
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            </FloatingElement>
            
            <AnimatedText delay={0.2}>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                You're on the List!
              </h1>
            </AnimatedText>
            
            <AnimatedText delay={0.4}>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Thanks for your interest in DayGrid. We'll notify you as soon as early access is available.
              </p>
            </AnimatedText>
            
            <AnimatedText delay={0.6}>
              <div className="bg-gray-900/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm">
                <p className="text-gray-200 mb-4">
                  <strong>What's next?</strong>
                </p>
                <div className="space-y-2 text-gray-300 text-left max-w-md mx-auto">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>You'll receive an email confirmation shortly</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Priority access based on application order</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Exclusive updates and beta features</span>
                  </div>
                </div>
              </div>
            </AnimatedText>
            
            <AnimatedText delay={0.8}>
              <Link href="/">
                <Button variant="outline" className="border-gray-600 text-gray-200 hover:bg-gray-800/50 hover:text-white hover:border-gray-500 text-lg px-8 py-3 mt-8">
                  Back to Home
                </Button>
              </Link>
            </AnimatedText>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <PublicNavigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-gray-600 to-transparent rounded-full opacity-20 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-l from-gray-500 to-transparent rounded-full opacity-15 blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <AnimatedText delay={0.2}>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Get Early Access
                  <br />
                  to DayGrid
                </h1>
              </AnimatedText>
              
              <AnimatedText delay={0.4}>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Be the first to experience the future of daily task management. Join our exclusive waitlist for priority access.
                </p>
              </AnimatedText>
              
              <FadeInOnScroll>
                <div className="space-y-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-400 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Limited Spots</h3>
                      <p className="text-gray-400">Only 100 early access spots available</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-400 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Priority Access</h3>
                      <p className="text-gray-400">First come, first served</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-400 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Beta Features</h3>
                      <p className="text-gray-400">Access to cutting-edge features</p>
                    </div>
                  </div>
                </div>
              </FadeInOnScroll>
            </div>
            
            <AnimatedCard delay={0.3}>
              <Card className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-gray-700/50 backdrop-blur-sm">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-center text-2xl text-white">Apply Now</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-300 font-medium">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-500 focus:border-gray-500 backdrop-blur-sm"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300 font-medium">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-500 focus:border-gray-500 backdrop-blur-sm"
                        placeholder="john@example.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-gray-300 font-medium">Company (Optional)</Label>
                      <Input
                        id="company"
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-500 focus:border-gray-500 backdrop-blur-sm"
                        placeholder="Acme Corp"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reason" className="text-gray-300 font-medium">Why DayGrid?</Label>
                      <textarea
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={4}
                        className="w-full bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-500 focus:border-gray-500 backdrop-blur-sm rounded-md p-3 resize-none"
                        placeholder="Tell us why you're interested in DayGrid..."
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-gray-200 to-gray-400 text-black hover:from-gray-300 hover:to-gray-500 text-lg px-6 py-4 shadow-2xl hover:shadow-gray-400/30 transition-all duration-300 font-semibold"
                    >
                      {isLoading ? 'Submitting...' : 'Join Waitlist'}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </AnimatedCard>
          </div>
        </div>
      </section>
    </div>
  )
}