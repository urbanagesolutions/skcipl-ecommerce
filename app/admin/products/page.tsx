'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Plus, Edit2, Trash2, ShieldAlert } from 'lucide-react';

export default function AdminProducts() {
  const [activeSubTab, setActiveSubTab] = useState<'Catalog' | 'CategoryManager'>('Catalog');

  // Local state categories
  const [categories, setCategories] = useState([
    { id: '1', name: 'Ghee', slug: 'ghee', is_active: true, display_order: 1, requires_fssai_display: true },
    { id: '2', name: 'Oils', slug: 'oils', is_active: true, display_order: 2, requires_fssai_display: true },
    { id: '3', name: 'Groceries', slug: 'groceries', is_active: true, display_order: 3, requires_fssai_display: true },
    { id: '4', name: 'Fashion', slug: 'fashion', is_active: true, display_order: 4, requires_fssai_display: false }
  ]);

  // Add Category form state
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatOrder, setNewCatOrder] = useState('5');
  const [newCatFssai, setNewCatFssai] = useState(false);

  // Local state products
  const [products] = useState([
    { id: 'p1', name: 'Pure Desi Cow Ghee (Bilona Method)', price: 599, stock: 45, category: 'Ghee' },
    { id: 'p2', name: 'Cold Pressed Virgin Coconut Oil', price: 299, stock: 12, category: 'Oils' },
    { id: 'p3', name: 'Organic Turmeric Powder (250g)', price: 149, stock: 120, category: 'Groceries' }
  ]);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !newCatSlug) return;
    const newCat = {
      id: Date.now().toString(),
      name: newCatName,
      slug: newCatSlug.toLowerCase(),
      is_active: true,
      display_order: parseInt(newCatOrder) || 1,
      requires_fssai_display: newCatFssai
    };
    setCategories([...categories, newCat]);
    setNewCatName('');
    setNewCatSlug('');
    setNewCatOrder('5');
    setNewCatFssai(false);
  };

  const toggleCategoryActive = (id: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, is_active: !c.is_active } : c));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-headline-lg text-on-surface">Inventory Management Suite</h1>
          <p className="text-body-sm text-warm-gray mt-1">Configure products catalog or customize categories database table.</p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-[#eeeef0] p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveSubTab('Catalog')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === 'Catalog' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Product Catalog
          </button>
          <button
            onClick={() => setActiveSubTab('CategoryManager')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === 'CategoryManager' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Category Manager
          </button>
        </div>
      </div>

      {activeSubTab === 'Catalog' ? (
        // Catalog layout
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-title-md font-bold text-on-surface">Listed Products ({products.length})</h3>
            <Button variant="primary" className="flex items-center gap-1.5 py-2">
              <Plus size={16} /> Add Product
            </Button>
          </div>

          <Card elevation={1} className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse text-body-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-border-subtle text-xs uppercase tracking-wider text-warm-gray font-bold">
                  <th className="p-4">Product ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock Level</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-border-subtle hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-bold text-primary">{p.id}</td>
                    <td className="p-4 font-semibold text-on-surface">{p.name}</td>
                    <td className="p-4">
                      <Badge variant="primary">{p.category}</Badge>
                    </td>
                    <td className="p-4 font-semibold">₹{p.price}</td>
                    <td className="p-4">
                      <span className={`font-semibold ${p.stock < 15 ? 'text-sale-red' : 'text-on-surface'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button variant="outline" size="sm" className="p-2"><Edit2 size={12} /></Button>
                      <Button variant="danger" size="sm" className="p-2"><Trash2 size={12} /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      ) : (
        // Category Manager screen
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add category form */}
          <Card elevation={1} className="lg:col-span-1 space-y-4">
            <h3 className="text-title-md font-bold text-on-surface flex items-center gap-2 border-b border-border-subtle pb-3">
              Create New Category
            </h3>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Name</label>
                <Input
                  required
                  placeholder="e.g. Ghee, Oils"
                  value={newCatName}
                  onChange={(e) => {
                    setNewCatName(e.target.value);
                    setNewCatSlug(e.target.value.toLowerCase().replace(/ /g, '-'));
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">URL Slug (Auto)</label>
                <Input
                  required
                  placeholder="e.g. ghee"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Display Order</label>
                <Input
                  type="number"
                  placeholder="e.g. 1, 2"
                  value={newCatOrder}
                  onChange={(e) => setNewCatOrder(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-gray-50 border border-border-subtle rounded-lg">
                <input
                  type="checkbox"
                  id="fssai_check"
                  checked={newCatFssai}
                  onChange={(e) => setNewCatFssai(e.target.checked)}
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                />
                <label htmlFor="fssai_check" className="text-xs font-semibold text-on-surface-variant cursor-pointer flex items-center gap-1.5">
                  <ShieldAlert size={14} className="text-yellow-600" /> Requires FSSAI Disclaimer
                </label>
              </div>

              <Button type="submit" variant="primary" fullWidth className="flex items-center gap-1">
                <Plus size={16} /> Add to Database
              </Button>
            </form>
          </Card>

          {/* List and manage categories */}
          <Card elevation={1} className="lg:col-span-2 space-y-4">
            <h3 className="text-title-md font-bold text-on-surface flex items-center gap-2 border-b border-border-subtle pb-3">
              Database Table: categories
            </h3>
            
            <table className="w-full text-left border-collapse text-body-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-border-subtle text-xs uppercase tracking-wider text-warm-gray font-bold">
                  <th className="p-3">Name</th>
                  <th className="p-3">Slug</th>
                  <th className="p-3">Order</th>
                  <th className="p-3">FSSAI Required</th>
                  <th className="p-3">Active</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id} className="border-b border-border-subtle hover:bg-gray-50/50 transition-colors">
                    <td className="p-3 font-semibold text-on-surface">{c.name}</td>
                    <td className="p-3 text-warm-gray font-mono">{c.slug}</td>
                    <td className="p-3 font-bold text-primary">{c.display_order}</td>
                    <td className="p-3">
                      {c.requires_fssai_display ? (
                        <span className="text-xs text-yellow-600 font-bold bg-yellow-100 px-2 py-0.5 rounded">Yes</span>
                      ) : (
                        <span className="text-xs text-warm-gray px-2 py-0.5">No</span>
                      )}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleCategoryActive(c.id)}
                        className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                          c.is_active 
                            ? 'bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-30'
                            : 'bg-red-50 text-red-600 border border-red-200'
                        }`}
                      >
                        {c.is_active ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </div>
  );
}
