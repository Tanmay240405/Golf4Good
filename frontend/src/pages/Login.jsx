import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { loginSchema } from '../utils/validators';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Login() {
  const [apiError, setApiError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      setApiError('');
      await login(data);
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(
        err.response?.data?.message || 'Invalid email or password. Please try again.'
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-1">
          Welcome back
        </h1>
        <p className="text-sm text-text-tertiary">
          Sign in to your account to continue
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

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('remember')}
              className="w-4 h-4 rounded bg-bg-tertiary border-border text-accent focus:ring-accent/30 cursor-pointer"
            />
            <span className="text-sm text-text-tertiary">Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-accent hover:text-accent-light transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          isLoading={loading}
          className="w-full"
          size="lg"
        >
          Sign In
        </Button>
      </form>

      <p className="text-sm text-text-tertiary text-center mt-6">
        Don't have an account?{' '}
        <Link
          to="/signup"
          className="text-accent hover:text-accent-light font-medium transition-colors"
        >
          Create one
        </Link>
      </p>
    </motion.div>
  );
}
