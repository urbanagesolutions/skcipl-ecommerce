'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader2, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Carrier {
  id: string;
  name: string;
  slug: string;
  tracking_url_template: string;
  is_enabled: boolean;
  is_custom: boolean;
}

interface TrackingSettings {
  primary_color: string;
  accent_color: string;
  show_carrier_logo: boolean;
  notify_in_transit: boolean;
  notify_out_for_delivery: boolean;
  notify_delivered: boolean;
}

export default function CarrierSettingsPage() {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [settings, setSettings] = useState<TrackingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newCarrier, setNewCarrier] = useState({ name: '', tracking_url_template: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const [carriersRes, settingsRes] = await Promise.all([
        fetch('/api/admin/carriers'),
        supabase.from('tracking_settings').select('*').limit(1).maybeSingle(),
      ]);
      const carriersData = await carriersRes.json();
      setCarriers(carriersData.carriers || []);
      setSettings(settingsRes.data as TrackingSettings | null);
      setLoading(false);
    }
    load();
  }, []);

  const toggleCarrier = async (id: string, is_enabled: boolean) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await fetch('/api/admin/carriers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ action: 'toggle', id, is_enabled }),
    });
    setCarriers((prev) => prev.map((c) => (c.id === id ? { ...c, is_enabled } : c)));
  };

  const addCarrier = async () => {
    if (!newCarrier.name.trim()) return;
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const res = await fetch('/api/admin/carriers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ action: 'create', ...newCarrier }),
    });
    const data = await res.json();
    if (data.carrier) setCarriers((prev) => [...prev, data.carrier]);
    setNewCarrier({ name: '', tracking_url_template: '' });
    setShowAdd(false);
    setSaving(false);
  };

  const saveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await fetch('/api/admin/carriers', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(settings),
    });
    setSaving(false);
  };

  if (loading) return <Loader2 className="animate-spin mx-auto mt-20 text-primary" size={32} />;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Link href="/admin/shipments" className="text-xs text-primary font-bold hover:underline">← Fulfillment</Link>
        <h1 className="text-headline-lg text-on-surface mt-2">Shipping Carriers & Widget</h1>
      </div>

      <Card elevation={1} className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Enabled Carriers</h2>
          <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1 text-sm text-primary font-bold">
            <Plus size={16} /> Add Custom
          </button>
        </div>

        {showAdd && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <input
              placeholder="Carrier name"
              value={newCarrier.name}
              onChange={(e) => setNewCarrier((p) => ({ ...p, name: e.target.value }))}
              className="w-full border rounded px-3 py-2 text-sm"
            />
            <input
              placeholder="Tracking URL template (use {tracking_number})"
              value={newCarrier.tracking_url_template}
              onChange={(e) => setNewCarrier((p) => ({ ...p, tracking_url_template: e.target.value }))}
              className="w-full border rounded px-3 py-2 text-sm"
            />
            <Button variant="primary" size="sm" onClick={addCarrier} disabled={saving}>Save Carrier</Button>
          </div>
        )}

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {carriers.map((c) => (
            <label key={c.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={c.is_enabled}
                onChange={(e) => toggleCarrier(c.id, e.target.checked)}
              />
              <span className="text-sm font-semibold flex-1">{c.name}</span>
              {c.is_custom && <span className="text-[10px] bg-gray-200 px-2 py-0.5 rounded">Custom</span>}
            </label>
          ))}
        </div>
      </Card>

      {settings && (
        <Card elevation={1} className="p-6 space-y-4">
          <h2 className="font-bold">Tracking Widget & Notifications</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-warm-gray">Primary Color</label>
              <input
                type="color"
                value={settings.primary_color}
                onChange={(e) => setSettings((p) => p ? { ...p, primary_color: e.target.value } : p)}
                className="w-full h-10 rounded border"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-warm-gray">Accent Color</label>
              <input
                type="color"
                value={settings.accent_color}
                onChange={(e) => setSettings((p) => p ? { ...p, accent_color: e.target.value } : p)}
                className="w-full h-10 rounded border"
              />
            </div>
          </div>
          {(['notify_in_transit', 'notify_out_for_delivery', 'notify_delivered'] as const).map((key) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings[key]}
                onChange={(e) => setSettings((p) => p ? { ...p, [key]: e.target.checked } : p)}
              />
              Notify on {key.replace('notify_', '').replace(/_/g, ' ')}
            </label>
          ))}
          <Button variant="primary" onClick={saveSettings} disabled={saving}>Save Settings</Button>
        </Card>
      )}
    </div>
  );
}
