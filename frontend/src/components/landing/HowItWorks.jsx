import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Target, Trophy, Heart } from 'lucide-react';

const steps = [
  {
    id: 0,
    label: 'Step 1',
    icon: UserPlus,
    title: 'Create Your Account',
    description: 'Sign up in seconds and set up your golfer profile. Connect your handicap and choose your preferred charities.',
    color: 'from-accent to-accent-light',
    glowColor: 'shadow-accent-glow',
  },
  {
    id: 1,
    label: 'Step 2',
    icon: Target,
    title: 'Enter Monthly Challenges',
    description: 'Join monthly tournaments with players at your skill level. Submit your scores from any registered course.',
    color: 'from-gold to-gold-light',
    glowColor: 'shadow-gold-glow',
  },
  {
    id: 2,
    label: 'Step 3',
    icon: Trophy,
    title: 'Compete & Win',
    description: 'Track your progress on live leaderboards. Climb the ranks and earn prizes, rewards, and recognition.',
    color: 'from-[#818cf8] to-[#a78bfa]',
    glowColor: 'shadow-[rgba(129,140,248,0.15)]',
  },
  {
    id: 3,
    label: 'Step 4',
    icon: Heart,
    title: 'Support Charities',
    description: 'A portion of every entry goes directly to verified charities. You choose where your impact goes.',
    color: 'from-[#f472b6] to-[#fb7185]',
    glowColor: 'shadow-[rgba(244,114,182,0.15)]',
  },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="features" className="relative min-h-screen py-20 flex flex-col justify-center">
      <div className="relative z-10 h-full flex flex-col items-start justify-center px-8 md:px-16 lg:px-24 w-full">
        
        {/* Container aligned with Hero bounds */}
        <div className="flex flex-col w-full max-w-[440px]">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              How It Works
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight drop-shadow-xl">
              Four steps to <br/>real impact
            </h2>
          </motion.div>

          {/* Single Unified Interactive Card */}
          <div className="glass-card rounded-[2rem] backdrop-blur-2xl bg-[rgba(10,15,20,0.65)] overflow-hidden flex flex-col relative min-h-[270px] justify-between">
            
            {/* --- TOP RULER EDGE --- */}
            <div className="relative w-full">
              <div 
                className="h-1.5 w-full opacity-30" 
                style={{ backgroundImage: 'repeating-linear-gradient(to right, white 0px, white 1px, transparent 1px, transparent 8px)' }}
              />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-accent opacity-80" />
            </div>

            {/* --- SELECTABLE DIAL ITEMS --- */}
            <div className="w-full flex items-center justify-between px-8 py-3.5 relative z-10">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => setActiveStep(index)}
                    className={`text-[14px] font-bold transition-all duration-300 ${
                      activeStep === index 
                        ? 'text-white scale-105 drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]' 
                        : 'text-text-muted hover:text-text-secondary scale-100'
                    }`}
                  >
                    Step {index + 1}
                  </button>
                  {index < steps.length - 1 && (
                    <span className="mx-3 text-white/10 text-base">|</span>
                  )}
                </div>
              ))}
            </div>

            {/* The Dynamic Content Area */}
            <div className="flex-1 px-8 py-5 relative flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full relative z-10"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${steps[activeStep].color} flex items-center justify-center shadow-lg ${steps[activeStep].glowColor}`}>
                      {(() => {
                        const IconComponent = steps[activeStep].icon;
                        return <IconComponent className="w-5 h-5 text-white" />;
                      })()}
                    </div>

                    <div className="flex-1 pt-0.5">
                      {/* Step label */}
                      <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest block mb-0.5">
                        {steps[activeStep].label}
                      </span>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white mb-1.5">
                        {steps[activeStep].title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {steps[activeStep].description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Subtle glowing orb inside the card matching the active color */}
              <div className={`absolute -bottom-20 -right-20 w-48 h-48 rounded-full filter blur-[60px] opacity-10 transition-colors duration-500 bg-gradient-to-br ${steps[activeStep].color}`} />
            </div>

            {/* --- BOTTOM RULER EDGE --- */}
            <div className="relative w-full mt-auto">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-accent opacity-80" />
              <div 
                className="h-1.5 w-full opacity-30" 
                style={{ backgroundImage: 'repeating-linear-gradient(to right, white 0px, white 1px, transparent 1px, transparent 8px)' }}
              />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
