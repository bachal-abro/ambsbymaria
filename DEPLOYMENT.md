# 🚀 Deployment Guide

Complete guide for deploying Luxe Jewelry Boutique to production.

---

## 📋 Pre-Deployment Checklist

### Code Quality
- [ ] Run `npm run build` successfully
- [ ] Run `npm run type-check` with no errors
- [ ] Test all pages in production mode (`npm start`)
- [ ] Check browser console for errors
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices

### Performance
- [ ] Run Lighthouse audit (target 90+ score)
- [ ] Optimize images (all using Next/Image)
- [ ] Check 3D performance (60 FPS target)
- [ ] Verify lazy loading is working
- [ ] Test page load times

### Content
- [ ] Replace placeholder images with real products
- [ ] Update product data in `src/lib/data.ts`
- [ ] Check all text for typos
- [ ] Verify all links work
- [ ] Test contact form submission

### Security
- [ ] Remove console.log statements
- [ ] Set up environment variables
- [ ] Review dependencies for vulnerabilities (`npm audit`)
- [ ] Configure CORS if using external API
- [ ] Set up CSP headers

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel?**
- Built by Next.js creators
- Zero-config deployment
- Automatic HTTPS
- Edge network (fast globally)
- Generous free tier

**Steps:**

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Click "Deploy"

3. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
     STRIPE_SECRET_KEY=sk_live_...
     NEXT_PUBLIC_API_URL=https://api.yourdomain.com
     ```

4. **Custom Domain**
   - Go to Project Settings → Domains
   - Add your domain (e.g., luxejewelry.com)
   - Update DNS records as instructed

**Auto-Deploy**: Every push to `main` branch automatically deploys!

---

### Option 2: Netlify

**Steps:**

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18

2. **Deploy**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod
   ```

3. **Environment Variables**
   - Site settings → Build & deploy → Environment
   - Add same variables as Vercel

---

### Option 3: Self-Hosted (VPS)

**Requirements:**
- Ubuntu 20.04+ or similar
- Node.js 18+
- nginx
- PM2 for process management

**Steps:**

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install PM2
   sudo npm install -g pm2
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone YOUR_REPO
   cd luxe-jewelry-boutique

   # Install dependencies
   npm install

   # Build
   npm run build

   # Start with PM2
   pm2 start npm --name "luxe-jewelry" -- start
   pm2 save
   pm2 startup
   ```

3. **Configure nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

---

## 🔐 Environment Variables

### Required Variables

Create `.env.production`:

```env
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key

