import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti'; // We'll assume this is uninstalled, let's use CSS animations or simple framer motion instead.
// Wait, I will use Framer motion to create a beautiful success icon animation without external libs.

export default function SubscriptionSuccess() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh] relative z-10 px-4">
      <Confetti recycle={false} numberOfPieces={200} />
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-success/20 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
        className="glass-card rounded-[2.5rem] p-10 md:p-14 text-center max-w-lg w-full border border-success/30 relative overflow-hidden backdrop-blur-2xl bg-[rgba(10,15,20,0.8)] shadow-[0_0_50px_rgba(34,197,94,0.15)]"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', bounce: 0.6 }}
          className="w-24 h-24 bg-gradient-to-br from-success to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-success/30 border-4 border-bg-primary relative z-10"
        >
          <Check className="w-12 h-12 text-white" strokeWidth={3} />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl md:text-4xl font-bold text-white mb-4"
        >
          Payment Successful!
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-text-secondary text-lg mb-10"
        >
          You are now a Golf4Good Pro member. Get ready to hit the course and make an impact.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link 
            to="/dashboard"
            className="w-full py-4 rounded-xl bg-white text-bg-primary font-bold text-lg hover:bg-gray-200 transition-colors flex justify-center items-center gap-2 group"
          >
            Go to Dashboard 
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
