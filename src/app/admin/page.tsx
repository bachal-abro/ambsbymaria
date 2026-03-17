'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Lock, ShoppingBag, MessageSquare, RefreshCw, Eye, Loader2,
    CheckCircle, Package, Plus, Pencil, Trash2, X, Save, Upload, Link,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Order {
    id: string
    customerName: string
    email: string
    total: number
    status: string
    city: string
    country: string
    createdAt: string
    items: Array<{
        id: string; quantity: number; unitPrice: number
        product: { name: string }; material: { name: string }
    }>
}

interface Message {
    id: string; name: string; email: string; subject: string
    message: string; phone: string; read: boolean; createdAt: string
}

interface Product {
    id: string; name: string; slug: string; sku: string
    description: string; price: number; category: string
    inStock: boolean; featured: boolean
    images: string[]; specifications: Record<string, string>
    createdAt: string
}

interface PromoCode {
    id: string
    code: string
    discount: number
    discountType: string
    active: boolean
    expiresAt: string | null
    createdAt: string
}

type Tab = 'orders' | 'messages' | 'products' | 'promos'

const STATUS_COLORS: Record<string, string> = {
    pending: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
    processing: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
    shipped: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
    delivered: 'text-green-400 border-green-400/30 bg-green-400/10',
}

const DEFAULT_CATEGORIES = ['rings', 'necklaces', 'bracelets', 'earrings']
const MATERIAL_SLUGS = ['rose-gold', 'yellow-gold', 'white-gold', 'platinum']
const CATEGORIES_KEY = 'admin_categories'

const EMPTY_PRODUCT = {
    name: '', slug: '', sku: '', description: '', price: 0,
    category: 'rings',
    inStock: true, featured: false,
    images: [''], specifications: {},
}

const EMPTY_PROMO = {
    code: '',
    discount: 0,
    discountType: 'flat',
    active: true,
    expiresAt: '',
}

// ─── Admin Page ───────────────────────────────────────────────────────────────

