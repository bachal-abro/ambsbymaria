# 🎨 Component Catalog

A comprehensive reference for all reusable components in the Luxe Jewelry Boutique platform.

---

## 🧩 Core Components

### Header
**Location**: `src/components/layout/Header.tsx`

**Purpose**: Main navigation bar with logo, menu, and cart

**Features**:
- Sticky header with scroll-based background
- Mobile hamburger menu
- Shopping cart icon with item count badge
- Smooth animations on mount

**Usage**:
```typescript
import Header from '@/components/layout/Header'

// Used in layout.tsx - no props needed
<Header />
```

**Customization**:
- Edit navigation links in the `navigation` array
- Change logo text/icon in the Logo section
- Modify scroll threshold (line 22: `window.scrollY > 50`)

---

### Footer
**Location**: `src/components/layout/Footer.tsx`

**Purpose**: Site footer with links and social media

**Features**:
- Multi-column layout
- Social media icons
- Newsletter signup
- Responsive grid

**Usage**:
```typescript
import Footer from '@/components/layout/Footer'

<Footer />
```

**Customization**:
- Edit `footerLinks` object for link sections
- Change `socialLinks` array for social media

---

### CartDrawer
**Location**: `src/components/cart/CartDrawer.tsx`

**Purpose**: Slide-out shopping cart panel

**Features**:
- Framer Motion slide animation
- Backdrop blur
- Item quantity controls
- Empty state with CTA
- Total price calculation
- Remove item functionality

**Usage**:
```typescript
import CartDrawer from '@/components/cart/CartDrawer'

<CartDrawer />
```

**State Integration**:
```typescript
const { items, total, removeItem, updateQuantity } = useCartStore()
const { isCartOpen, toggleCart } = useUIStore()
```

---

## 🎬 Animation Components

### PageTransition
**Location**: `src/components/animations/PageTransition.tsx`

**Purpose**: Smooth fade transitions between pages

**Usage**:
```typescript
import PageTransition from '@/components/animations/PageTransition'

<PageTransition>
  <YourPageContent />
</PageTransition>
```

**Customization**:
- Modify `duration` in motion.div props
- Change `ease` function for different feel

---

## 🌐 3D Components

### Product3DViewer
**Location**: `src/components/3d/Product3DViewer.tsx`

**Purpose**: Interactive 3D jewelry viewer with material switching

**Features**:
- Real-time material changes
- OrbitControls (rotate, zoom, pan)
- Auto-rotation option
- Physically-based rendering
- HDR lighting
- Contact shadows
- Loading state

**Props**:
```typescript
interface Product3DViewerProps {
  category: 'rings' | 'necklaces' | 'bracelets' | 'earrings'
  material: Material
  modelPath?: string
  autoRotate?: boolean
  className?: string
}
```

**Usage**:
```typescript
import Product3DViewer from '@/components/3d/Product3DViewer'
import { materials } from '@/lib/data'

<Product3DViewer
  category="rings"
  material={materials[0]} // Yellow Gold
  autoRotate={true}
  className="w-full h-96"
/>
```

**Customization**:
- Modify jewelry geometry in component functions (Ring, Necklace, etc.)
- Adjust camera position (line 133: `position={[0, 0, 5]}`)
- Change lighting intensity and positions

**Performance Tips**:
- Use `autoRotate={false}` on mobile for better performance
- Wrap in `Suspense` for graceful loading
- Consider lazy loading with dynamic imports

---

## 🏠 Home Page Components

### Hero
**Location**: `src/components/home/Hero.tsx`

**Purpose**: Cinematic landing section with 3D

**Features**:
- 3D product viewer with mouse tracking
- GSAP text animations
- Scroll-based opacity/scale
- Animated particles
- Scroll indicator

**Usage**:
```typescript
import Hero from '@/components/home/Hero'

<Hero />
```

**Customization**:
- Change headline text (line 56-60)
- Modify 3D model category (line 48)
- Adjust particle count (line 23: `Array.from({ length: 30 })`)
- Edit GSAP animation timings (lines 24-46)

---

### FeaturedCollections
**Location**: `src/components/home/FeaturedCollections.tsx`

**Purpose**: Grid of featured products with animations

**Features**:
- Staggered entrance animations
- Hover effects with shimmer
- Image optimization
- Responsive grid
- Dynamic product filtering

**Usage**:
```typescript
import FeaturedCollections from '@/components/home/FeaturedCollections'

<FeaturedCollections />
```

