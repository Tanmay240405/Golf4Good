import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { forgotPasswordSchema } from '../utils/validators';
import authService from '../services/authService';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function ForgotPassword() {
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data) => {
    try {
      setApiError('');
      setLoading(true);
      await authService.forgotPassword(data);
      setSuccess(true);
    } catch (err) {
      setApiError(
        err.response?.data?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-4"
      >
        <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-success" />
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-2">
          Check your email
        </h2>
        <p className="text-sm text-text-tertiary mb-6 leading-relaxed">
          We've sent password reset instructions to your email address.
          Please check your inbox and follow the link to reset your password.
        </p>
        <Link to="/login">
          <Button variant="secondary" className="w-full">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-1">
          Reset your password
        </h1>
        <p className="text-sm text-text-tertiary">
          Enter your email and we'll send you reset instructions
        </p>
      </div>

      {apiError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 mb-4 bg-error/10 border border-error/20 rounded-xl"
        >
          <AlertCircle className="w-4 h-4 text-error flex-shrink-0" />
          <p className="text-sm text-error">{apiError}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={Mail}
          error={errors.email?.message}
          {...register('email')}
        />

        <Button
          type="submit"
          isLoading={loading}
          className="w-full"
          size="lg"
        >
          Send Reset Link
        </Button>
      </form>

      <p className="text-sm text-text-tertiary text-center mt-6">
        Remember your password?{' '}
        <Link
          to="/login"
          className="text-accent hover:text-accent-light font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
