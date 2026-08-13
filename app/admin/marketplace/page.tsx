'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function MarketplaceSync() {
  // Amazon Sync States
  const [amazonActive, setAmazonActive] = useState(true);
  const [amazonSyncing, setAmazonSyncing] = useState(false);
  const [amazonProgress, setAmazonProgress] = useState(0);
  const [amazonLastSync, setAmazonLastSync] = useState('06 July 2026 14:30');
  const [amazonSyncedCount, setAmazonSyncedCount] = useState(0);

  // Flipkart Sync States
  const [flipkartActive, setFlipkartActive] = useState(false);
  const [flipkartSyncing, setFlipkartSyncing] = useState(false);
  const [flipkartProgress, setFlipkartProgress] = useState(0);
  const [flipkartLastSync, setFlipkartLastSync] = useState('05 July 2026 18:22');
  const [flipkartSyncedCount, setFlipkartSyncedCount] = useState(0);

  const triggerAmazonSync = async () => {
    if (!amazonActive) return;
    setAmazonSyncing(true);
    setAmazonProgress(0);
    try {
      const res = await fetch('/api/marketplace/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel: 'amazon' }),
      });
      const data = await res.json();
      setAmazonProgress(100);
      if (data.success) {
        setAmazonLastSync(new Date().toLocaleString('en-IN', { hour12: false }));
        setAmazonSyncedCount(data.syncedCount || 0);
      }
    } catch {
      setAmazonProgress(0);
    } finally {
      setAmazonSyncing(false);
    }
  };

  const triggerFlipkartSync = async () => {
    if (!flipkartActive) return;
    setFlipkartSyncing(true);
    setFlipkartProgress(0);
    try {
      const res = await fetch('/api/marketplace/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel: 'flipkart' }),
      });
      const data = await res.json();
      setFlipkartProgress(100);
      if (data.success) {
        setFlipkartLastSync(new Date().toLocaleString('en-IN', { hour12: false }));
        setFlipkartSyncedCount(data.syncedCount || 0);
      }
    } catch {
      setFlipkartProgress(0);
    } finally {
      setFlipkartSyncing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-headline-lg text-on-surface">Marketplace Integration Manager</h1>
        <p className="text-body-sm text-warm-gray mt-1">Synchronise product inventories and order lists across major channels.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Amazon India Widget */}
        <Card elevation={1} className={`space-y-4 border-2 ${amazonActive ? 'border-primary' : 'border-border-subtle'}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-on-surface">amazon.in</span>
              <Badge variant={amazonActive ? 'secondary' : 'gray'}>
                {amazonActive ? 'Active Syncing' : 'Paused'}
              </Badge>
            </div>
            
            {/* Toggle switch */}
            <button
              onClick={() => setAmazonActive(!amazonActive)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                amazonActive ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                  amazonActive ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <div className="text-xs text-on-surface-variant space-y-1 bg-gray-50 p-3 rounded-lg">
            <div>Last catalog sync: <strong>{amazonLastSync}</strong></div>
            <div>Synced Items: <strong>{amazonSyncedCount || '14/14'} Products matches</strong></div>
          </div>

          {/* Sync Progress Bar */}
          {amazonSyncing && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-primary">
                <span>Syncing catalog data...</span>
                <span>{amazonProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full transition-all duration-300" style={{ width: `${amazonProgress}%` }} />
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-warm-gray flex items-center gap-1">
              <CheckCircle2 size={14} className="text-secondary" /> Connected credentials
            </span>
            <Button
              variant="primary"
              size="sm"
              disabled={!amazonActive || amazonSyncing}
              onClick={triggerAmazonSync}
              className="flex items-center gap-1.5"
            >
              <RefreshCw size={14} className={amazonSyncing ? 'animate-spin' : ''} />
              Sync Catalogue
            </Button>
          </div>
        </Card>

        {/* Flipkart India Widget */}
        <Card elevation={1} className={`space-y-4 border-2 ${flipkartActive ? 'border-primary' : 'border-border-subtle'}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-[#2874f0]">Flipkart</span>
              <Badge variant={flipkartActive ? 'secondary' : 'gray'}>
                {flipkartActive ? 'Active Syncing' : 'Paused'}
              </Badge>
            </div>
            
            {/* Toggle switch */}
            <button
              onClick={() => setFlipkartActive(!flipkartActive)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                flipkartActive ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                  flipkartActive ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <div className="text-xs text-on-surface-variant space-y-1 bg-gray-50 p-3 rounded-lg">
            <div>Last catalog sync: <strong>{flipkartLastSync}</strong></div>
            <div>Synced Items: <strong>{flipkartSyncedCount || '12/14'} Products matches</strong></div>
          </div>

          {/* Sync Progress Bar */}
          {flipkartSyncing && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-primary">
                <span>Syncing catalog data...</span>
                <span>{flipkartProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full transition-all duration-300" style={{ width: `${flipkartProgress}%` }} />
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-warm-gray flex items-center gap-1">
              <AlertTriangle size={14} className="text-yellow-600" /> 2 updates waiting
            </span>
            <Button
              variant="primary"
              size="sm"
              disabled={!flipkartActive || flipkartSyncing}
              onClick={triggerFlipkartSync}
              className="flex items-center gap-1.5"
            >
              <RefreshCw size={14} className={flipkartSyncing ? 'animate-spin' : ''} />
              Sync Catalogue
            </Button>
          </div>
        </Card>

        {/* Meesho - Coming Soon */}
        <Card elevation={0} className="opacity-70 relative border border-dashed border-border-subtle bg-gray-50/50 space-y-4 group">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-pink-600">Meesho</span>
              <Badge variant="coming-soon">Coming Soon</Badge>
            </div>
            
            {/* Disabled toggle switch */}
            <button
              disabled
              className="w-12 h-6 rounded-full bg-gray-200 cursor-not-allowed relative"
            >
              <div className="w-5 h-5 bg-gray-400 rounded-full absolute top-0.5 left-0.5" />
            </button>
          </div>

          <p className="text-xs text-warm-gray leading-relaxed">
            Integration for inventory synchronization and billing automation with Meesho seller platform is currently in production.
          </p>

          <div className="text-[10px] text-warm-gray border-t border-border-subtle pt-2 flex items-center gap-1 cursor-help relative">
            <span className="underline decoration-dotted">No self-serve API available</span>
            {/* Tooltip */}
            <div className="absolute bottom-full mb-1 left-0 hidden group-hover:block bg-[#1a1c1e] text-white text-[10px] p-2 rounded shadow-lg max-w-[200px] z-20">
              Meesho does not support self-serve APIs. Direct platform partner credentials/approval required.
            </div>
          </div>
        </Card>

        {/* Blinkit - Coming Soon */}
        <Card elevation={0} className="opacity-70 relative border border-dashed border-border-subtle bg-gray-50/50 space-y-4 group">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-yellow-500">Blinkit</span>
              <Badge variant="coming-soon">Coming Soon</Badge>
            </div>
            
            {/* Disabled toggle switch */}
            <button
              disabled
              className="w-12 h-6 rounded-full bg-gray-200 cursor-not-allowed relative"
            >
              <div className="w-5 h-5 bg-gray-400 rounded-full absolute top-0.5 left-0.5" />
            </button>
          </div>

          <p className="text-xs text-warm-gray leading-relaxed">
            Quick commerce catalog integration for instant order synchronization with local darkstores. Scheduled for Q4 release.
          </p>

          <div className="text-[10px] text-warm-gray border-t border-border-subtle pt-2 flex items-center gap-1 cursor-help relative">
            <span className="underline decoration-dotted">No self-serve API available</span>
            {/* Tooltip */}
            <div className="absolute bottom-full mb-1 left-0 hidden group-hover:block bg-[#1a1c1e] text-white text-[10px] p-2 rounded shadow-lg max-w-[200px] z-20">
              Blinkit does not support self-serve APIs. Direct platform partner credentials/approval required.
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
