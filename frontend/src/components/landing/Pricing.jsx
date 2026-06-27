import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Check, ArrowRight, Zap, Crown } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    icon: Zap,
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started and exploring the platform.',
    features: [
      'Join 1 challenge per month',
      'Basic leaderboard access',
      'Community forum access',
      'Personal score tracking',
    ],
    cta: 'Get Started Free',
    color: 'from-[#818cf8] to-[#a78bfa]',
    glowColor: 'rgba(129,140,248,0.25)',
    popular: false,
  },
  {
    name: 'Pro Monthly',
    icon: Crown,
    price: '$19',
    period: '/month',
    description: 'For serious golfers who want to maximize their impact.',
    features: [
      'Unlimited Score Entries',
      'Entry into Monthly Mega Draws',
      'Advanced Analytics',
      'Priority Support',
    ],
    cta: 'Start Pro Trial',
    color: 'from-accent to-[#84cc16]',
    glowColor: 'rgba(163,230,53,0.25)',
    popular: true,
  },
  {
    name: 'Pro Yearly',
    icon: Crown,
    price: '$190',
    period: '/year',
    description: 'Save $38 — 2 months free. Best value for committed golfers.',
    features: [
      'Everything in Monthly',
      'Entry into Exclusive Yearly Draws',
      'VIP Event Invitations',
      'Custom Profile Badge',
    ],
    cta: 'Choose Yearly',
    color: 'from-gold to-[#fef08a]',
    glowColor: 'rgba(234,179,8,0.25)',
    popular: false,
  },
];

// Configuration for each card's scroll animation timeline
// Heavy overlap so they come fast and orbit together like planets
const cardOrbitConfigs = [
  // Card 1 animates between 0.05 and 0.40
  { startScroll: 0.05, endScroll: 0.40 },
  // Card 2 animates between 0.32 and 0.67
  { startScroll: 0.32, endScroll: 0.67 },
  // Card 3 animates between 0.59 and 0.94
  { startScroll: 0.59, endScroll: 0.94 },
];

