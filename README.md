# NaukNauk Clone - AI Animation Platform

[![Deployed on Vercel](https://img.shields.io/badge/deployed%20on-vercel-000000?style=flat&logo=vercel)](https://nauknauk-clone-kwx197iva-jon-smiths-projects-a3dfc292.vercel.app)
[![GitHub stars](https://img.shields.io/github/stars/BluShooz/nauknauk-clone?style=social)](https://github.com/BluShooz/nauknauk-clone/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/BluShooz/nauknauk-clone?style=social)](https://github.com/BluShooz/nauknauk-clone/network/members)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A fully functional MVP of NaukNauk - an AI-powered platform that transforms static toy/figure photos into animated videos.

**🚀 Live Demo:** https://nauknauk-clone-kwx197iva-jon-smiths-projects-a3dfc292.vercel.app
**💻 Repository:** https://github.com/BluShooz/nauknauk-clone

## 🚀 Features

### Core MVP Features (Completed)
- ✅ **AI Animation Engine** - Transform photos into animated videos using Replicate API
- ✅ **User Authentication** - Secure login/signup with Supabase
- ✅ **Image Upload** - Upload and manage images with cloud storage
- ✅ **Animation Templates** - 6 pre-built animation styles (Dance, Battle, Fly, Magic, Run, Wave)
- ✅ **Community Feed** - Explore, like, and share animations
- ✅ **User Profiles** - Showcase your animated collection
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Modern UI** - Beautiful gradient design with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Modern styling
- **Lucide Icons** - Beautiful icon set

### Backend & Services
- **Supabase** - Authentication, database, and file storage
- **Replicate API** - AI video generation (Stable Video Diffusion)
- **PostgreSQL** - Database (via Supabase)

### Deployment
- **Vercel** - Hosting (recommended)
- **Supabase Cloud** - Backend services

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account (free tier works)
- A Replicate API token (pay-per-use)

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd nauknauk-clone
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to Project Settings > API
3. Copy your project URL and anon key
4. Add them to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Create Database Tables

Go to your Supabase project's SQL Editor and run:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  animations_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Animations table
CREATE TABLE IF NOT EXISTS animations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  original_image TEXT NOT NULL,
  animation_url TEXT NOT NULL,
  template TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE animations ENABLE ROW LEVEL SECURITY;

-- Create policies (you can customize these)
CREATE POLICY "Public read access" ON users FOR SELECT USING (true);
CREATE POLICY "Public read access" ON animations FOR SELECT USING (true);
```

### 4. Set Up Storage

1. In Supabase, go to Storage > Create a new bucket
2. Name it `images`
3. Make it public
4. Add a RLS policy to allow public uploads:

```sql
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Allow public downloads"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');
```

### 5. Set Up Replicate API

1. Go to [replicate.com](https://replicate.com)
2. Sign up and get your API token
3. Add to `.env.local`:

```env
REPLICATE_API_TOKEN=your_replicate_token
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
nauknauk-clone/
├── app/
│   ├── page.tsx          # Landing page
│   ├── animate/          # Animation creation
│   ├── explore/          # Community feed
│   ├── profile/          # User profiles
│   ├── login/            # Authentication
│   └── signup/           # Registration
├── lib/
│   ├── supabase.ts       # Supabase client
│   └── replicate.ts      # AI animation API
├── public/               # Static assets
└── .env.local            # Environment variables
```

## 🎨 Features Overview

### 1. Landing Page (`/`)
- Hero section with gradient design
- Feature highlights (Collect, Connect, Animate)
- Call-to-action buttons

### 2. Animation Studio (`/animate`)
- Image upload with drag-and-drop
- 6 animation templates
- Real-time progress tracking
- Download animated videos

### 3. Community Feed (`/explore`)
- Trending animations
- Like, comment, share
- User profiles and follows
- Filter by trending/new/following

### 4. User Profile (`/profile`)
- Profile customization
- Animation gallery
- Stats (followers, following, animations)
- Liked and saved posts

### 5. Authentication
- Email/password signup
- Secure session management
- Protected routes

## 💰 Cost Estimates

### Development (MVP)
- **Time Investment**: 2-4 weeks (we have the foundation!)
- **API Costs** (Replicate):
  - ~$0.01-0.10 per animation
  - Free tier: $5 credit
- **Infrastructure** (Supabase):
  - Free tier: 500MB storage, 50K monthly active users
  - Pro tier: $25/month (recommended for production)

### Monthly Operating Costs (After Launch)
- **1000 animations/month**: ~$10-50 (Replicate)
- **Supabase Pro**: $25/month
- **Vercel Pro**: $20/month
- **Total**: ~$55-95/month for 1K active users

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

### Custom Domain (Optional)

1. Buy a domain (e.g., on Namecheap, GoDaddy)
2. Add it in Vercel dashboard
3. Update DNS records

## 🔧 Configuration Options

### Change AI Model

In `lib/replicate.ts`, you can swap models:

```typescript
// Current: Stable Video Diffusion
"stability-ai/stable-video-diffusion:..."

// Alternative: AnimateDiff
"lucataco/animate-diff:beecf59c90aa74018e7e5f59ac35892e4e392cba62bfb98c2dd728209b60d4d5"

// Alternative: ModelScope for text guidance
"cjwbw/deep-floyd-if:..."
```

### Add More Templates

In `app/animate/page.tsx`, add to `ANIMATION_TEMPLATES`:

```typescript
{
  id: 'custom',
  name: 'Custom',
  prompt: 'your custom prompt here',
  icon: '🎨'
}
```

## 🐛 Troubleshooting

### Images not uploading?
- Check Supabase storage bucket is public
- Verify RLS policies allow uploads
- Check file size limits

### Animation fails?
- Verify Replicate API token is valid
- Check API credits in Replicate dashboard
- Try with a smaller image

### Auth not working?
- Confirm Supabase URL and keys are correct
- Check email confirmation settings in Supabase
- Enable email auth in Supabase auth settings

## 🎯 Roadmap to Enterprise

### Phase 1: MVP (Current ✅)
- Basic AI animation
- User authentication
- Community feed
- 6 animation templates

### Phase 2: Enhanced Features (Next)
- [ ] Self-hosted AI models (cost reduction)
- [ ] More animation templates (20+)
- [ ] Video editing tools
- [ ] Advanced search and filters
- [ ] Direct messaging
- [ ] Mobile apps (iOS/Android)

### Phase 3: Enterprise Features
- [ ] API for third-party integrations
- [ ] White-label options
- [ ] Advanced analytics dashboard
- [ ] Multi-region deployment
- [ ] Enterprise authentication (SSO)
- [ ] Custom branding options

### Phase 4: Scale
- [ ] AI model fine-tuning
- [ ] Batch processing
- [ ] Premium subscription tiers
- [ ] Marketplace for templates
- [ ] Affiliate program

## 📞 Support

For issues or questions:
- GitHub Issues: [Create an issue](../../issues)
- Email: support@yourdomain.com

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Credits

- Original inspiration: [NaukNauk](https://www.nauknauk.io/)
- AI models: Stability AI, Replicate
- UI components: Tailwind CSS, Lucide Icons

---

**Built with ❤️ using Next.js, Supabase, and Replicate**

Ready to bring your collection to life? Start animating today! 🚀
