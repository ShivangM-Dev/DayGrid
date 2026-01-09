import { BackgroundEffectsProps } from '@/types/public-side'

/**
 * BackgroundEffects component - Premium background visual effects
 * Creates gradient orbs, particles, and grid lines for the landing page
 */
export function BackgroundEffects({ className }: BackgroundEffectsProps = {}) {
  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className || ''}`}>
      {/* Enhanced Gradient Orbs - Increased Brightness */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-r from-gray-300 via-transparent to-gray-400 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      <div 
        className="absolute top-32 right-32 w-[700px] h-[700px] bg-gradient-to-l from-gray-200 via-transparent to-gray-300 rounded-full opacity-15 blur-3xl animate-pulse" 
        style={{animationDelay: '3s'}}
      ></div>
      <div 
        className="absolute bottom-0 left-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-gray-400 via-transparent to-gray-300 rounded-full opacity-18 blur-3xl animate-pulse" 
        style={{animationDelay: '5s'}}
      ></div>
      
      {/* Enhanced Particles - Increased Brightness */}
      <div 
        className="absolute top-1/3 left-20 w-1 h-1 bg-gray-300 rounded-full opacity-60 animate-pulse" 
        style={{animationDuration: '4s'}}
      ></div>
      <div 
        className="absolute top-1/2 right-32 w-0.5 h-0.5 bg-gray-200 rounded-full opacity-50 animate-pulse" 
        style={{animationDuration: '5s', animationDelay: '2s'}}
      ></div>
      <div 
        className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-gray-300 rounded-full opacity-55 animate-pulse" 
        style={{animationDuration: '4.5s', animationDelay: '1s'}}
      ></div>
      

    </div>
  )
}