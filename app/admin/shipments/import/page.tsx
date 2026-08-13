'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader2, Upload, Download, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ImportResult {
  row: number;
  success: boolean;
  error?: string;
  orderId?: string;
}

export default function ShipmentImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ImportResult[] | null>(null);

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    setResults(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/shipments/import', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: formData,
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setResults(data.results);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setLoading(false);
    }
  };

  const downloadSample = () => {
    const csv = `order_id,tracking_provider,tracking_number,date_shipped,status_shipped
00000000-0000-0000-0000-000000000001,Delhivery,1234567890123456,13-08-2026,1
00000000-0000-0000-0000-000000000002,BlueDart,987654321098,13-08-2026,2`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shipment-import-sample.csv';
    a.click();
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/admin/shipments" className="text-xs text-primary font-bold hover:underline">← Back to Fulfillment</Link>
        <h1 className="text-headline-lg text-on-surface mt-2">Bulk CSV Import</h1>
        <p className="text-body-sm text-warm-gray mt-1">
          Upload tracking numbers in bulk. Compatible with AST CSV format.
        </p>
      </div>

      <Card elevation={1} className="p-6 space-y-4">
        <div className="bg-gray-50 rounded-lg p-4 text-xs space-y-2">
          <p className="font-bold">Required columns:</p>
          <code className="block">order_id, tracking_provider, tracking_number, date_shipped, status_shipped</code>
          <p className="text-warm-gray">status_shipped: 0 = no change, 1 = Shipped, 2 = Partially Shipped</p>
        </div>

        <button onClick={downloadSample} className="flex items-center gap-2 text-sm text-primary font-bold">
          <Download size={16} /> Download sample CSV
        </button>

        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm"
        />

        <Button variant="primary" onClick={handleImport} disabled={!file || loading} fullWidth className="flex items-center gap-2 justify-center">
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
          Import Shipments
        </Button>
      </Card>

      {results && (
        <Card elevation={1} className="p-4 space-y-2 max-h-96 overflow-y-auto">
          <h3 className="font-bold text-sm">
            Results: {results.filter((r) => r.success).length} succeeded, {results.filter((r) => !r.success).length} failed
          </h3>
          {results.map((r) => (
            <div key={r.row} className="flex items-start gap-2 text-xs py-1 border-b border-gray-100">
              {r.success ? <CheckCircle size={14} className="text-secondary flex-shrink-0 mt-0.5" /> : <XCircle size={14} className="text-sale-red flex-shrink-0 mt-0.5" />}
              <span>Row {r.row}: {r.success ? `Order ${r.orderId?.substring(0, 8)} imported` : r.error}</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
