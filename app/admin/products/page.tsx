'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Plus, Edit2, Trash2, ShieldAlert, ChevronUp, ChevronDown } from 'lucide-react';
import { 
  fetchCategories, 
  addCategory, 
  updateCategory, 
  deleteCategory, 
  reorderCategories,
  fetchAdminProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  bulkUpdateProductStatus,
  AdminProduct
} from '@/lib/data';
import { Category } from '@/types';

export default function AdminProducts() {
  const [activeSubTab, setActiveSubTab] = useState<'Catalog' | 'CategoryManager'>('Catalog');

  // Data States
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected Products for Bulk Actions
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Category Form State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatOrder, setNewCatOrder] = useState('1');
  const [newCatFssai, setNewCatFssai] = useState(false);

  // Product Form State (Modal)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodSlug, setProdSlug] = useState('');
  const [prodCatId, setProdCatId] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState(0);
  const [prodMrp, setProdMrp] = useState(0);
  const [prodStock, setProdStock] = useState(0);
  const [prodBatch, setProdBatch] = useState('');
  const [prodExpiry, setProdExpiry] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodIsActive, setProdIsActive] = useState(true);

  // Load Categories and Products
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [cats, prods] = await Promise.all([
        fetchCategories(),
        fetchAdminProducts()
      ]);
      setCategories(cats);
      setProducts(prods);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to retrieve inventory data from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Category Actions
  const handleAddOrEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !newCatSlug) return;
    setError(null);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: newCatName,
          slug: newCatSlug.toLowerCase(),
          display_order: parseInt(newCatOrder) || 1,
          requires_fssai_display: newCatFssai
        });
      } else {
        await addCategory({
          name: newCatName,
          slug: newCatSlug.toLowerCase(),
          display_order: parseInt(newCatOrder) || 1,
          requires_fssai_display: newCatFssai,
          parent_category_id: null,
          icon_or_image_url: null,
          is_active: true
        });
      }
      setNewCatName('');
      setNewCatSlug('');
      setNewCatOrder('1');
      setNewCatFssai(false);
      setEditingCategory(null);
      await loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save category.');
    }
  };

  const handleEditCategoryClick = (cat: Category) => {
    setEditingCategory(cat);
    setNewCatName(cat.name);
    setNewCatSlug(cat.slug);
    setNewCatOrder(cat.display_order.toString());
    setNewCatFssai(cat.requires_fssai_display);
  };

  const handleCancelEditCategory = () => {
    setEditingCategory(null);
    setNewCatName('');
    setNewCatSlug('');
    setNewCatOrder('1');
    setNewCatFssai(false);
  };

  const handleDeleteCategoryClick = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    setError(null);
    try {
      await deleteCategory(id);
      await loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete category.');
    }
  };

  const toggleCategoryActive = async (cat: Category) => {
    setError(null);
    try {
      await updateCategory(cat.id, { is_active: !cat.is_active });
      await loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update category active status.');
    }
  };

  const handleReorderCategory = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= categories.length) return;

    setError(null);
    try {
      const list = [...categories];
      const temp = list[index];
      list[index] = list[newIndex];
      list[newIndex] = temp;

      const updates = list.map((cat, idx) => ({
        id: cat.id,
        display_order: idx + 1
      }));

      await reorderCategories(updates);
      await loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to reorder categories.');
    }
  };

  // Product Actions
  const openAddProductModal = () => {
    setEditingProduct(null);
    setProdName('');
    setProdSlug('');
    setProdCatId(categories[0]?.id || '');
    setProdDesc('');
    setProdPrice(0);
    setProdMrp(0);
    setProdStock(0);
    setProdBatch('');
    setProdExpiry('');
    setProdSku('');
    setProdImageUrl('');
    setProdIsActive(true);
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod: AdminProduct) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdSlug(prod.slug);
    setProdCatId(prod.category_id || '');
    setProdDesc(prod.description);
    setProdPrice(prod.price);
    setProdMrp(prod.mrp);
    setProdStock(prod.stock_quantity);
    setProdBatch(prod.batch_number);
    setProdExpiry(prod.expiry_date);
    setProdSku(prod.sku);
    setProdImageUrl(prod.images[0] || '');
    setProdIsActive(prod.is_active);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodSlug) return;
    setError(null);
    try {
      const payload = {
        name: prodName,
        slug: prodSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        category_id: prodCatId || null,
        description: prodDesc,
        price: Number(prodPrice),
        mrp: Number(prodMrp),
        stock_quantity: Number(prodStock),
        batch_number: prodBatch,
        expiry_date: prodExpiry,
        sku: prodSku,
        images: prodImageUrl ? [prodImageUrl] : [],
        is_active: prodIsActive
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await addProduct(payload);
      }
      setIsProductModalOpen(false);
      await loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save product.');
    }
  };

  const handleDeleteProductClick = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setError(null);
    try {
      await deleteProduct(id);
      await loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete product.');
    }
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllProducts = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProductIds(products.map(p => p.id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleBulkStatusChange = async (is_active: boolean) => {
    if (selectedProductIds.length === 0) return;
    setError(null);
    try {
      await bulkUpdateProductStatus(selectedProductIds, is_active);
      setSelectedProductIds([]);
      await loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to bulk update product status.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-body-sm text-warm-gray animate-pulse">Loading database contents...</p>
      </div>
    );
  }

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

      {error && (
        <div className="bg-red-50 text-sale-red text-sm p-4 rounded-xl border border-red-200 flex items-center gap-2 font-semibold animate-shake">
          <ShieldAlert size={18} /> {error}
        </div>
      )}

      {activeSubTab === 'Catalog' ? (
        // Catalog layout
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-title-md font-bold text-on-surface">Listed Products ({products.length})</h3>
              {selectedProductIds.length > 0 && (
                <div className="flex items-center gap-2 bg-[#eeeef0] px-3 py-1.5 rounded-lg text-xs font-semibold">
                  <span>{selectedProductIds.length} Selected</span>
                  <button 
                    onClick={() => handleBulkStatusChange(true)}
                    className="text-primary hover:underline ml-2"
                  >
                    Activate
                  </button>
                  <span className="text-warm-gray">|</span>
                  <button 
                    onClick={() => handleBulkStatusChange(false)}
                    className="text-sale-red hover:underline"
                  >
                    Deactivate
                  </button>
                </div>
              )}
            </div>
            <Button variant="primary" className="flex items-center gap-1.5 py-2" onClick={openAddProductModal}>
              <Plus size={16} /> Add Product
            </Button>
          </div>

          <Card elevation={1} className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse text-body-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-border-subtle text-xs uppercase tracking-wider text-warm-gray font-bold">
                  <th className="p-4 w-10">
                    <input 
                      type="checkbox" 
                      checked={products.length > 0 && selectedProductIds.length === products.length} 
                      onChange={handleSelectAllProducts}
                      className="rounded text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                    />
                  </th>
                  <th className="p-4">SKU / ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price / MRP</th>
                  <th className="p-4">Stock Level</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-warm-gray">
                      No products found in the database. Click &quot;Add Product&quot; to create one.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="border-b border-border-subtle hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <input 
                          type="checkbox" 
                          checked={selectedProductIds.includes(p.id)} 
                          onChange={() => handleSelectProduct(p.id)}
                          className="rounded text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                        />
                      </td>
                      <td className="p-4 font-mono text-xs text-warm-gray">
                        {p.sku || p.id.substring(0, 8)}
                      </td>
                      <td className="p-4 font-semibold text-on-surface">{p.name}</td>
                      <td className="p-4">
                        <Badge variant="primary">{p.category_name}</Badge>
                      </td>
                      <td className="p-4 font-semibold">
                        ₹{p.price} <span className="text-xs text-warm-gray line-through ml-1.5">₹{p.mrp}</span>
                      </td>
                      <td className="p-4">
                        <span className={`font-semibold ${p.stock_quantity < 15 ? 'text-sale-red' : 'text-on-surface'}`}>
                          {p.stock_quantity} units
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge variant={p.is_active ? 'secondary' : 'pending'}>
                          {p.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Button variant="outline" size="sm" className="p-2 inline-flex" onClick={() => openEditProductModal(p)}><Edit2 size={12} /></Button>
                        <Button variant="danger" size="sm" className="p-2 inline-flex" onClick={() => handleDeleteProductClick(p.id)}><Trash2 size={12} /></Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Card>
        </div>
      ) : (
        // Category Manager screen
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add/Edit category form */}
          <Card elevation={1} className="lg:col-span-1 space-y-4">
            <h3 className="text-title-md font-bold text-on-surface flex items-center gap-2 border-b border-border-subtle pb-3">
              {editingCategory ? 'Update Category' : 'Create New Category'}
            </h3>
            <form onSubmit={handleAddOrEditCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Name</label>
                <Input
                  required
                  placeholder="e.g. Ghee, Oils"
                  value={newCatName}
                  onChange={(e) => {
                    setNewCatName(e.target.value);
                    if (!editingCategory) {
                      setNewCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                    }
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">URL Slug</label>
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
                  className="rounded text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                />
                <label htmlFor="fssai_check" className="text-xs font-semibold text-on-surface-variant cursor-pointer flex items-center gap-1.5">
                  <ShieldAlert size={14} className="text-yellow-600" /> Requires FSSAI Disclaimer
                </label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" variant="primary" fullWidth className="flex items-center justify-center gap-1">
                  <Plus size={16} /> {editingCategory ? 'Save Updates' : 'Add to Database'}
                </Button>
                {editingCategory && (
                  <Button type="button" variant="outline" onClick={handleCancelEditCategory}>
                    Cancel
                  </Button>
                )}
              </div>
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
                  <th className="p-3">FSSAI Required</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Order Reorder</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-warm-gray">
                      No categories found in the database.
                    </td>
                  </tr>
                ) : (
                  categories.map((c, idx) => (
                    <tr key={c.id} className="border-b border-border-subtle hover:bg-gray-50/50 transition-colors">
                      <td className="p-3 font-semibold text-on-surface">{c.name}</td>
                      <td className="p-3 text-warm-gray font-mono">{c.slug}</td>
                      <td className="p-3">
                        {c.requires_fssai_display ? (
                          <span className="text-xs text-yellow-600 font-bold bg-yellow-100 px-2 py-0.5 rounded">Yes</span>
                        ) : (
                          <span className="text-xs text-warm-gray px-2 py-0.5">No</span>
                        )}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => toggleCategoryActive(c)}
                          className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                            c.is_active 
                              ? 'bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-30'
                              : 'bg-red-50 text-red-600 border border-red-200'
                          }`}
                        >
                          {c.is_active ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-primary min-w-[20px] text-center">{c.display_order}</span>
                          <button
                            type="button"
                            onClick={() => handleReorderCategory(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 inline-flex text-primary font-bold text-xs"
                            title="Move Up"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReorderCategory(idx, 'down')}
                            disabled={idx === categories.length - 1}
                            className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 inline-flex text-primary font-bold text-xs"
                            title="Move Down"
                          >
                            <ChevronDown size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="p-3 text-right space-x-1">
                        <Button variant="outline" size="sm" className="p-1.5 inline-flex" onClick={() => handleEditCategoryClick(c)}>
                          <Edit2 size={12} />
                        </Button>
                        <Button variant="danger" size="sm" className="p-1.5 inline-flex" onClick={() => handleDeleteCategoryClick(c.id)}>
                          <Trash2 size={12} />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card elevation={2} className="w-full max-w-[640px] max-h-[90vh] overflow-y-auto space-y-6 bg-white p-6 relative">
            <h3 className="text-title-lg font-bold text-on-surface border-b border-border-subtle pb-3">
              {editingProduct ? 'Edit Product Details' : 'Add New Product'}
            </h3>
            
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Name</label>
                  <Input
                    required
                    placeholder="e.g. Pure Desi Cow Ghee"
                    value={prodName}
                    onChange={(e) => {
                      setProdName(e.target.value);
                      if (!editingProduct) {
                        setProdSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                      }
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Slug</label>
                  <Input
                    required
                    placeholder="e.g. pure-desi-cow-ghee"
                    value={prodSlug}
                    onChange={(e) => setProdSlug(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Category</label>
                  <select
                    required
                    className="w-full bg-white border border-border-subtle text-on-surface py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-body-sm shadow-sm transition-all duration-200"
                    value={prodCatId}
                    onChange={(e) => setProdCatId(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">SKU</label>
                  <Input
                    placeholder="e.g. GHEE-COW-01"
                    value={prodSku}
                    onChange={(e) => setProdSku(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Description</label>
                <textarea
                  className="w-full bg-white border border-border-subtle text-on-surface py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-body-sm shadow-sm transition-all duration-200"
                  rows={3}
                  placeholder="Describe the product..."
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Price (INR)</label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={prodPrice || ''}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">MRP (INR)</label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={prodMrp || ''}
                    onChange={(e) => setProdMrp(Number(e.target.value))}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Stock Level</label>
                  <Input
                    required
                    type="number"
                    placeholder="0"
                    value={prodStock || ''}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Batch Number</label>
                  <Input
                    placeholder="e.g. BATCH-123"
                    value={prodBatch}
                    onChange={(e) => setProdBatch(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Expiry Date</label>
                  <Input
                    type="date"
                    value={prodExpiry}
                    onChange={(e) => setProdExpiry(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Image URL</label>
                <Input
                  placeholder="e.g. /assets/images/ghee.png"
                  value={prodImageUrl}
                  onChange={(e) => setProdImageUrl(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="prod_active"
                  checked={prodIsActive}
                  onChange={(e) => setProdIsActive(e.target.checked)}
                  className="rounded text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                />
                <label htmlFor="prod_active" className="text-xs font-semibold text-on-surface-variant cursor-pointer">
                  Product is active and listed for buyers
                </label>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-border-subtle">
                <Button type="button" variant="outline" onClick={() => setIsProductModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
