'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { KeyRound, ShieldAlert, Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AuthenticationPortal() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<{ name: string; email: string } | null>(null);

  // Future phone OTP integration variable
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startCooldown = () => {
    setCooldown(30);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    setErrorMessage('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) {
        if (error.status === 429) {
          setErrorMessage('Too many requests. Please wait a moment before trying again.');
        } else {
          setErrorMessage(error.message);
        }
      } else {
        setOtpSent(true);
        startCooldown();
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit OTP code.');
      return;
    }
    setErrorMessage('');
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: 'email',
      });
      if (error) {
        setErrorMessage(error.message);
      } else if (data.user) {
        // Confirm user profile exists in customers table (created by migration trigger)
        let customer = null;
        const { data: dbCustomer } = await supabase
          .from('customers')
          .select('name, email')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if (dbCustomer) {
          customer = dbCustomer;
        } else {
          // Retry once after 1 second in case trigger is slightly delayed
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const { data: dbCustomerRetry } = await supabase
            .from('customers')
            .select('name, email')
            .eq('user_id', data.user.id)
            .maybeSingle();
          if (dbCustomerRetry) {
            customer = dbCustomerRetry;
          }
        }

        const customerName = customer?.name || data.user.email?.split('@')[0] || 'Valued Customer';
        const customerEmail = customer?.email || data.user.email || '';

        // If customer record was missing entirely, create it as a fallback
        if (!customer) {
          const { error: insertError } = await supabase
            .from('customers')
            .insert({
              user_id: data.user.id,
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
      } else {
        setErrorMessage('Verification completed but no user session was established.');
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    setErrorMessage('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) {
        if (error.status === 429) {
          setErrorMessage('Too many requests. Please wait a moment before trying again.');
        } else {
          setErrorMessage(error.message);
        }
      } else {
        startCooldown();
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
          <h1 className="text-headline-lg text-on-surface">Welcome to Sabari Krishna</h1>
          <p className="text-body-sm text-warm-gray">Sign in or register using your email address.</p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="bg-red-50 text-sale-red text-xs p-3 rounded-lg border border-red-200 flex items-center gap-2 font-semibold">
            <ShieldAlert size={14} /> {errorMessage}
          </div>
        )}

        {!otpSent ? (
          // Step 1: Send OTP
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-on-surface-variant uppercase">Email Address</label>
                {/* TODO: add Phone OTP tab once SMS provider is configured */}
              </div>
              <div className="flex gap-2 items-center">
                <Input
                  required
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail size={16} />}
                />
              </div>
            </div>

            <Button type="submit" variant="primary" fullWidth size="lg" disabled={loading}>
              {loading ? 'Sending...' : 'Send Verification OTP'}
            </Button>
          </form>
        ) : (
          // Step 2: Verify OTP
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <Badge variant="secondary" className="mb-2">OTP Sent to {email}</Badge>
              <label className="block text-xs font-bold text-on-surface-variant uppercase">One-Time Password (OTP)</label>
              <Input
                required
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit code"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                icon={<KeyRound size={16} />}
              />
            </div>

            <Button type="submit" variant="secondary" fullWidth size="lg" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Complete Sign In'}
            </Button>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={cooldown > 0 || loading}
                className={`w-full text-center text-xs font-bold hover:underline ${cooldown > 0 ? 'text-warm-gray cursor-not-allowed' : 'text-primary'}`}
              >
                {cooldown > 0 ? `Resend OTP (${cooldown}s)` : 'Resend OTP'}
              </button>

              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full text-center text-xs text-primary font-bold hover:underline"
              >
                Change Email Address
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