export default function AdminPage() {
    const [password, setPassword] = useState('')
    const [authed, setAuthed] = useState(false)
    const [authError, setAuthError] = useState('')
    const [adminPwd, setAdminPwd] = useState('')
    const [tab, setTab] = useState<Tab>('orders')

    const [orders, setOrders] = useState<Order[]>([])
    const [messages, setMessages] = useState<Message[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(false)

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

    // Product editor state
    const [showProductForm, setShowProductForm] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [productForm, setProductForm] = useState<typeof EMPTY_PRODUCT>(EMPTY_PRODUCT)
    const [productLoading, setProductLoading] = useState(false)
    const [productError, setProductError] = useState<string | null>(null)
    const [uploadingIdx, setUploadingIdx] = useState<number | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

    // Promo code state
    const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
    const [showPromoForm, setShowPromoForm] = useState(false)
    const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null)
    const [promoForm, setPromoForm] = useState<typeof EMPTY_PROMO>(EMPTY_PROMO)
    const [promoLoading, setPromoLoading] = useState(false)
    const [promoError, setPromoError] = useState<string | null>(null)


    // Category management state
    const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES)
    const [newCategory, setNewCategory] = useState('')
    const [showCatManager, setShowCatManager] = useState(false)

    // Load persisted categories from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(CATEGORIES_KEY)
            if (stored) {
                const parsed = JSON.parse(stored) as string[]
                if (Array.isArray(parsed) && parsed.length > 0) setCategories(parsed)
            }
        } catch { /* ignore */ }
    }, [])

    // ── Auth ──────────────────────────────────────────────────────────────────
    const login = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await fetch('/api/admin/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        })
        if (res.ok) {
            setAuthed(true)
            setAdminPwd(password)
            loadAll(password)
        } else {
            setAuthError('Incorrect password')
        }
    }

    // ── Data loading ──────────────────────────────────────────────────────────
    const authHeader = (pwd: string) => ({ 'x-admin-password': pwd })

    const loadAll = async (pwd: string) => {
        setLoading(true)
        const [ordersRes, messagesRes, productsRes, promosRes] = await Promise.all([
            fetch('/api/admin/orders', { headers: authHeader(pwd) }),
            fetch('/api/admin/messages', { headers: authHeader(pwd) }),
            fetch('/api/admin/products', { headers: authHeader(pwd) }),
            fetch('/api/admin/promo-codes', { headers: authHeader(pwd) }),
        ])
        setOrders(await ordersRes.json())
        setMessages(await messagesRes.json())
        setProducts(await productsRes.json())
        setPromoCodes(await promosRes.json())
        setLoading(false)
    }

    // ── Orders ────────────────────────────────────────────────────────────────
    const updateOrderStatus = async (id: string, status: string) => {
        await fetch('/api/admin/orders', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', ...authHeader(adminPwd) },
            body: JSON.stringify({ id, status }),
        })
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
        if (selectedOrder?.id === id) setSelectedOrder((p) => p ? { ...p, status } : p)
    }

    // ── Messages ──────────────────────────────────────────────────────────────
    const markMessageRead = async (id: string) => {
        await fetch('/api/admin/messages', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', ...authHeader(adminPwd) },
            body: JSON.stringify({ id, read: true }),
        })
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)))
    }

    // ── Products CRUD ─────────────────────────────────────────────────────────
    // ── Category management ────────────────────────────────────────────────────
    const persistCategories = (cats: string[]) => {
        setCategories(cats)
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(cats))
    }

    const addCategory = () => {
        const trimmed = newCategory.trim().toLowerCase().replace(/\s+/g, '-')
        if (!trimmed || categories.includes(trimmed)) return
        persistCategories([...categories, trimmed])
        setNewCategory('')
    }

    const removeCategory = (cat: string) => {
        if (categories.length <= 1) return
        const updated = categories.filter((c) => c !== cat)
        persistCategories(updated)
        // If current form category was removed, reset to first available
        if (productForm.category === cat)
            setProductForm((p) => ({ ...p, category: updated[0] }))
    }

    const openNewProduct = () => {
        setEditingProduct(null)
        setProductForm({ ...EMPTY_PRODUCT, category: categories[0] ?? 'rings' })
        setProductError(null)
        setShowProductForm(true)
    }

    const openEditProduct = (p: Product) => {
        setEditingProduct(p)
        setProductError(null)
        setProductForm({
            name: p.name, slug: p.slug, sku: p.sku, description: p.description,
            price: p.price, category: p.category,
            inStock: p.inStock, featured: p.featured,
            images: p.images.length ? p.images : [''],
            specifications: p.specifications,
        })
        setShowProductForm(true)
    }

    const handleProductFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target
        setProductForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked
                : name === 'price' ? parseFloat(value) || 0 : value,
        }))
    }

    const handleImageChange = (idx: number, val: string) => {
        setProductForm((prev) => {
            const imgs = [...prev.images]
            imgs[idx] = val
            return { ...prev, images: imgs }
        })
    }

    const addImageField = () => setProductForm((p) => ({ ...p, images: [...p.images, ''] }))
    const removeImageField = (idx: number) => {
        setProductForm((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))
    }

    const uploadImage = async (idx: number, file: File) => {
        if (!file.type.startsWith('image/')) return
        setUploadingIdx(idx)
        try {
            const form = new FormData()
            form.append('file', file)
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                headers: { ...authHeader(adminPwd) },
                body: form,
            })
            if (res.ok) {
                const { url } = await res.json() as { url: string }
                handleImageChange(idx, url)
            } else {
                const { error } = await res.json().catch(() => ({ error: 'Upload failed' })) as { error: string }
                setProductError(error || 'Upload failed')
            }
        } catch {
            setProductError('Network error during upload')
        } finally {
            setUploadingIdx(null)
        }
    }

    const handleFileDrop = (idx: number, e: React.DragEvent) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (file) uploadImage(idx, file)
    }

    const autoSlug = () => {
        setProductForm((p) => ({
            ...p,
            slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        }))
    }

    const saveProduct = async (e: React.FormEvent) => {
        e.preventDefault()
        setProductLoading(true)
        setProductError(null)

        const payload = {
            ...productForm,
            price: Number(productForm.price),
            images: productForm.images.filter(Boolean),
            materialSlugs: MATERIAL_SLUGS,
            defaultMaterial: 'rose-gold', // Hardcoded default
            ...(editingProduct ? { id: editingProduct.id } : {}),
        }

        try {
            const res = await fetch('/api/admin/products', {
                method: editingProduct ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json', ...authHeader(adminPwd) },
                body: JSON.stringify(payload),
            })

            if (res.ok) {
                const saved: Product = await res.json()
                if (editingProduct) {
                    setProducts((prev) => prev.map((p) => (p.id === saved.id ? saved : p)))
                } else {
                    setProducts((prev) => [saved, ...prev])
                }
                setShowProductForm(false)
            } else {
                const errData = await res.json().catch(() => null)
                setProductError(
                    errData?.error ||
                    (res.status === 401 ? 'Unauthorized — check admin password.' : `Server error (${res.status}). Please try again.`)
                )
            }
        } catch (err) {
            setProductError('Network error — could not reach server.')
            console.error(err)
        } finally {
            setProductLoading(false)
        }
    }

    const deleteProduct = async (id: string) => {
        await fetch('/api/admin/products', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', ...authHeader(adminPwd) },
            body: JSON.stringify({ id }),
        })
        setProducts((prev) => prev.filter((p) => p.id !== id))
        setDeleteConfirm(null)
    }

    // ── Promo Codes CRUD ──────────────────────────────────────────────────────
    const openNewPromo = () => {
        setEditingPromo(null)
        setPromoForm(EMPTY_PROMO)
        setPromoError(null)
        setShowPromoForm(true)
    }

    const openEditPromo = (p: PromoCode) => {
        setEditingPromo(p)
        setPromoError(null)
        setPromoForm({
            code: p.code,
            discount: p.discount,
            discountType: p.discountType,
            active: p.active,
            expiresAt: p.expiresAt ? p.expiresAt.split('T')[0] : '',
        })
        setShowPromoForm(true)
    }

    const handlePromoFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        setPromoForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked
                : name === 'discount' ? parseFloat(value) || 0 : value,
        }))
    }

    const savePromoCode = async (e: React.FormEvent) => {
        e.preventDefault()
        setPromoLoading(true)
        setPromoError(null)

        const payload = {
            ...promoForm,
            ...(editingPromo ? { id: editingPromo.id } : {}),
        }

        try {
            const res = await fetch('/api/admin/promo-codes', {
                method: editingPromo ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json', ...authHeader(adminPwd) },
                body: JSON.stringify(payload),
            })

            if (res.ok) {
                const saved: PromoCode = await res.json()
                if (editingPromo) {
                    setPromoCodes((prev) => prev.map((p) => (p.id === saved.id ? saved : p)))
                } else {
                    setPromoCodes((prev) => [saved, ...prev])
                }
                setShowPromoForm(false)
            } else {
                const errData = await res.json().catch(() => null)
                setPromoError(errData?.error || 'Failed to save promo code')
            }
        } catch (err) {
            setPromoError('Network error')
        } finally {
            setPromoLoading(false)
        }
    }

    const togglePromoActive = async (id: string, active: boolean) => {
        await fetch('/api/admin/promo-codes', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', ...authHeader(adminPwd) },
            body: JSON.stringify({ id, active }),
        })
        setPromoCodes((prev) => prev.map((p) => (p.id === id ? { ...p, active } : p)))
    }

    const deletePromoCode = async (id: string) => {
        await fetch(`/api/admin/promo-codes?id=${id}`, {
            method: 'DELETE',
            headers: { ...authHeader(adminPwd) },
        })
        setPromoCodes((prev) => prev.filter((p) => p.id !== id))
        setDeleteConfirm(null)
    }

    // ── Login screen ──────────────────────────────────────────────────────────
    if (!authed) {
        return (
            <div className="min-h-screen bg-luxury-black flex items-center justify-center px-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="luxury-card p-10 max-w-sm w-full">
                    <div className="text-center mb-8">
                        <Lock className="text-luxury-gold mx-auto mb-4" size={40} />
                        <h1 className="font-display text-3xl text-luxury-white">Admin Panel</h1>
                        <p className="text-luxury-white/50 text-sm mt-2">Enter admin password to continue</p>
                    </div>
                    <form onSubmit={login} className="space-y-4">
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="luxury-input" placeholder="Admin password" autoFocus />
                        {authError && <p className="text-red-400 text-sm">{authError}</p>}
                        <button type="submit" className="luxury-btn-primary w-full"><span>Login</span></button>
                    </form>
                </motion.div>
            </div>
        )
    }

    const unread = messages.filter((m) => !m.read).length

    return (
        <div className="min-h-screen bg-luxury-black pt-24 pb-20">
            <div className="luxury-container">

                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <h1 className="font-display text-3xl text-gradient">Admin Panel</h1>
                    <button onClick={() => loadAll(adminPwd)} className="luxury-btn text-sm flex items-center gap-2" disabled={loading}>
                        <span className="flex items-center gap-2">
                            {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                            Refresh
                        </span>
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: 'Products', value: products.length, icon: Package },
                        { label: 'Orders', value: orders.length, icon: ShoppingBag },
                        { label: 'Promo Codes', value: promoCodes.length, icon: Link },
                        { label: 'Unread', value: unread, icon: Eye },
                    ].map(({ label, value, icon: Icon }) => (
                        <div key={label} className="luxury-card p-5">
                            <Icon className="text-luxury-gold mb-2" size={20} />
                            <p className="text-luxury-white/50 text-xs uppercase tracking-wider mb-1">{label}</p>
                            <p className="text-luxury-white font-display text-2xl">{value}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-luxury-charcoal-light overflow-x-auto whitespace-nowrap scrollbar-hide">
                    {([
                        { key: 'products' as Tab, label: `Products (${products.length})`, badge: 0 },
                        { key: 'promos' as Tab, label: `Promo Codes (${promoCodes.length})`, badge: 0 },
                        { key: 'orders' as Tab, label: `Orders (${orders.length})`, badge: 0 },
                        { key: 'messages' as Tab, label: `Messages (${messages.length})`, badge: unread },
                    ]).map(({ key, label, badge }) => (
                        <button
                            key={key}
                            onClick={() => setTab(key)}
                            className={`pb-3 px-1 text-sm uppercase tracking-wider transition-colors flex items-center gap-2 ${tab === key ? 'text-luxury-gold border-b-2 border-luxury-gold' : 'text-luxury-white/50 hover:text-luxury-white'}`}
                        >
                            {label}
                            {badge > 0 ? <span className="w-5 h-5 bg-luxury-gold text-white text-xs rounded-full flex items-center justify-center">{badge}</span> : null}
                        </button>
                    ))}
                </div>

                {/* ── PRODUCTS TAB ── */}
                <AnimatePresence mode="wait">
                    {tab === 'products' && (
                        <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-luxury-white/50 text-sm">{products.length} products in catalogue</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowCatManager((v) => !v)}
                                        className="luxury-btn text-sm"
                                        title="Manage categories"
                                    >
                                        <span className="flex items-center gap-2"><Package size={14} /> Categories</span>
                                    </button>
                                    <button onClick={openNewProduct} className="luxury-btn-primary text-sm">
                                        <span className="flex items-center gap-2"><Plus size={14} /> Add Product</span>
                                    </button>
                                </div>
                            </div>

                            {/* ── Category Manager ── */}
                            <AnimatePresence>
                                {showCatManager && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="luxury-card p-5 mb-6 overflow-hidden"
                                    >
                                        <h3 className="text-luxury-gold text-xs uppercase tracking-wider mb-4">Manage Categories</h3>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {categories.map((cat) => (
                                                <span key={cat} className="flex items-center gap-1 px-3 py-1 rounded-full border border-luxury-gold/30 bg-luxury-gold/10 text-luxury-white/80 text-sm">
                                                    {cat}
                                                    <button
                                                        onClick={() => removeCategory(cat)}
                                                        disabled={categories.length <= 1}
                                                        className="text-luxury-white/40 hover:text-red-400 ml-1 disabled:opacity-30 transition-colors"
                                                        title="Remove category"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                value={newCategory}
                                                onChange={(e) => setNewCategory(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                                                className="luxury-input flex-1 text-sm"
                                                placeholder="New category name (e.g. anklets)"
                                            />
                                            <button onClick={addCategory} className="luxury-btn-primary text-sm px-4">
                                                <span className="flex items-center gap-1"><Plus size={14} /> Add</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {loading ? (
                                <div className="text-center py-20"><Loader2 className="text-luxury-gold animate-spin mx-auto" size={40} /></div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {products.map((p) => (
                                        <div key={p.id} className="luxury-card overflow-hidden">
                                            {/* Product Image */}
                                            <div className="relative h-48 bg-luxury-charcoal-light">
                                                {p.images[0] ? (
                                                    <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-luxury-white/20">
                                                        <Package size={40} />
                                                    </div>
                                                )}
                                                <div className="absolute top-2 right-2 flex gap-1">
                                                    {p.featured && <span className="px-2 py-0.5 bg-luxury-gold text-white text-xs rounded">Featured</span>}
                                                    {!p.inStock && <span className="px-2 py-0.5 bg-red-800 text-white text-xs rounded">Out of Stock</span>}
                                                </div>
                                            </div>

                                            {/* Product Info */}
                                            <div className="p-4">
                                                <p className="text-luxury-white font-medium mb-1 truncate">{p.name}</p>
                                                <p className="text-luxury-white/40 text-xs mb-2 uppercase tracking-wider">{p.category} · {p.sku}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-luxury-gold font-display text-lg">{formatPrice(p.price)}</span>
                                                    <div className="flex gap-2 items-center">
                                                        <button
                                                            onClick={() => openEditProduct(p)}
                                                            className="p-2 text-luxury-white/50 hover:text-luxury-gold transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Pencil size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirm(p.id)}
                                                            className="p-2 text-luxury-white/50 hover:text-red-400 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Delete Confirm */}
                                            <AnimatePresence>
                                                {deleteConfirm === p.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="px-4 pb-4"
                                                    >
                                                        <div className="p-3 bg-red-900/30 border border-red-500/40 rounded text-center space-y-2">
                                                            <p className="text-red-400 text-xs">Delete &quot;{p.name}&quot;? This cannot be undone.</p>
                                                            <div className="flex gap-2 justify-center">
                                                                <button onClick={() => setDeleteConfirm(null)} className="luxury-btn text-xs"><span>Cancel</span></button>
                                                                <button onClick={() => deleteProduct(p.id)} className="px-3 py-1 bg-red-700 hover:bg-red-600 text-white text-xs rounded transition-colors">
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ── ORDERS TAB ── */}
                    {tab === 'orders' && (
                        <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            {loading ? (
                                <div className="text-center py-20"><Loader2 className="text-luxury-gold animate-spin mx-auto" size={40} /></div>
                            ) : orders.length === 0 ? (
                                <div className="text-center py-20 text-luxury-white/40">No orders yet</div>
                            ) : (
                                <div className="space-y-3">
                                    {orders.map((order) => (
                                        <div key={order.id} className="luxury-card p-5">
                                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <p className="text-luxury-white font-medium">{order.customerName}</p>
                                                        <span className={`px-2 py-0.5 text-xs rounded border capitalize ${STATUS_COLORS[order.status] || 'text-luxury-white/50 border-luxury-white/20'}`}>{order.status}</span>
                                                    </div>
                                                    <p className="text-luxury-white/50 text-sm">{order.email} · {order.city}, {order.country}</p>
                                                    <p className="text-luxury-white/40 text-xs mt-1">{new Date(order.createdAt).toLocaleDateString()} · {order.items?.length || 0} items</p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <p className="text-luxury-gold font-display text-xl">{formatPrice(order.total)}</p>
                                                    <button onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)} className="luxury-btn text-xs">
                                                        <span>{selectedOrder?.id === order.id ? 'Hide' : 'Details'}</span>
                                                    </button>
                                                    <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)} className="luxury-input text-xs py-1 px-2">
                                                        {['pending', 'processing', 'shipped', 'delivered'].map((s) => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                            {selectedOrder?.id === order.id && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 border-t border-luxury-charcoal-light pt-4 space-y-2">
                                                    {order.items.map((item) => (
                                                        <div key={item.id} className="flex justify-between text-sm">
                                                            <span className="text-luxury-white/70">{item.product.name} × {item.quantity}</span>
                                                            <span className="text-luxury-gold">{formatPrice(item.unitPrice * item.quantity)}</span>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ── MESSAGES TAB ── */}
                    {tab === 'messages' && (
                        <motion.div key="messages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            {loading ? (
                                <div className="text-center py-20"><Loader2 className="text-luxury-gold animate-spin mx-auto" size={40} /></div>
                            ) : messages.length === 0 ? (
                                <div className="text-center py-20 text-luxury-white/40">No messages yet</div>
                            ) : (
                                <div className="space-y-3">
                                    {messages.map((msg) => (
                                        <div key={msg.id} className={`luxury-card p-5 ${!msg.read ? 'border-luxury-gold/30' : ''}`}>
                                            <div className="flex flex-col md:flex-row md:items-start gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <p className="text-luxury-white font-medium">{msg.name}</p>
                                                        {!msg.read && <span className="px-2 py-0.5 text-xs rounded border text-luxury-gold border-luxury-gold/30 bg-luxury-gold/10">New</span>}
                                                    </div>
                                                    <p className="text-luxury-white/50 text-sm">{msg.email}{msg.phone && ` · ${msg.phone}`}</p>
                                                    <p className="text-luxury-gold text-sm mt-2 mb-1 font-medium">{msg.subject}</p>
                                                    <p className="text-luxury-white/70 text-sm leading-relaxed">{msg.message}</p>
                                                    <p className="text-luxury-white/30 text-xs mt-2">{new Date(msg.createdAt).toLocaleString()}</p>
                                                </div>
                                                {!msg.read && (
                                                    <button onClick={() => markMessageRead(msg.id)} className="luxury-btn text-xs flex-shrink-0"><span>Mark Read</span></button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── PRODUCT FORM MODAL ── */}
            <AnimatePresence>
                {showProductForm && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto"
                        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
                        onClick={(e) => { if (e.target === e.currentTarget) { setShowProductForm(false) } }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="luxury-card w-full max-w-2xl p-8 relative"
                        >
                            <button onClick={() => { setShowProductForm(false) }} className="absolute top-4 right-4 text-luxury-white/40 hover:text-luxury-white transition-colors">
                                <X size={20} />
                            </button>

                            <h2 className="font-display text-2xl text-luxury-white mb-8">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>

                            <form onSubmit={saveProduct} className="space-y-5">
                                {/* Name + Slug */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-luxury-gold text-xs uppercase tracking-wider mb-1">Name *</label>
                                        <input name="name" value={productForm.name} onChange={handleProductFormChange} onBlur={autoSlug} required className="luxury-input" placeholder="Product name" />
                                    </div>
                                    <div>
                                        <label className="block text-luxury-gold text-xs uppercase tracking-wider mb-1">Slug *</label>
                                        <input name="slug" value={productForm.slug} onChange={handleProductFormChange} required className="luxury-input" placeholder="url-friendly-slug" />
                                    </div>
                                </div>

                                {/* SKU + Category */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-luxury-gold text-xs uppercase tracking-wider mb-1">SKU *</label>
                                        <input name="sku" value={productForm.sku} onChange={handleProductFormChange} required className="luxury-input" placeholder="AM-RNG-001-00000" />
                                    </div>
                                    <div>
                                        <label className="block text-luxury-gold text-xs uppercase tracking-wider mb-1">Category</label>
                                        <select name="category" value={productForm.category} onChange={handleProductFormChange} className="luxury-input">
                                            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="block text-luxury-gold text-xs uppercase tracking-wider mb-1">Price (PKR) *</label>
                                    <input type="number" name="price" value={productForm.price} onChange={handleProductFormChange} required min={0} step={0.01} className="luxury-input" />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-luxury-gold text-xs uppercase tracking-wider mb-1">Description *</label>
                                    <textarea name="description" value={productForm.description} onChange={handleProductFormChange} required rows={3} className="luxury-input resize-none" />
                                </div>

                                {/* Images */}
                                <div>
                                    <label className="block text-luxury-gold text-xs uppercase tracking-wider mb-2">Images</label>
                                    <div className="space-y-3">
                                        {/* Hidden file input */}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                const idx = Number(e.target.dataset.idx ?? 0)
                                                if (file) uploadImage(idx, file)
                                                e.target.value = ''
                                            }}
                                        />

                                        {productForm.images.map((url, idx) => (
                                            <div key={idx} className="rounded-lg border border-luxury-charcoal-light overflow-hidden">
                                                {/* Drop zone / Preview */}
                                                <div
                                                    className={`relative flex items-center justify-center bg-luxury-charcoal-light transition-colors ${
                                                        url ? 'h-40' : 'h-28'
                                                    } ${uploadingIdx === idx ? 'opacity-60' : ''}`}
                                                    onDragOver={(e) => e.preventDefault()}
                                                    onDrop={(e) => handleFileDrop(idx, e)}
                                                >
                                                    {url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('/')) && url.length > 5 ? (
                                                        <>
                                                            <Image
                                                                src={url}
                                                                alt={`Image ${idx + 1}`}
                                                                fill
                                                                className="object-cover"
                                                                unoptimized
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        if (fileInputRef.current) {
                                                                            fileInputRef.current.dataset.idx = String(idx)
                                                                            fileInputRef.current.click()
                                                                        }
                                                                    }}
                                                                    className="p-2 bg-black/60 rounded-full text-white hover:text-luxury-gold transition-colors"
                                                                    title="Replace image"
                                                                >
                                                                    <Upload size={16} />
                                                                </button>
                                                                {productForm.images.length > 1 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeImageField(idx)}
                                                                        className="p-2 bg-black/60 rounded-full text-red-400 hover:text-red-300 transition-colors"
                                                                        title="Remove"
                                                                    >
                                                                        <X size={16} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (fileInputRef.current) {
                                                                    fileInputRef.current.dataset.idx = String(idx)
                                                                    fileInputRef.current.click()
                                                                }
                                                            }}
                                                            className="flex flex-col items-center gap-2 text-luxury-white/40 hover:text-luxury-gold transition-colors w-full h-full justify-center"
                                                        >
                                                            <Upload size={24} />
                                                            <span className="text-xs">Click to upload or drag &amp; drop</span>
                                                        </button>
                                                    )}

                                                    {/* Uploading overlay */}
                                                    {uploadingIdx === idx && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                                                            <Loader2 size={24} className="text-luxury-gold animate-spin" />
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        ))}

                                        <button type="button" onClick={addImageField} className="text-luxury-gold/60 hover:text-luxury-gold text-xs flex items-center gap-1 transition-colors mt-1">
                                            <Plus size={12} /> Add another image
                                        </button>
                                    </div>
                                </div>

                                {/* Toggles */}
                                <div className="flex gap-8">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" name="inStock" checked={productForm.inStock} onChange={handleProductFormChange} className="w-4 h-4 accent-[#D4AF37]" />
                                        <span className="text-luxury-white/70 text-sm">In Stock</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" name="featured" checked={productForm.featured} onChange={handleProductFormChange} className="w-4 h-4 accent-[#D4AF37]" />
                                        <span className="text-luxury-white/70 text-sm">Featured</span>
                                    </label>
                                </div>

                                {/* Error */}
                                {productError && (
                                    <div className="p-3 rounded border border-red-500/40 bg-red-900/20 text-red-400 text-sm">
                                        {productError}
                                    </div>
                                )}

                                {/* Submit */}
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => { setShowProductForm(false) }} className="luxury-btn flex-1"><span>Cancel</span></button>
                                    <button type="submit" disabled={productLoading} className="luxury-btn-primary flex-1 disabled:opacity-50">
                                        <span className="flex items-center justify-center gap-2">
                                            {productLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                            {editingProduct ? 'Save Changes' : 'Create Product'}
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── PROMO FORM MODAL ── */}
            <AnimatePresence>
                {showPromoForm && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
                        onClick={(e) => { if (e.target === e.currentTarget) { setShowPromoForm(false) } }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="luxury-card w-full max-w-md p-8 relative"
                        >
                            <button onClick={() => { setShowPromoForm(false) }} className="absolute top-4 right-4 text-luxury-white/40 hover:text-luxury-white transition-colors">
                                <X size={20} />
                            </button>

                            <h2 className="font-display text-2xl text-luxury-white mb-6">
                                {editingPromo ? 'Edit Promo Code' : 'Add New Promo Code'}
                            </h2>

                            <form onSubmit={savePromoCode} className="space-y-5">
                                <div>
                                    <label className="block text-luxury-gold text-xs uppercase tracking-wider mb-1">Code *</label>
                                    <input name="code" value={promoForm.code} onChange={handlePromoFormChange} required className="luxury-input" placeholder="e.g. WELCOME10" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-luxury-gold text-xs uppercase tracking-wider mb-1">Discount Type</label>
                                        <select name="discountType" value={promoForm.discountType} onChange={handlePromoFormChange} className="luxury-input">
                                            <option value="flat">Flat Amount</option>
                                            <option value="percentage">Percentage %</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-luxury-gold text-xs uppercase tracking-wider mb-1">Discount Value *</label>
                                        <input type="number" name="discount" value={promoForm.discount} onChange={handlePromoFormChange} required min={0} step={0.01} className="luxury-input" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-luxury-gold text-xs uppercase tracking-wider mb-1">Expires At (Optional)</label>
                                    <input type="date" name="expiresAt" value={promoForm.expiresAt} onChange={handlePromoFormChange} className="luxury-input" />
                                </div>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" name="active" checked={promoForm.active} onChange={handlePromoFormChange} className="w-4 h-4 accent-[#D4AF37]" />
                                    <span className="text-luxury-white/70 text-sm">Active Now</span>
                                </label>

                                {promoError && (
                                    <div className="p-3 rounded border border-red-500/40 bg-red-900/20 text-red-400 text-sm">
                                        {promoError}
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => { setShowPromoForm(false) }} className="luxury-btn flex-1"><span>Cancel</span></button>
                                    <button type="submit" disabled={promoLoading} className="luxury-btn-primary flex-1 disabled:opacity-50">
                                        <span className="flex items-center justify-center gap-2">
                                            {promoLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                            {editingPromo ? 'Save' : 'Create'}
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
