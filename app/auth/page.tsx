'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { KeyRound, ShieldAlert } from 'lucide-react';

export default function AuthenticationPortal() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit Indian phone number.');
      return;
    }
    setErrorMessage('');
    setOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '1234') {
      setErrorMessage('Invalid OTP code. For testing, please use 1234.');
      return;
    }
    setErrorMessage('');
    alert('Verification successful! Logging in...');
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-16 flex justify-center items-center">
      <Card elevation={2} className="w-full max-w-[480px] space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-headline-lg text-on-surface">Welcome to Sabari Krishna</h1>
          <p className="text-body-sm text-warm-gray">Sign in or register using your mobile number.</p>
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
              <label className="text-xs font-bold text-on-surface-variant uppercase">Mobile Number</label>
              <div className="flex gap-2 items-center">
                <span className="bg-gray-100 border border-border-subtle px-3 py-3 rounded-md text-body-sm font-semibold text-on-surface-variant">+91</span>
                <Input
                  required
                  type="tel"
                  maxLength={10}
                  placeholder="Enter 10 digit number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>

            <Button type="submit" variant="primary" fullWidth size="lg">
              Send Verification OTP
            </Button>
          </form>
        ) : (
          // Step 2: Verify OTP
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <Badge variant="secondary" className="mb-2">OTP Sent to +91 {phoneNumber}</Badge>
              <label className="block text-xs font-bold text-on-surface-variant uppercase">One-Time Password (OTP)</label>
              <Input
                required
                type="text"
                maxLength={4}
                placeholder="Enter 4 digit code (use 1234)"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                icon={<KeyRound size={16} />}
              />
            </div>

            <Button type="submit" variant="secondary" fullWidth size="lg">
              Verify & Complete Sign In
            </Button>

            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="w-full text-center text-xs text-primary font-bold hover:underline"
            >
              Change Mobile Number
            </button>
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
