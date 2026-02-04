# ⚡ Quick Start Guide

## 30-Second Setup

```bash
# 1. Navigate to project
cd "d:\Playground\New folder"

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

✅ Open [http://localhost:3000](http://localhost:3000)

---

## First 5 Minutes

### 1. Explore the Pages
- **Home**: Scroll through the cinematic experience
- **Shop**: Filter products, hover over cards
- **Product Detail**: Click a product, toggle 3D view, change materials
- **About**: See the brand story and timeline
- **Contact**: Try the contact form

### 2. Test the 3D Viewer
- Drag to rotate jewelry
- Scroll to zoom
- Click material buttons to change in real-time

### 3. Try the Cart
- Add products from detail pages
- Click shopping bag icon in header
- Adjust quantities
- See real-time total updates

---

## Key Files to Customize

### Add Your Products
📁 `src/lib/data.ts`
```typescript
export const products: Product[] = [
  {
    id: '7',
    name: 'Your New Ring',
    slug: 'your-new-ring',
    price: 5000,
    category: 'rings',
    // ... add your data
  }
]
```

### Change Colors
📁 `tailwind.config.ts`
```typescript
luxury: {
  black: '#0A0A0A',     // Your brand black
  gold: '#D4AF37',      // Your brand gold
  // ... customize
}
```

### Update Hero Text
📁 `src/components/home/Hero.tsx`
```typescript
<h1 className="...">
  Your Headline Here
</h1>
```

---

## Common Tasks

### Add a New Page
```bash
# Create file
src/app/your-page/page.tsx

# Add navigation link
src/components/layout/Header.tsx
```

### Add a New Component
```bash
# Create file
src/components/your-component/YourComponent.tsx

# Import and use
import YourComponent from '@/components/your-component/YourComponent'
```

### Change Fonts
📁 `src/app/layout.tsx`
```typescript
import { YourFont } from 'next/font/google'
```

---

## Build for Production

```bash
# Create optimized build
npm run build

# Test production build locally
npm start

# Deploy to Vercel
vercel --prod
```

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### 3D Not Loading
- Check browser console for WebGL errors
- Ensure browser supports WebGL
- Try different browser (Chrome recommended)

### Styles Not Updating
```bash
# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev
```

### TypeScript Errors
```bash
# Check types
npm run type-check

# Common fix: restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P > "TypeScript: Restart TS Server"
```

---

## VS Code Extensions (Recommended)

- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **TypeScript Vue Plugin (Volar)**
- **Prettier - Code formatter**
- **ESLint**

---

## Next Steps

1. ✅ Run the project
2. 📝 Read [README.md](README.md) for full details
3. 🎨 Check [DESIGN_RATIONALE.md](DESIGN_RATIONALE.md) for design philosophy
4. 💻 Follow [DEVELOPMENT.md](DEVELOPMENT.md) for advanced development
5. 🚀 Deploy to production

---

## Need Help?

- **Documentation**: Check README.md, DEVELOPMENT.md
- **Code Examples**: Look at existing components
- **Stack Overflow**: Tag with `next.js`, `three.js`, `tailwindcss`
- **GitHub Issues**: Create issue for bugs

---

**You're ready to build luxury e-commerce experiences! 💎**
