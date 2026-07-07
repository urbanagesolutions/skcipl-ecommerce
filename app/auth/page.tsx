'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Lock, Eye, EyeOff, CheckCircle, ShieldAlert, Mail, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export default function AuthenticationPortal() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot_password'>('login');
  
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [isVerified, setIsVerified] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<{ name: string; email: string } | null>(null);

  const handleSuccessfulLogin = async (user: User) => {
    // Confirm user profile exists in customers table (created by migration trigger)
    let customer = null;
    const { data: dbCustomer } = await supabase
      .from('customers')
      .select('name, email')
      .eq('user_id', user.id)
      .maybeSingle();

    if (dbCustomer) {
      customer = dbCustomer;
    } else {
      // Retry once after 1 second in case trigger is slightly delayed
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const { data: dbCustomerRetry } = await supabase
        .from('customers')
        .select('name, email')
        .eq('user_id', user.id)
        .maybeSingle();
      if (dbCustomerRetry) {
        customer = dbCustomerRetry;
      }
    }

    const customerName = customer?.name || user.email?.split('@')[0] || 'Valued Customer';
    const customerEmail = customer?.email || user.email || '';

    // If customer record was missing entirely, create it as a fallback
    if (!customer) {
      const { error: insertError } = await supabase
        .from('customers')
        .insert({
          user_id: user.id,
          name: customerName,
          email: customerEmail,
        });
      if (insertError) {
        console.error('Fallback customer creation error:', insertError);
      }
    }

    setCustomerInfo({
      name: customerName,
      email: customerEmail,
    });
    setIsVerified(true);
    
    // Auto-redirect to account page after 2.5 seconds
    setTimeout(() => {
      router.push('/account');
    }, 2500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes('invalid login credentials') || error.message.toLowerCase().includes('invalid credentials')) {
          setErrorMessage('Incorrect email or password. Please try again.');
        } else if (error.message.toLowerCase().includes('email not confirmed') || error.message.toLowerCase().includes('confirm your email')) {
          setErrorMessage('Your email address has not been confirmed yet. Please check your inbox for the confirmation email.');
        } else {
          setErrorMessage(error.message);
        }
      } else if (data.user) {
        await handleSuccessfulLogin(data.user);
      } else {
        setErrorMessage('Verification completed but no user session was established.');
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes('user already registered') || error.message.toLowerCase().includes('already exists')) {
          setErrorMessage('This email is already registered. Please sign in instead.');
        } else {
          setErrorMessage(error.message);
        }
      } else if (data.user) {
        if (data.session) {
          // Logged in immediately (email confirmation disabled)
          await handleSuccessfulLogin(data.user);
        } else {
          // Email confirmation enabled
          setSuccessMessage('Registration successful! Please check your email to confirm your account before logging in.');
          // Clear password fields on success
          setPassword('');
          setConfirmPassword('');
        }
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage('A password reset link has been sent to your email address.');
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (isVerified) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-16 flex justify-center items-center">
        <Card elevation={2} className="w-full max-w-[480px] space-y-6 text-center py-8">
          <div className="flex justify-center text-primary">
            <CheckCircle size={64} className="text-emerald-500 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h1 className="text-headline-lg text-on-surface">Login Verified!</h1>
            <p className="text-body-sm text-warm-gray">Welcome back, <span className="font-semibold text-on-surface">{customerInfo?.name}</span></p>
            <p className="text-xs text-warm-gray">{customerInfo?.email}</p>
          </div>
          <div className="pt-4">
            <Button onClick={() => router.push('/account')} variant="primary" fullWidth size="lg" className="flex items-center justify-center gap-2">
              Go to Account <ArrowRight size={16} />
            </Button>
          </div>
          <p className="text-[10px] text-warm-gray animate-pulse">Redirecting you to your account page...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-16 flex justify-center items-center">
      <Card elevation={2} className="w-full max-w-[480px] space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-headline-lg text-on-surface">
            {mode === 'login' && 'Welcome to Sabari Krishna'}
            {mode === 'signup' && 'Create an Account'}
            {mode === 'forgot_password' && 'Reset Password'}
          </h1>
          <p className="text-body-sm text-warm-gray">
            {mode === 'login' && 'Sign in to your account using your email and password.'}
            {mode === 'signup' && 'Register with your email and password to start shopping.'}
            {mode === 'forgot_password' && "Enter your email address and we'll send you a recovery link."}
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="bg-red-50 text-sale-red text-xs p-3 rounded-lg border border-red-200 flex items-center gap-2 font-semibold animate-fade-in">
            <ShieldAlert size={14} /> {errorMessage}
          </div>
        )}

        {/* Success message */}
        {successMessage && (
          <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-lg border border-emerald-200 flex items-center gap-2 font-semibold animate-fade-in">
            <CheckCircle size={14} className="text-emerald-600" /> {successMessage}
          </div>
        )}

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase">Email Address</label>
              <Input
                required
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={16} />}
              />
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-on-surface-variant uppercase">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage('');
                    setSuccessMessage('');
                    setMode('forgot_password');
                  }}
                  className="text-xs text-primary font-bold hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative w-full">
                <Input
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock size={16} />}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-warm-gray hover:text-on-surface z-10"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" fullWidth size="lg" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setSuccessMessage('');
                  setMode('signup');
                }}
                className="text-xs text-primary font-bold hover:underline"
              >
                {"Don't have an account? Sign Up"}
              </button>
            </div>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase">Email Address</label>
              <Input
                required
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={16} />}
              />
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase">Password (min 8 chars)</label>
              <div className="relative w-full">
                <Input
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock size={16} />}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-warm-gray hover:text-on-surface z-10"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase">Confirm Password</label>
              <Input
                required
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<Lock size={16} />}
              />
            </div>

            <Button type="submit" variant="primary" fullWidth size="lg" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setSuccessMessage('');
                  setMode('login');
                }}
                className="text-xs text-primary font-bold hover:underline"
              >
                Already have an account? Sign In
              </button>
            </div>
          </form>
        )}

        {mode === 'forgot_password' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase">Email Address</label>
              <Input
                required
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={16} />}
              />
            </div>

            <Button type="submit" variant="primary" fullWidth size="lg" disabled={loading}>
              {loading ? 'Sending Link...' : 'Send Reset Link'}
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setSuccessMessage('');
                  setMode('login');
                }}
                className="text-xs text-primary font-bold hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        <div className="border-t border-border-subtle pt-4 text-center">
          <p className="text-[10px] text-warm-gray leading-relaxed">
            By signing in, you agree to Sabari Krishna Terms of Service and Privacy Policy. FSSAI food safety regulations are maintained throughout delivery.
          </p>
        </div>

      </Card>
    </div>
  );
}
