import { Target } from 'lucide-react'
import { FooterSectionProps, FooterSection as FooterSectionData } from '@/types/public-side'

/**
 * Footer component - Site footer with navigation and branding
 * Clean, organized layout with company information
 */
export function FooterSection({ className }: FooterSectionProps = {}) {
  const footerSections: FooterSectionData[] = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#' },
        { label: 'API', href: '#' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '#' },
        { label: 'Contact', href: '#' },
        { label: 'Status', href: '#' }
      ]
    }
  ]

  return (
    <footer className={`py-20 px-6 lg:px-8 bg-black border-t border-gray-900/50 ${className || ''}`}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 rounded-xl flex items-center justify-center shadow-lg">
                <Target className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-light tracking-tight text-white">DayGrid</span>
            </div>
            <p className="text-gray-500 text-sm font-light leading-relaxed">
              Elevate your daily workflow with advanced task management designed for excellence.
            </p>
          </div>
          
          {/* Dynamic Footer Sections */}
          {footerSections.map((section: FooterSectionData, sectionIndex: number) => (
            <div key={sectionIndex}>
              <h4 className="text-white font-light mb-6 text-sm tracking-widest uppercase">
                {section.title}
              </h4>
              <ul className="space-y-4 text-gray-500 text-sm font-light">
                {section.links.map((link, linkIndex: number) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href} 
                      className="hover:text-gray-300 transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-900/50 mt-16 pt-12 text-center text-gray-600 text-sm font-light">
          <p>&copy; 2024 DayGrid. Crafted with precision.</p>
        </div>
      </div>
    </footer>
  )
}