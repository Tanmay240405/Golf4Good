import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import AnimatedSection from '../ui/AnimatedSection';

const faqs = [
  {
    question: 'How does Golf4Good work?',
    answer:
      "Golf4Good is a platform that lets you participate in monthly golf challenges while supporting charities. You sign up, enter tournaments, submit your scores, and a portion of entry fees goes directly to verified charitable organizations you choose.",
  },
  {
    question: 'Do I need a handicap to participate?',
    answer:
      "No! While having an official handicap can enhance your experience (especially for Pro users), our platform welcomes golfers of all skill levels. We use a fair scoring system that ensures competitive balance across different ability levels.",
  },
  {
    question: 'How are charities selected and verified?',
    answer:
      "We partner with established charity verification organizations to ensure every charity on our platform is legitimate and impactful. You can browse charities by cause area (education, health, environment, etc.) and see detailed impact reports for each one.",
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      "Absolutely. You can cancel your Pro or Enterprise subscription at any time with no penalties. Your subscription will remain active until the end of your current billing period. You can always continue using the free tier.",
  },
  {
    question: 'How do monthly challenges work?',
    answer:
      "Each month, we host multiple challenges across different formats (stroke play, best ball, etc.). You play your rounds at any registered course, submit your scores through the app, and compete on live leaderboards. Winners are announced at the end of each month.",
  },
  {
    question: 'Is Golf4Good available in my country?',
    answer:
      "Golf4Good is currently available in the United States, Canada, United Kingdom, Australia, and most European countries. We're rapidly expanding to new regions. Sign up for our waitlist if your country isn't supported yet.",
  },
];

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className="glass-card-static overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left group"
      >
        <span className="text-sm md:text-base font-medium text-text-primary pr-4 group-hover:text-accent transition-colors">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-4 h-4 text-text-tertiary" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-5 md:px-6 pb-5 md:pb-6">
              <p className="text-sm text-text-secondary leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-24 relative">
      <div className="container-custom">
        <AnimatedSection className="text-center mb-16">
          <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">
            FAQ
          </p>
          <h2 className="text-3xl md:text-5xl font-bold gradient-text-white mb-4">
            Frequently asked questions
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Everything you need to know about Golf4Good.
            Can't find an answer? Contact our support team.
          </p>
        </AnimatedSection>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <AnimatedSection key={index} delay={index * 0.05}>
              <FAQItem
                faq={faq}
                isOpen={openIndex === index}
                onToggle={() =>
                  setOpenIndex(openIndex === index ? -1 : index)
                }
              />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
