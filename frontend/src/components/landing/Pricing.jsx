import { Link } from 'react-router-dom';
import { Check, ArrowRight, Zap, Crown, Building2 } from 'lucide-react';
import AnimatedSection from '../ui/AnimatedSection';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const plans = [
  {
    name: 'Free',
    icon: Zap,
    price: 0,
    period: 'forever',
    description: 'Perfect for getting started and exploring the platform.',
    features: [
      'Join 1 challenge per month',
      'Basic leaderboard access',
      'Community forum access',
      'Personal score tracking',
      'Choose 1 charity to support',
    ],
    cta: 'Get Started Free',
    variant: 'secondary',
    popular: false,
  },
  {
    name: 'Pro',
    icon: Crown,
    price: 29,
    period: '/month',
    description: 'For serious golfers who want to maximize their impact.',
    features: [
      'Unlimited monthly challenges',
      'Advanced analytics & insights',
      'Priority leaderboard placement',
      'Custom charity portfolio',
      'Exclusive Pro tournaments',
      'Verified handicap tracking',
      'Mobile app access',
    ],
    cta: 'Start Pro Trial',
    variant: 'primary',
    popular: true,
  },
  {
    name: 'Enterprise',
    icon: Building2,
    price: 99,
    period: '/month',
    description: 'For golf clubs and corporate teams.',
    features: [
      'Everything in Pro',
      'Team management dashboard',
      'Custom branded tournaments',
      'Dedicated account manager',
      'API access & integrations',
      'White-label options',
      'Priority support',
      'Custom reporting',
    ],
    cta: 'Contact Sales',
    variant: 'secondary',
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="container-custom">
        <AnimatedSection className="text-center mb-16">
          <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">
            Pricing
          </p>
          <h2 className="text-3xl md:text-5xl font-bold gradient-text-white mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Start free and upgrade when you're ready. Every plan includes
            charitable giving — because every golfer can make a difference.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <AnimatedSection key={plan.name} delay={index * 0.1}>
              <div
                className={`glass-card p-8 h-full flex flex-col relative ${
                  plan.popular
                    ? 'border-accent/40 shadow-lg shadow-accent-glow'
                    : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="accent" className="py-1 px-3 text-xs">
                      Most Popular
                    </Badge>
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      plan.popular ? 'bg-accent/10' : 'bg-white/5'
                    }`}>
                      <plan.icon className={`w-4 h-4 ${plan.popular ? 'text-accent' : 'text-text-secondary'}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary">
                      {plan.name}
                    </h3>
                  </div>

                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-text-primary">
                      ${plan.price}
                    </span>
                    <span className="text-text-tertiary text-sm">
                      {plan.period}
                    </span>
                  </div>
                  <p className="text-sm text-text-tertiary">{plan.description}</p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        plan.popular ? 'text-accent' : 'text-text-muted'
                      }`} />
                      <span className="text-sm text-text-secondary">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link to="/signup">
                  <Button
                    variant={plan.variant}
                    className="w-full"
                    size="md"
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
