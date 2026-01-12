'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/shared/ui/button'
import { Target, Menu, X } from 'lucide-react'

interface PublicNavigationProps {
  currentPath?: string
}

export function PublicNavigation({ currentPath = '/' }: PublicNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  // Waitlist page - show only logo
  if (currentPath === '/waitlist') {
    return (
      <nav className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-black/5 backdrop-blur-xl border border-gray-800/20 shadow-2xl rounded-2xl px-6 py-3 z-50">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-gray-400/20 transition-all duration-300 group-hover:scale-105">
            <Target className="w-4 h-4 text-black" />
          </div>
          <span className="text-lg font-light tracking-tight text-white">DayGrid</span>
        </Link>
      </nav>
    )
  }

  return (
    <>
      {/* Transparent at top, hide when scrolled */}
      <nav className={`fixed top-0 w-full h-20 z-40 transition-all duration-700 ease-in-out ${
        isScrolled ? 'opacity-0 -translate-y-full pointer-events-none' : 'bg-transparent border-transparent opacity-100 translate-y-0'
      }`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 h-full flex items-center">
            {/* Logo - Left */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-gray-400/20 transition-all duration-300 group-hover:scale-105">
                <Target className="w-6 h-6 text-black" />
              </div>
              <span className="text-3xl font-light tracking-tight text-white">DayGrid</span>
            </Link>
            
            {/* Navigation - Center */}
            <div className="hidden md:flex items-center space-x-12 ml-auto">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-400 hover:text-white text-sm font-light tracking-wide transition-all duration-300 hover:text-gray-200"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-400 hover:text-white text-sm font-light tracking-wide transition-all duration-300 hover:text-gray-200"
              >
                How It Works
              </button>
              <Link href="/manifesto" className="text-gray-400 hover:text-white text-sm font-light tracking-wide transition-all duration-300 hover:text-gray-200">
                Manifesto
              </Link>
            </div>

            {/* CTA - Right */}
            <div className="flex items-center space-x-4 ml-auto">
              <Link href="/waitlist">
                <Button className="bg-gradient-to-r from-gray-100 to-gray-300 text-black hover:from-gray-200 hover:to-gray-400 text-base font-medium px-8 py-3 rounded-xl shadow-xl hover:shadow-gray-300/25 transition-all duration-300 tracking-wide">
                  Join Waitlist
                </Button>
              </Link>
            </div>

            <button
              className="md:hidden text-gray-400 hover:text-white transition-colors duration-300 ml-4"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
       
      {/* Enhanced Glassy dock when scrolled */}
      <nav className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 bg-black/20 backdrop-blur-3xl border border-white/20 shadow-2xl max-w-fit rounded-2xl px-6 transition-all duration-700 ease-in-out ${
        isScrolled ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}>
          <div className="flex items-center space-x-6 transition-all duration-500 py-3 relative">
            {/* Inner glow effect */}
            <div className="absolute inset-0 bg-white/10 rounded-2xl blur-md"></div>
            {/* Logo - Left */}
            <Link href="/" className="flex items-center space-x-3 group relative z-10">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-gray-400/20 transition-all duration-300 group-hover:scale-105">
                <Target className="w-4 h-4 text-black" />
              </div>
              <span className="text-base font-light tracking-tight text-white transition-all duration-300">DayGrid</span>
            </Link>
          
            {/* Navigation - Center */}
            <div className="hidden lg:flex items-center space-x-8 transition-all duration-300 opacity-90 relative z-10">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-300 hover:text-white text-sm font-light tracking-wide transition-all duration-300 hover:text-gray-200"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-300 hover:text-white text-sm font-light tracking-wide transition-all duration-300 hover:text-gray-200"
              >
                How It Works
              </button>
              <Link href="/manifesto" className="text-gray-300 hover:text-white text-sm font-light tracking-wide transition-all duration-300 hover:text-gray-200">
                Manifesto
              </Link>
            </div>

            {/* CTA - Right */}
            <div className="flex items-center space-x-3 transition-all duration-300 opacity-90 relative z-10">
              <Link href="/waitlist">
                <Button className="bg-gradient-to-r from-gray-100 to-gray-300 text-black hover:from-gray-200 hover:to-gray-400 text-xs px-4 py-2 rounded-lg shadow-md hover:shadow-gray-300/20 transition-all duration-300 tracking-wide">
                  Join Waitlist
                </Button>
              </Link>
            </div>

            <button
              className="lg:hidden text-gray-400 hover:text-white transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed top-20 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-2xl border border-gray-800/30 rounded-2xl shadow-2xl p-6 z-40 min-w-[200px]">
          <div className="space-y-4">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-400 hover:text-white text-base font-light tracking-wide transition-all duration-300 hover:text-gray-200"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-400 hover:text-white text-base font-light tracking-wide transition-all duration-300 hover:text-gray-200"
              >
                How It Works
              </button>
              <Link href="/manifesto" className="text-gray-400 hover:text-white text-base font-light tracking-wide transition-all duration-300 hover:text-gray-200">
                Manifesto
              </Link>
            <div className="border-t border-gray-700 pt-4">
              <Link href="/waitlist" className="block">
                <Button className="w-full bg-gradient-to-r from-gray-100 to-gray-300 text-black hover:from-gray-200 hover:to-gray-400 text-sm font-medium py-3 rounded-xl shadow-xl">
                  Join Waitlist
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}