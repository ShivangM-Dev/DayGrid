'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/shared/ui/button'
import { ThemeToggle } from '@/components/shared/ui/theme-toggle'
import { Target, Menu, X, Settings, User, LogOut, Home, Calendar } from 'lucide-react'
interface DashboardNavigationProps {
  currentPage?: string
}

export function DashboardNavigation({ currentPage = 'dashboard' }: DashboardNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-sm shadow-sm border-b border-border' 
        : 'bg-transparent border-transparent shadow-none'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-3">
            <Target className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">DayGrid</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/dashboard" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                currentPage === 'dashboard' 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link 
              href="/dashboard/calendar" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                currentPage === 'calendar' 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Calendar</span>
            </Link>
            <Link 
              href="/dashboard/settings" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                currentPage === 'settings' 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <span className="text-sm text-muted-foreground">
              Welcome, User
            </span>
            <div className="relative group">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <User className="w-4 h-4" />
              </Button>
              <div className="absolute right-0 mt-2 w-48 bg-popover rounded-md shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link 
                  href="/dashboard/profile" 
                  className="block px-4 py-2 text-sm text-popover-foreground hover:bg-muted"
                >
                  Profile
                </Link>
                <Link 
                  href="/dashboard/settings" 
                  className="block px-4 py-2 text-sm text-popover-foreground hover:bg-muted"
                >
                  Settings
                </Link>
                <hr className="my-1 border-border" />
                <Link 
                  href="/"
                  className="block w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-muted"
                >
                  Exit Dashboard
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

       {/* Mobile Menu */}
       {isMenuOpen && (
         <div className="md:hidden bg-background border-t border-border">
           <div className="px-2 pt-2 pb-3 space-y-1">
             <Link 
               href="/dashboard" 
               className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
             >
               <Home className="w-5 h-5" />
               <span>Dashboard</span>
             </Link>
             <Link 
               href="/dashboard/calendar" 
               className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
             >
               <Calendar className="w-5 h-5" />
               <span>Calendar</span>
             </Link>
             <Link 
               href="/dashboard/settings" 
               className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
             >
               <Settings className="w-5 h-5" />
               <span>Settings</span>
             </Link>
             <hr className="my-1 border-border" />
             <div className="px-3 py-2 text-sm text-muted-foreground">
               Welcome, User
             </div>
             <Link 
               href="/dashboard/profile" 
               className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
             >
               Profile
             </Link>
             <Link 
               href="/dashboard/settings" 
               className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
             >
               Settings
             </Link>
             <Link 
               href="/"
               className="block w-full text-left px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
             >
               Exit Dashboard
             </Link>
           </div>
         </div>
       )}
    </nav>
  )
}