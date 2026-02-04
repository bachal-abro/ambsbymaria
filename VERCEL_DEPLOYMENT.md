# 🚀 Vercel Deployment Guide for AmbsbyMaria

## Quick Deploy (2 Minutes)

### Option 1: Deploy via Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - AmbsbyMaria"
   git remote add origin https://github.com/yourusername/ambsbymaria.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js configuration
   - Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Environment Variables Setup

After deployment, add these environment variables in Vercel Dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following (get from `.env.example`):

### Required for Production:
- `NEXT_PUBLIC_SITE_URL` - Your production URL
- `NEXT_PUBLIC_SITE_NAME` - AmbsbyMaria

### Optional (Add when ready):
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `STRIPE_SECRET_KEY` - Stripe secret key (mark as sensitive)
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `RESEND_API_KEY` - Email service API key
- `EMAIL_FROM` - Your sender email
- `NEXT_PUBLIC_GA_ID` - Google Analytics ID

## Custom Domain Setup

1. Go to Project Settings → Domains
2. Add your custom domain: `www.ambsbymaria.com`
3. Configure DNS records as shown by Vercel
4. Wait for SSL certificate (automatic)

### Recommended DNS Setup:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## Post-Deployment Checklist

- [ ] Verify homepage loads correctly
- [ ] Test 3D diamond ring renders
- [ ] Check all navigation links work
- [ ] Test responsive design on mobile
- [ ] Verify shop page and product details
- [ ] Test cart functionality
- [ ] Check contact form (if email configured)
- [ ] Test all animations are smooth
- [ ] Run Lighthouse audit (target 90+ scores)
- [ ] Add custom domain (optional)
- [ ] Configure Stripe for payments
- [ ] Set up email notifications
- [ ] Add Google Analytics

## Performance Optimization

Your site is already optimized with:
- ✅ Next.js 14 App Router
- ✅ Automatic code splitting
- ✅ Image optimization (Next/Image)
- ✅ Dynamic imports for 3D components
- ✅ Adaptive rendering based on device
- ✅ Efficient caching headers
- ✅ CDN distribution via Vercel Edge Network

## Monitoring & Analytics

### Built-in Vercel Analytics
1. Enable in Project Settings → Analytics
2. View real-time performance metrics
3. Monitor Core Web Vitals

### Custom Analytics (Optional)
Add Google Analytics in `src/app/layout.tsx`:
```tsx
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
  strategy="afterInteractive"
/>
```

## Troubleshooting

### Build Fails
```bash
# Test build locally first
npm run build
npm run start
```

### 3D Scene Not Rendering
- Check browser console for WebGL errors
- Ensure GPU tier detection is working
- Verify postprocessing dependencies installed

### Slow Performance
- Check Vercel Analytics for bottlenecks
- Review Network tab in DevTools
- Consider enabling Edge Functions
- Optimize 3D model complexity further

## Continuous Deployment

Every push to `main` branch automatically deploys to production.

### Workflow:
1. Make changes locally
2. Test with `npm run dev`
3. Commit and push to GitHub
4. Vercel auto-deploys in ~60 seconds
5. Check deployment at dashboard

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Three.js Docs: https://threejs.org/docs

## Production URL

After deployment, your site will be live at:
- Default: `https://ambsbymaria.vercel.app`
- Custom: `https://www.ambsbymaria.com` (after domain setup)

---

**Ready to deploy?** Run `vercel` or push to GitHub! 🚀
