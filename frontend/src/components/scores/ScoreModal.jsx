import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

const scoreSchema = z.object({
  score: z.number().min(1, 'Score must be at least 1').max(45, 'Score cannot exceed 45'),
  course: z.string().min(1, 'Course name is required'),
  date: z.string().nonempty('Date is required'),
});

export default function ScoreModal({ isOpen, onClose, onSubmit, initialData, isLoading }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(scoreSchema),
    defaultValues: {
      score: '',
      course: '',
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        score: initialData.score,
        course: initialData.course || '',
        date: new Date(initialData.date).toISOString().split('T')[0],
      });
    } else {
      reset({
        score: '',
        course: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [initialData, isOpen, reset]);

  const onFormSubmit = async (data) => {
    // Add timezone time so backend parses correctly if needed, or just send ISO
    const payload = {
      score: data.score,
      course: data.course,
      date: new Date(data.date).toISOString(),
    };
    await onSubmit(payload);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-bg-primary/80 backdrop-blur-sm z-50 flex justify-center items-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card w-full max-w-md rounded-2xl p-6 relative overflow-hidden"
            >
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold text-white mb-6">
                {initialData ? 'Edit Score' : 'Add New Score'}
              </h2>

              {!initialData && (
                <div className="mb-6 p-3 rounded-xl bg-accent/10 border border-accent/20 text-sm text-text-secondary">
                  <span className="text-accent font-medium">Note:</span> You can maintain up to 5 scores. When adding a 6th, your oldest score will be automatically replaced. Only one score is allowed per date.
                </div>
              )}

              <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Stableford Score (1-45)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="45"
                    disabled={isLoading}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    placeholder="e.g. 36"
                    {...register('score', { valueAsNumber: true })}
                  />
                  {errors.score && (
                    <p className="text-error text-xs mt-1">{errors.score.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Golf Course Location
                  </label>
                  <input
                    type="text"
                    disabled={isLoading}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    placeholder="e.g. Pebble Beach Links"
                    {...register('course')}
                  />
                  {errors.course && (
                    <p className="text-error text-xs mt-1">{errors.course.message}</p>
                  )}
                </div>



                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Date Played
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type="date"
                      disabled={isLoading}
                      max={new Date().toISOString().split('T')[0]} // Max date is today
                      className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all [color-scheme:dark]"
                      {...register('date')}
                    />
                  </div>
                  {errors.date && (
                    <p className="text-error text-xs mt-1">{errors.date.message}</p>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-border/50">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="px-5 py-2.5 rounded-xl font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-5 py-2.5 rounded-xl font-semibold bg-accent hover:bg-accent-light text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : null}
                    {initialData ? 'Update Score' : 'Save Score'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
