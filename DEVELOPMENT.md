# Development Guide

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
npm start
```

---

## Component Development Guidelines

### Creating New Pages

1. Create file in `src/app/[route]/page.tsx`
2. Use TypeScript and include proper types
3. Wrap content in motion components for animations
4. Follow luxury design patterns

Example:
```typescript
'use client'

import { motion } from 'framer-motion'

export default function NewPage() {
  return (
    <div className="min-h-screen bg-luxury-black pt-32 pb-20">
      <div className="luxury-container">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-display-lg text-gradient"
        >
          Your Title
        </motion.h1>
      </div>
    </div>
  )
}
```

### Adding 3D Models

1. **Custom Models**: Place `.glb` or `.gltf` files in `public/models/`
2. **Update Product3DViewer**: Modify to load custom models
3. **Optimize**: Use Draco compression for production

```typescript
import { useGLTF } from '@react-three/drei'

function CustomModel({ material }: JewelryModelProps) {
  const { scene } = useGLTF('/models/your-model.glb')
  // Apply materials and return
}
```

---

## State Management

### Cart Store (Zustand)

```typescript
// Add item
const addItem = useCartStore((state) => state.addItem)
addItem(product, material, quantity)

// Remove item
const removeItem = useCartStore((state) => state.removeItem)
removeItem(productId, materialId)

// Get total
const total = useCartStore((state) => state.total)
```

### UI Store

```typescript
const { toggleCart, toggleMenu } = useUIStore()
```

---

## Styling Guidelines

### Use Luxury Design Tokens

```typescript
// Colors
bg-luxury-black
bg-luxury-charcoal
text-luxury-gold
border-luxury-gold

// Typography
font-display (Playfair Display)
font-sans (Inter)
font-serif (Cormorant Garamond)

// Custom Components
luxury-btn
luxury-btn-primary
luxury-card
luxury-input
```

### Animation Patterns

```typescript
// GSAP for complex sequences
gsap.from(element, {
  opacity: 0,
  y: 100,
  duration: 1.2,
  ease: 'power4.out',
})

// Framer Motion for components
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.8 }}
/>

// Scroll-based
const { scrollYProgress } = useScroll()
const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
```

---

## Performance Best Practices

1. **Images**: Always use Next/Image with proper sizes
2. **3D**: Use Suspense and lazy loading
3. **Code Splitting**: Dynamic imports for heavy components
4. **Fonts**: Preload with next/font
5. **Analytics**: Avoid heavy third-party scripts

---

## Testing Checklist

Before deployment:

- [ ] All pages load without errors
- [ ] 3D viewer works on all product pages
- [ ] Cart persists on refresh
- [ ] Mobile navigation works
- [ ] Forms validate properly
- [ ] Animations are smooth (60 FPS)
- [ ] Images are optimized
- [ ] No console errors
- [ ] Lighthouse score > 90

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Auto-deploys on push to main

### Environment Variables

Required for production:
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
```

---

## Troubleshooting

### 3D Viewer Not Loading
- Check WebGL support in browser
- Ensure models are in correct format
- Check console for Three.js errors

### Animations Stuttering
- Reduce particle count
- Check for memory leaks
- Use Chrome DevTools Performance tab

### Build Errors
```bash
rm -rf .next node_modules
npm install
npm run build
```
