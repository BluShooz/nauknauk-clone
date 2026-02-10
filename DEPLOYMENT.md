# 🚀 Deployment Guide - NaukNauk Clone

This guide will help you deploy your NaukNauk clone to production.

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] Supabase project set up with database tables
- [ ] Replicate API token ready
- [ ] GitHub repository created
- [ ] Vercel account (or preferred hosting)
- [ ] Custom domain (optional)

## 🎯 Quick Deploy to Vercel (Recommended)

### Step 1: Push to GitHub

```bash
# Navigate to your project
cd nauknauk-clone/nauknauk-clone

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: NaukNauk MVP"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/nauknauk-clone.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `nauknauk-clone/nauknauk-clone` (if nested)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

5. Add Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
REPLICATE_API_TOKEN=your_replicate_token
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

6. Click "Deploy"
7. Wait for deployment to complete (~2-3 minutes)
8. Visit your live site!

### Step 3: Update Production URLs

After deployment, update your Supabase settings:

1. Go to Supabase > Authentication > URL Configuration
2. Add your Vercel URL to "Site URL"
3. Add to "Redirect URLs" as well

## 🔧 Alternative: Deploy to Other Platforms

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build project
npm run build

# Deploy
netlify deploy --prod
```

### AWS Amplify

1. Go to Amplify Console
2. Connect GitHub repository
3. Build settings: Next.js default
4. Add environment variables
5. Deploy

### Self-Hosted (VPS/Docker)

```bash
# Build the project
npm run build

# Start production server
npm start

# Or use PM2 for process management
npm install -g pm2
pm2 start npm --name "nauknauk" -- start
```

## 🌐 Custom Domain Setup

### Option 1: Vercel Domains

1. Go to Vercel project > Settings > Domains
2. Add your domain (e.g., `yourdomain.com`)
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

### Option 2: External DNS

1. Buy domain from Namecheap, GoDaddy, etc.
2. Add CNAME record pointing to `cname.vercel-dns.com`
3. Or add A record pointing to Vercel's IP
4. Update environment variable: `NEXT_PUBLIC_APP_URL=https://yourdomain.com`

## 🔐 Security Checklist

### Before Going Live:

1. **Environment Variables**
   - [ ] Never commit `.env.local`
   - [ ] Use strong passwords
   - [ ] Enable 2FA on Supabase/Replicate

2. **Supabase Security**
   - [ ] Enable email confirmation
   - [ ] Set up proper RLS policies
   - [ ] Enable rate limiting (Supabase Pro)

3. **API Security**
   - [ ] Use API keys properly
   - [ ] Implement rate limiting
   - [ ] Add error handling

4. **Performance**
   - [ ] Enable image optimization
   - [ ] Set up CDN caching
   - [ ] Monitor API usage

## 📊 Monitoring & Analytics

### Set Up Analytics

**Vercel Analytics** (Free tier available):
```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

**Google Analytics** (Optional):
1. Create GA4 property
2. Add measurement ID to environment variables
3. Install `next-google-analytics`

### Error Tracking

**Sentry** (Recommended):
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

## 🧪 Testing Before Launch

### Pre-Launch Checklist:

1. **User Flow Testing**
   - [ ] Sign up works
   - [ ] Login works
   - [ ] Image upload works
   - [ ] Animation generation works
   - [ ] Explore page loads
   - [ ] Profile page displays

2. **Browser Testing**
   - [ ] Chrome (Desktop & Mobile)
   - [ ] Safari (Desktop & Mobile)
   - [ ] Firefox
   - [ ] Edge

3. **Device Testing**
   - [ ] iPhone
   - [ ] Android
   - [ ] iPad/Tablet
   - [ ] Desktop (1920x1080)
   - [ ] Desktop (1366x768)

4. **Performance**
   - [ ] Page load < 3 seconds
   - [ ] Mobile score > 90
   - [ ] Desktop score > 90

Test with: [Google PageSpeed Insights](https://pagespeed.web.dev/)

## 💰 Post-Launch Tasks

### Week 1:
- [ ] Monitor error rates
- [ ] Check API costs (Replicate dashboard)
- [ ] Gather user feedback
- [ ] Fix critical bugs

### Month 1:
- [ ] Analyze usage patterns
- [ ] Optimize high-cost operations
- [ ] Plan feature roadmap
- [ ] Set up automated backups

### Ongoing:
- [ ] Regular security updates
- [ ] Performance optimization
- [ ] User support
- [ ] Feature development

## 🔄 CI/CD Pipeline

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🆘 Troubleshooting

### Common Issues:

**1. Build Failures**
- Check Node.js version (use 18+)
- Clear cache: `rm -rf .next node_modules && npm install`
- Check all environment variables are set

**2. API Errors**
- Verify API tokens are valid
- Check rate limits
- Test API endpoints directly

**3. Database Issues**
- Verify Supabase connection
- Check RLS policies
- Test queries in Supabase editor

**4. Images Not Loading**
- Check storage bucket is public
- Verify CORS settings
- Check file paths

## 📈 Scaling Tips

### When You Grow:

1. **Cost Reduction**
   - Self-host AI models (save ~90% on API costs)
   - Use CDN for static assets
   - Implement caching

2. **Performance**
   - Add Redis caching
   - Use database read replicas
   - Implement queue system for animations

3. **Reliability**
   - Set up monitoring alerts
   - Implement automated backups
   - Use multiple regions

## 🎉 Success Metrics

Track these KPIs:

- **User Acquisition**: New signups per day
- **Engagement**: Animations created per user
- **Retention**: % users returning after 7 days
- **Cost**: Cost per animation
- **Revenue**: If monetized, ARPU (Average Revenue Per User)

## 📞 Support

If you need help:
- Check the [README.md](README.md)
- Review Supabase docs
- Review Vercel docs
- Search GitHub Issues

---

**You're ready to launch! 🚀**

Your NaukNauk clone is now live and ready to bring collections to life!
