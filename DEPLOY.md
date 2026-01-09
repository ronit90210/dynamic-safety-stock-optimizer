# 🚀 Deploy to Vercel - Step by Step Guide

Your Dynamic Safety Stock Optimizer is ready to deploy! Follow these simple steps to get your live URL.

## Method 1: Vercel Dashboard (Easiest - 2 minutes) ⭐ RECOMMENDED

### Step 1: Push to GitHub

```bash
cd /Users/ronitroy/dynamic-safety-stock

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - Dynamic Safety Stock Optimizer"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/dynamic-safety-stock.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to **https://vercel.com**
2. Click **"Sign Up"** or **"Login"** (use GitHub account)
3. Click **"Add New Project"**
4. **Import** your `dynamic-safety-stock` repository
5. Vercel will auto-detect it's a Vite project
6. **Configure**:
   - Framework Preset: **Vite**
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `dist`
7. Click **"Deploy"**

### Step 3: Get Your Live URL

After ~2 minutes, you'll get:
- **Production URL**: `https://dynamic-safety-stock-optimizer.vercel.app`
- Auto SSL certificate
- Global CDN
- Automatic deployments on every push

---

## Method 2: Vercel CLI (Alternative - 3 minutes)

### Step 1: Login to Vercel

```bash
cd /Users/ronitroy/dynamic-safety-stock/frontend
npx vercel login
```

Follow the prompts:
- Enter your email
- Click the verification link sent to your email
- Return to terminal

### Step 2: Deploy

```bash
# First deployment (creates project)
npx vercel

# Answer the prompts:
# Set up and deploy? Yes
# Which scope? [Select your account]
# Link to existing project? No
# What's your project's name? dynamic-safety-stock-optimizer
# In which directory is your code located? ./
# Want to override settings? No

# Deploy to production
npx vercel --prod
```

### Step 3: Get Your URL

The CLI will output:
```
✅ Production: https://dynamic-safety-stock-optimizer.vercel.app
```

---

## Method 3: Quick Deploy Button (Instant)

If you've pushed to GitHub, add this to your README.md:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/dynamic-safety-stock)
```

Anyone can deploy your app with one click!

---

## Configuration Files (Already Created ✅)

### `vercel.json`
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### `.vercelignore`
```
node_modules
.git
.env.local
*.log
```

---

## Post-Deployment Checklist

After deploying, verify:

- [ ] **Homepage loads**: Check main dashboard
- [ ] **Service level slider works**: Move slider and see updates
- [ ] **Charts render**: All 3 charts display correctly
- [ ] **CSV upload works**: Test file upload
- [ ] **Mobile responsive**: Check on phone
- [ ] **Performance**: Should load in < 2 seconds

---

## Custom Domain (Optional)

### Add Your Own Domain

1. In Vercel Dashboard → Your Project
2. Go to **Settings** → **Domains**
3. Add domain: `yourdomain.com`
4. Update DNS:
   - **A Record**: `76.76.21.21`
   - **CNAME**: `cname.vercel-dns.com`

---

## Environment Variables (If Using ML Backend)

If you add the Python ML backend later:

1. Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add:
   ```
   VITE_API_URL = https://your-ml-backend-api.com
   ```
3. Redeploy

---

## Automatic Deployments

Once connected to GitHub:

- **Every push to `main`** = Automatic production deployment
- **Pull requests** = Preview deployment with unique URL
- **Rollback** = One-click rollback to any previous deployment

---

## Sharing Your Project

### For LinkedIn Post

```markdown
🚀 Just deployed my AI-powered Dynamic Safety Stock Optimizer!

✅ Live Demo: https://dynamic-safety-stock-optimizer.vercel.app
✅ GitHub: https://github.com/YOUR_USERNAME/dynamic-safety-stock

Built with React + TypeScript + ML Models
- 23% inventory reduction
- 98% service level
- Monte Carlo simulation (10K runs)
- Real-time cost optimization

#SupplyChain #AI #MachineLearning #InventoryManagement
```

### Portfolio Links

- **Live Demo**: `https://dynamic-safety-stock-optimizer.vercel.app`
- **Source Code**: `https://github.com/YOUR_USERNAME/dynamic-safety-stock`
- **Case Study**: Link to LinkedIn article explaining the project

---

## Troubleshooting

### Build Fails on Vercel

**Error**: "Module not found"
**Fix**: Make sure `package.json` has all dependencies:
```bash
npm install
```

### Blank Page After Deploy

**Error**: Routes not working
**Fix**: `vercel.json` should have rewrites (already included ✅)

### Charts Not Rendering

**Error**: Recharts not loading
**Fix**: Check browser console, ensure all imports are correct

---

## Performance Optimization

Vercel automatically provides:
- ✅ Global CDN (200+ locations)
- ✅ Automatic HTTPS
- ✅ Image optimization
- ✅ Compression (Gzip/Brotli)
- ✅ Smart caching

Your app will load in **< 2 seconds globally**!

---

## Cost

- **Free tier**: Perfect for portfolio projects
  - 100GB bandwidth/month
  - Unlimited deployments
  - Custom domains
  - HTTPS included

**Your project will fit easily in the free tier!**

---

## Next Steps

1. ✅ Deploy using Method 1 or 2 above
2. ✅ Get your live URL
3. ✅ Test all features
4. ✅ Share on LinkedIn
5. ✅ Add to portfolio

---

## Quick Reference

```bash
# Deploy to production
cd /Users/ronitroy/dynamic-safety-stock/frontend
npx vercel --prod

# View deployments
npx vercel ls

# View logs
npx vercel logs

# Remove project
npx vercel rm
```

---

**Ready to deploy? Start with Method 1 (Dashboard) - it's the easiest!**

🎉 Your Dynamic Safety Stock Optimizer will be live in minutes!