function OrbitingCard({ plan, index, scrollYProgress }) {
  const config = cardOrbitConfigs[index];
  
  // Midpoint where the card is exactly at 0deg (horizontal right)
  const midScroll = (config.startScroll + config.endScroll) / 2;

  // The wrapper rotates from -120deg (top-left) to 120deg (bottom-left) -> UP to DOWN
  const wrapperRotate = useTransform(
    scrollYProgress,
    [config.startScroll, config.endScroll],
    [-120, 120]
  );
  
  // To keep the card perfectly upright, we counter-rotate the card itself by the exact opposite amount
  const cardRotate = useTransform(
    scrollYProgress,
    [config.startScroll, config.endScroll],
    [120, -120]
  );

  // Opacity: fade in as it approaches 0deg, fade out as it leaves
  const cardOpacity = useTransform(
    scrollYProgress,
    [config.startScroll, config.startScroll + 0.1, config.endScroll - 0.1, config.endScroll],
    [0, 1, 1, 0]
  );
  
  // Scale slightly up when it's at the center
  const cardScale = useTransform(
    scrollYProgress,
    [config.startScroll, midScroll, config.endScroll],
    [0.5, 1.05, 0.5]
  );

  return (
    <motion.div
      className="absolute top-1/2 left-0 w-0 h-0 flex items-center justify-center pointer-events-none"
      style={{
        rotate: wrapperRotate,
        zIndex: 20 + index,
      }}
    >
      {/* 
        The card itself is translated out by the orbit radius.
        We apply the counter-rotation here so the text stays upright.
      */}
      <motion.div
        className="absolute pointer-events-auto w-[210px] sm:w-[260px] md:w-[300px] xl:w-[340px]"
        style={{
          // Orbit radius: hugging the ball tightly
          x: 'calc(min(58vw, 600px) + 35px)',
          rotate: cardRotate,
          opacity: cardOpacity,
          scale: cardScale,
        }}
      >
        <div
          className={`glass-card rounded-[1.25rem] md:rounded-[2rem] p-4 sm:p-5 md:p-7 backdrop-blur-3xl bg-[rgba(10,15,20,0.85)] border-2 transition-all duration-300 relative overflow-hidden group hover:scale-110 origin-center ${
            plan.popular
              ? 'border-accent/40 shadow-[0_0_40px_rgba(163,230,53,0.15)]'
              : 'border-white/5 hover:border-white/10'
          }`}
        >
          <div
            className="absolute -bottom-16 -right-16 w-40 h-40 rounded-full blur-[50px] opacity-0 group-hover:opacity-20 transition-opacity duration-500"
            style={{ background: `linear-gradient(135deg, ${plan.glowColor}, transparent)` }}
          />

          {plan.popular && (
            <div className="absolute -top-px left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />
          )}

          <div className="mb-5 relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg`}
              >
                <plan.icon className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary">
                {plan.name}
              </h3>
              {plan.popular && (
                <span className="ml-auto text-[10px] font-bold uppercase tracking-widest bg-accent/15 text-accent px-2.5 py-1 rounded-full">
                  Popular
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary">
                {plan.price}
              </span>
              <span className="text-text-tertiary text-[10px] md:text-sm">
                {plan.period}
              </span>
            </div>
            <p className="text-[10px] md:text-xs text-text-tertiary leading-relaxed">{plan.description}</p>
          </div>

          <ul className="space-y-1.5 md:space-y-2.5 mb-4 md:mb-6 relative z-10">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-1.5 md:gap-2.5">
                <Check
                  className={`w-3 h-3 md:w-3.5 md:h-3.5 mt-0.5 flex-shrink-0 ${
                    plan.popular ? 'text-accent' : 'text-text-muted'
                  }`}
                />
                <span className="text-[10px] md:text-sm text-text-secondary">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          <Link to="/signup" className="relative z-10">
            <button
              className={`w-full py-2 md:py-3 rounded-[0.85rem] md:rounded-xl font-semibold text-xs md:text-sm transition-all flex justify-center items-center gap-1.5 md:gap-2 ${
                plan.popular
                  ? 'bg-gradient-to-r from-accent to-[#84cc16] text-bg-primary shadow-lg shadow-accent/20 hover:shadow-accent/40'
                  : 'bg-white/10 text-white hover:bg-white/15 border border-white/5'
              }`}
            >
              {plan.cta}
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Pricing() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Ball slides in at the start, stays for the orbit, then slides back out at the end
  const ballLeft = useTransform(scrollYProgress, [0, 0.10, 0.90, 1], ['-100%', '0%', '0%', '-100%']);
  
  // Ball rotates continuously for the entire 250vh scroll
  const ballRotate = useTransform(scrollYProgress, [0, 1], [0, 1440]);

  // Title fades in along with the ball, but slightly stays in center
  const titleOpacity = useTransform(scrollYProgress, [0, 0.10], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0, 0.10], [40, 0]);

  return (
    <section id="pricing" ref={containerRef} className="relative h-[250vh]">
      
      {/* Sticky interior */}
      <div className="flex sticky top-0 h-screen w-full overflow-hidden flex-col items-center justify-center">
        
        {/* Dark overlay to darken the background image like in hero section */}
        <div className="absolute inset-0 bg-[rgba(5,10,15,0.6)] pointer-events-none z-10" />
        
        {/* ===== SECTION HEADER ===== */}
        <motion.div
          className="absolute top-16 md:top-24 left-0 right-0 z-20 flex flex-col items-center text-center px-8"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Pricing
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-xl">
            Simple, transparent pricing
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Start free and upgrade when you're ready. Every plan includes
            charitable giving — because every golfer can make a difference.
          </p>
        </motion.div>

        {/* ===== GOLD GOLF BALL ===== */}
        {/* It peeks exactly from the left edge of the screen */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-30"
          style={{
            left: ballLeft,
            x: '-50%', // Centers the ball on its left edge, making it 50% visible
          }}
        >
          <motion.img
            src="/gold_golf_ball.webp"
            alt="Golden Golf Ball"
            className="w-[120vw] max-w-[1200px] h-auto relative z-30 drop-shadow-xl"
            style={{ rotate: ballRotate }}
          />
        </motion.div>

        {/* ===== ORBITING PRICING CARDS ===== */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-40">
          {plans.map((plan, index) => (
            <OrbitingCard
              key={plan.name}
              plan={plan}
              index={index}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
