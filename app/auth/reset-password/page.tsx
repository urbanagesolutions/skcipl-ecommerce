'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Lock, Eye, EyeOff, CheckCircle, ShieldAlert, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
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
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage('Password updated successfully! Redirecting you to login...');
        setTimeout(() => {
          router.push('/auth');
        }, 2500);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (successMessage) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-16 flex justify-center items-center">
        <Card elevation={2} className="w-full max-w-[480px] space-y-6 text-center py-8">
          <div className="flex justify-center text-primary">
            <CheckCircle size={64} className="text-emerald-500 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h1 className="text-headline-lg text-on-surface">Password Updated!</h1>
            <p className="text-body-sm text-warm-gray">{successMessage}</p>
          </div>
          <div className="pt-4">
            <Button onClick={() => router.push('/auth')} variant="primary" fullWidth size="lg" className="flex items-center justify-center gap-2">
              Go to Sign In <ArrowRight size={16} />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-16 flex justify-center items-center">
      <Card elevation={2} className="w-full max-w-[480px] space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-headline-lg text-on-surface">Set New Password</h1>
          <p className="text-body-sm text-warm-gray">Please enter your new password below.</p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="bg-red-50 text-sale-red text-xs p-3 rounded-lg border border-red-200 flex items-center gap-2 font-semibold animate-fade-in">
            <ShieldAlert size={14} /> {errorMessage}
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-4">
          {/* New Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-on-surface-variant uppercase">New Password</label>
            <div className="relative w-full">
              <Input
                required
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password (min 8 chars)"
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

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-on-surface-variant uppercase">Confirm New Password</label>
            <Input
              required
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock size={16} />}
            />
          </div>

          <Button type="submit" variant="primary" fullWidth size="lg" disabled={loading}>
            {loading ? 'Updating Password...' : 'Update Password'}
          </Button>
        </form>

        <div className="border-t border-border-subtle pt-4 text-center">
          <button
            type="button"
            onClick={() => router.push('/auth')}
            className="text-xs text-primary font-bold hover:underline"
          >
            Back to Sign In
          </button>
        </div>

      </Card>
    </div>
  );
}
