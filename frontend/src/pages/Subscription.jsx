import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { subscriptionService } from '../services/subscriptionService';
import toast from 'react-hot-toast';

export default function Subscription() {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSub, setCurrentSub] = useState(null);

  useEffect(() => {
    loadCurrentSubscription();
  }, []);

  const loadCurrentSubscription = async () => {
    try {
      const response = await subscriptionService.getCurrentSubscription();
      if (response.success && response.data.status === 'ACTIVE') {
        setCurrentSub(response.data);
      }
    } catch (error) {
      console.error("Failed to load subscription status", error);
    }
  };

  const handleSubscribe = async (plan) => {
    setIsProcessing(true);
    try {
      const response = await subscriptionService.checkout(plan);
      if (response.success) {
        toast.success('Subscription activated!');
        navigate('/dashboard/subscription/success');
      }
    } catch (error) {
      toast.error('Failed to process subscription');
    } finally {
      setIsProcessing(false);
    }
  };

  const plans = [
    {
      name: 'Pro Monthly',
      planId: 'MONTHLY',
      price: '$19',
      period: '/month',
      icon: <Zap className="w-6 h-6 text-[#a855f7]" />,
      color: 'from-[#a855f7] to-[#d8b4fe]',
      features: [
        'Unlimited Score Entries',
        'Entry into Monthly Mega Draws',
        'Advanced Analytics',
        'Priority Support',
      ]
    },
    {
      name: 'Pro Yearly',
      planId: 'YEARLY',
      price: '$190',
      period: '/year',
      icon: <Crown className="w-6 h-6 text-gold" />,
      color: 'from-gold to-[#fef08a]',
      isPopular: true,
      savings: 'Save $38 (2 months free)',
      features: [
        'Everything in Monthly',
        'Entry into Exclusive Yearly Draws',
        'VIP Event Invitations',
        'Custom Profile Badge',
      ]
    }
  ];

  return (
    <div className="flex flex-col w-full relative z-10 pb-20 items-center">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 max-w-2xl"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-xl">
          Upgrade to <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-[#fef08a]">Pro</span>
        </h1>
        <p className="text-text-secondary text-lg">
          Unlock exclusive tournaments, larger prize pools, and maximize your impact for charity.
        </p>
      </motion.div>

      {/* Toggle */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-4 bg-white/5 p-1.5 rounded-full border border-white/10 mb-12"
      >
        <button
          onClick={() => setIsYearly(false)}
          className={`px-6 py-2.5 rounded-full font-semibold transition-all ${!isYearly ? 'bg-white text-bg-primary shadow-lg' : 'text-text-secondary hover:text-white'}`}
        >
          Monthly
        </button>
        <button
          onClick={() => setIsYearly(true)}
          className={`px-6 py-2.5 rounded-full font-semibold transition-all flex items-center gap-2 ${isYearly ? 'bg-gradient-to-r from-gold to-[#eab308] text-bg-primary shadow-lg shadow-gold/20' : 'text-text-secondary hover:text-white'}`}
        >
          Yearly <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full text-white/90">Save 16%</span>
        </button>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
        {plans.map((plan, index) => {
          const isActive = currentSub?.plan === plan.planId;
          const isSelectedPlan = isYearly ? plan.planId === 'YEARLY' : plan.planId === 'MONTHLY';
          
          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={`relative glass-card rounded-[2.5rem] p-8 border-2 transition-all duration-300 bg-[rgba(10,15,20,0.7)] backdrop-blur-2xl ${
                isSelectedPlan ? 'border-accent/40 shadow-[0_0_40px_rgba(163,230,53,0.15)] scale-100 md:scale-105 z-10' : 'border-white/5 scale-100 opacity-90 hover:opacity-100'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold to-[#fef08a] text-bg-primary text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-lg shadow-gold/20">
                  <Star className="w-3 h-3 fill-bg-primary" /> MOST POPULAR
                </div>
              )}
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 bg-opacity-20 backdrop-blur-md border border-white/10 shadow-inner`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                  {plan.savings && <p className="text-success text-sm font-medium">{plan.savings}</p>}
                </div>
              </div>
              
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-5xl font-bold text-white tracking-tight">{plan.price}</span>
                <span className="text-text-muted font-medium">{plan.period}</span>
              </div>
              
              <ul className="flex flex-col gap-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-text-secondary font-medium">
                    <div className="mt-1 bg-white/10 rounded-full p-0.5 shrink-0">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handleSubscribe(plan.planId)}
                disabled={isProcessing || isActive}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex justify-center items-center gap-2 ${
                  isActive 
                    ? 'bg-white/10 text-white/50 cursor-not-allowed border border-white/5' 
                    : isSelectedPlan 
                      ? 'bg-gradient-to-r from-accent to-[#84cc16] text-bg-primary shadow-lg shadow-accent/20 hover:shadow-accent/40' 
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/5'
                }`}
              >
                {isProcessing && isSelectedPlan ? (
                  <div className="w-5 h-5 border-2 border-bg-primary border-t-transparent rounded-full animate-spin" />
                ) : isActive ? (
                  'Current Plan'
                ) : (
                  'Choose Plan'
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
      
      {/* Mock payment disclaimer */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 text-sm text-text-muted text-center max-w-md"
      >
        Payments are processed securely via Stripe. You can cancel your subscription at any time from your account settings.
      </motion.p>
    </div>
  );
}