# API
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Sentry Error Tracking (optional)
SENTRY_DSN=https://your-sentry-dsn
```

### Security Notes
- Never commit `.env` files to Git
- Use different keys for development/production
- Rotate keys regularly
- Use secret management tools (Vercel Secrets, AWS Secrets Manager)

---

## 🎨 Asset Optimization

### Images

1. **Replace placeholder images**
   - Use high-quality product photography
   - Recommended size: 1200x1200px (square)
   - Format: JPG for photos, PNG for graphics

2. **Optimize before upload**
   ```bash
   # Install ImageMagick
   # Resize and optimize
   convert original.jpg -resize 1200x1200 -quality 85 optimized.jpg
   ```

3. **Use CDN** (Cloudinary recommended)
   - Sign up at cloudinary.com
   - Upload images
   - Update image URLs in `src/lib/data.ts`

### 3D Models

1. **Prepare models**
   - Export as `.glb` (binary GLTF)
   - Use Draco compression
   - Keep poly count under 50k triangles

2. **Compress**
   ```bash
   # Install gltf-pipeline
   npm install -g gltf-pipeline

   # Compress
   gltf-pipeline -i model.glb -o model-compressed.glb -d
   ```

3. **Host on CDN**
   - Place in `public/models/` or CDN
   - Update paths in `Product3DViewer.tsx`

---

## 📊 Analytics Setup

### Google Analytics

1. **Create GA4 property**
   - Go to analytics.google.com
   - Create property
   - Get Measurement ID (G-XXXXXXXXXX)

2. **Add to project**

   Create `src/lib/analytics.ts`:
   ```typescript
   export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

   export const pageview = (url: string) => {
     window.gtag('config', GA_TRACKING_ID, {
       page_path: url,
     })
   }
   ```

   Update `src/app/layout.tsx`:
   ```typescript
   import Script from 'next/script'

   <Script
     src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
     strategy="afterInteractive"
   />
   <Script id="google-analytics" strategy="afterInteractive">
     {`
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', '${GA_TRACKING_ID}');
     `}
   </Script>
   ```

---

## 💳 Stripe Integration

### Setup

1. **Get API keys**
   - Go to dashboard.stripe.com
   - Developers → API keys
   - Copy publishable and secret keys

2. **Create checkout session**

   Create `src/app/api/checkout/route.ts`:
   ```typescript
   import { NextResponse } from 'next/server'
   import Stripe from 'stripe'

   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
     apiVersion: '2023-10-16',
   })

   export async function POST(req: Request) {
     const { items } = await req.json()

     const session = await stripe.checkout.sessions.create({
       payment_method_types: ['card'],
       line_items: items.map((item) => ({
         price_data: {
           currency: 'usd',
           product_data: {
             name: item.product.name,
           },
           unit_amount: item.product.price * 100,
         },
         quantity: item.quantity,
       })),
       mode: 'payment',
       success_url: `${req.headers.get('origin')}/success`,
       cancel_url: `${req.headers.get('origin')}/cart`,
     })

     return NextResponse.json({ sessionId: session.id })
   }
   ```

3. **Create checkout page**
   - See Stripe docs for complete implementation

---

## 🔍 SEO Optimization

### Update Metadata

Edit `src/app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: 'Your Brand | Premium Jewelry',
  description: 'Your actual description',
  keywords: 'luxury jewelry, diamond rings, ...',
  openGraph: {
    title: 'Your Brand',
    description: 'Your description',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Brand',
    description: 'Your description',
    images: ['/twitter-image.jpg'],
  },
}
```

### Add sitemap

Create `src/app/sitemap.ts`:
```typescript
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://yourdomain.com',
      lastModified: new Date(),
    },
    {
      url: 'https://yourdomain.com/shop',
      lastModified: new Date(),
    },
    // ... add all pages
  ]
}
```

### Add robots.txt

Create `public/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
```

---

## 🧪 Testing Before Launch

### Manual Testing Checklist
- [ ] Test all navigation links
- [ ] Submit contact form
- [ ] Add items to cart
- [ ] Change materials on product page
- [ ] Test 3D viewer on mobile
- [ ] Check responsive design at all breakpoints
- [ ] Test keyboard navigation
- [ ] Check color contrast (accessibility)

### Performance Testing
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://yourdomain.com --view
```

Target scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

---

## 📈 Post-Launch Monitoring

### Error Tracking

**Sentry Setup:**
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### Uptime Monitoring

Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake

### Analytics Dashboard

Monitor:
- Page views
- Bounce rate
- Conversion rate (add to cart → purchase)
- Popular products
- User flow

---

## 🔄 Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test
```

---

## 🎉 Launch Checklist

### Final Steps
- [ ] Domain configured and working
- [ ] SSL certificate active (HTTPS)
- [ ] Environment variables set
- [ ] Analytics tracking
- [ ] Error monitoring active
- [ ] Backup strategy in place
- [ ] All content updated
- [ ] Legal pages (Privacy, Terms) added
- [ ] Contact information correct
- [ ] Test purchase flow end-to-end

### Communication
- [ ] Announce on social media
- [ ] Email existing customers
- [ ] Press release (if applicable)
- [ ] Update Google My Business

---

**Congratulations on your launch! 🚀💎**