**Customization**:
- Change featured products in `src/lib/data.ts` (set `featured: true`)
- Modify grid columns (line 86: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`)
- Adjust stagger delay (line 37: `staggerChildren: 0.2`)

---

### BrandStory
**Location**: `src/components/home/BrandStory.tsx`

**Purpose**: Brand narrative with parallax

**Features**:
- Parallax background elements
- Scroll-based animations
- Stats counter section
- Image with floating accents

**Usage**:
```typescript
import BrandStory from '@/components/home/BrandStory'

<BrandStory />
```

**Customization**:
- Edit story text (lines 34-61)
- Change stats (lines 66-71)
- Modify parallax intensity (line 17: `[100, -100]`)

---

### CraftsmanshipSection
**Location**: `src/components/home/CraftsmanshipSection.tsx`

**Purpose**: Feature showcase with process timeline

**Features**:
- Icon-based feature cards
- Hover animations
- Process timeline with steps
- Grid pattern background

**Usage**:
```typescript
import CraftsmanshipSection from '@/components/home/CraftsmanshipSection'

<CraftsmanshipSection />
```

**Customization**:
- Edit `features` array (lines 6-23)
- Change timeline steps (lines 84-89)
- Modify grid pattern (lines 32-36)

---

### NewsletterSection
**Location**: `src/components/home/NewsletterSection.tsx`

**Purpose**: Newsletter signup with animation

**Features**:
- Form validation
- Loading/success states
- Rotating background decoration
- Email input with submit button

**Usage**:
```typescript
import NewsletterSection from '@/components/home/NewsletterSection'

<NewsletterSection />
```

**Customization**:
- Connect to email service (line 18: `handleSubmit` function)
- Change rotating circle animation (lines 21-27)
- Modify form styling

---

## 🎨 Utility Classes

### Luxury Buttons

**Primary Button**:
```html
<button className="luxury-btn-primary">
  <span>Add to Cart</span>
</button>
```
- Gold background, black text
- Hover: Darker gold
- Includes before/after pseudo-elements for animation

**Ghost Button**:
```html
<button className="luxury-btn">
  <span>View Details</span>
</button>
```
- Transparent background, gold border
- Hover: Gold background, black text

### Luxury Cards

**Standard Card**:
```html
<div className="luxury-card p-6">
  Content here
</div>
```
- Charcoal background
- Border with hover glow effect
- Smooth transitions

### Luxury Inputs

**Text Input**:
```html
<input 
  type="text" 
  className="luxury-input" 
  placeholder="Your name"
/>
```
- Charcoal background
- Gold border on focus
- Consistent padding

**Textarea**:
```html
<textarea 
  className="luxury-input resize-none" 
  rows={6}
/>
```

---

## 📐 Layout Utilities

### Container
```html
<div className="luxury-container">
  Your content (max-width: 1280px, centered)
</div>
```

### Divider
```html
<div className="luxury-divider" />
```
- Horizontal line with gradient

### Text Gradient
```html
<h1 className="text-gradient">
  Luxury Text
</h1>
```
- Gold gradient text effect

### Glow Text
```html
<h1 className="glow-text">
  Glowing Title
</h1>
```
- Text shadow with gold glow

---

## 🎯 Animation Utilities

### Fade In Up
```html
<div className="animate-fade-in-up">
  Content fades in from bottom
</div>
```

### Float
```html
<div className="animate-float">
  Content floats up and down
</div>
```

### Shimmer
```html
<div className="shimmer-effect">
  Shimmer animation overlay
</div>
```

### Glow Pulse
```html
<div className="animate-glow-pulse">
  Pulsing glow effect
</div>
```

---

## 📊 Data Structures

### Product Type
```typescript
interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  category: 'rings' | 'necklaces' | 'bracelets' | 'earrings'
  materials: Material[]
  defaultMaterial: string
  images: string[]
  model3D?: string
  inStock: boolean
  featured?: boolean
  specifications: {
    weight?: string
    dimensions?: string
    gemstone?: string
    carats?: string
    purity?: string
  }
}
```

### Material Type
```typescript
interface Material {
  id: string
  name: string
  color: string      // Hex color for UI and 3D
  metallic: number   // 0-1 for PBR
  roughness: number  // 0-1 for PBR
  price: number      // Additional cost
}
```

---

## 🔧 Common Patterns

### Adding a New Product

1. Edit `src/lib/data.ts`:
```typescript
export const products: Product[] = [
  // ... existing products
  {
    id: '7',
    name: 'New Product',
    slug: 'new-product',
    price: 5000,
    category: 'rings',
    materials: materials,
    defaultMaterial: 'yellow-gold',
    images: ['image-url'],
    inStock: true,
    featured: true,
    specifications: {
      weight: '5g',
      carats: '1ct',
      purity: '18K',
    },
  },
]
```

### Creating a New Luxury Component

```typescript
'use client'

import { motion } from 'framer-motion'

export default function MyComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="luxury-card p-8"
    >
      <h3 className="font-display text-2xl text-luxury-gold mb-4">
        Your Title
      </h3>
      <p className="text-luxury-white/70">
        Your content
      </p>
    </motion.div>
  )
}
```

---

## 🎨 Color Reference

```typescript
// Use in className
bg-luxury-black          // #0A0A0A
bg-luxury-charcoal       // #1A1A1A
bg-luxury-charcoal-light // #2A2A2A
text-luxury-gold         // #D4AF37
text-luxury-gold-light   // #E5C158
text-luxury-champagne    // #F7E7CE
border-luxury-gold       // #D4AF37
```

---

**This catalog covers all major components. For implementation details, see the actual component files.**
