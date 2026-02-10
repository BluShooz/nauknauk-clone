-- ============================================
-- NaukNauk Clone - Database Setup Script
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  animations_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ANIMATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.animations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  original_image TEXT NOT NULL,
  animation_url TEXT NOT NULL,
  template TEXT,
  prompt TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- LIKES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  animation_id UUID NOT NULL REFERENCES public.animations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, animation_id)
);

-- ============================================
-- COMMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  animation_id UUID NOT NULL REFERENCES public.animations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- FOLLOWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- ============================================
-- COLLECTIONS TABLE (for organizing animations)
-- ============================================
CREATE TABLE IF NOT EXISTS public.collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- COLLECTION ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.collection_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  animation_id UUID NOT NULL REFERENCES public.animations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(collection_id, animation_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_animations_user_id ON public.animations(user_id);
CREATE INDEX IF NOT EXISTS idx_animations_created_at ON public.animations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_animations_likes_count ON public.animations(likes_count DESC);
CREATE INDEX IF NOT EXISTS idx_likes_animation_id ON public.likes(animation_id);
CREATE INDEX IF NOT EXISTS idx_comments_animation_id ON public.comments(animation_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON public.follows(following_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_items ENABLE ROW LEVEL SECURITY;

-- USERS POLICIES
CREATE POLICY "Users: Public read access"
  ON public.users FOR SELECT
  USING (true);

CREATE POLICY "Users: Update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users: Insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ANIMATIONS POLICIES
CREATE POLICY "Animations: Public read access"
  ON public.animations FOR SELECT
  USING (true);

CREATE POLICY "Animations: Insert own animations"
  ON public.animations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Animations: Update own animations"
  ON public.animations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Animations: Delete own animations"
  ON public.animations FOR DELETE
  USING (auth.uid() = user_id);

-- LIKES POLICIES
CREATE POLICY "Likes: Public read access"
  ON public.likes FOR SELECT
  USING (true);

CREATE POLICY "Likes: Insert own likes"
  ON public.likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Likes: Delete own likes"
  ON public.likes FOR DELETE
  USING (auth.uid() = user_id);

-- COMMENTS POLICIES
CREATE POLICY "Comments: Public read access"
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "Comments: Insert own comments"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Comments: Delete own comments"
  ON public.comments FOR DELETE
  USING (auth.uid() = user_id);

-- FOLLOWS POLICIES
CREATE POLICY "Follows: Public read access"
  ON public.follows FOR SELECT
  USING (true);

CREATE POLICY "Follows: Insert own follows"
  ON public.follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Follows: Delete own follows"
  ON public.follows FOR DELETE
  USING (auth.uid() = follower_id);

-- COLLECTIONS POLICIES
CREATE POLICY "Collections: Public read access"
  ON public.collections FOR SELECT
  USING (true);

CREATE POLICY "Collections: Insert own collections"
  ON public.collections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Collections: Update own collections"
  ON public.collections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Collections: Delete own collections"
  ON public.collections FOR DELETE
  USING (auth.uid() = user_id);

-- COLLECTION ITEMS POLICIES
CREATE POLICY "Collection Items: Public read access"
  ON public.collection_items FOR SELECT
  USING (true);

CREATE POLICY "Collection Items: Insert via collection ownership"
  ON public.collection_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.collections
      WHERE collections.id = collection_items.collection_id
      AND collections.user_id = auth.uid()
    )
  );

CREATE POLICY "Collection Items: Delete via collection ownership"
  ON public.collection_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.collections
      WHERE collections.id = collection_items.collection_id
      AND collections.user_id = auth.uid()
    )
  );

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_animations_updated_at BEFORE UPDATE ON public.animations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update animation counts on like
CREATE OR REPLACE FUNCTION update_animation_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.animations
    SET likes_count = likes_count + 1
    WHERE id = NEW.animation_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.animations
    SET likes_count = likes_count - 1
    WHERE id = OLD.animation_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_animation_likes_count_trigger
  AFTER INSERT OR DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION update_animation_likes_count();

-- Function to update animation counts on comment
CREATE OR REPLACE FUNCTION update_animation_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.animations
    SET comments_count = comments_count + 1
    WHERE id = NEW.animation_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.animations
    SET comments_count = comments_count - 1
    WHERE id = OLD.animation_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_animation_comments_count_trigger
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_animation_comments_count();

-- Function to update user stats
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Update animations count
    UPDATE public.users
    SET animations_count = animations_count + 1
    WHERE id = NEW.user_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Update animations count
    UPDATE public.users
    SET animations_count = animations_count - 1
    WHERE id = OLD.user_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_animations_count
  AFTER INSERT OR DELETE ON public.animations
  FOR EACH ROW EXECUTE FUNCTION update_user_stats();

-- ============================================
-- STORAGE SETUP
-- ============================================

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public image upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'images');

CREATE POLICY "Public image access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

CREATE POLICY "Public image update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'images');

CREATE POLICY "Public image delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'images');

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert a test user (optional)
-- INSERT INTO public.users (id, username, email, bio)
-- VALUES (
--   uuid_generate_v4(),
--   'test_user',
--   'test@example.com',
--   'Test user account'
-- );

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres;

-- ============================================
-- SETUP COMPLETE
-- ============================================

-- Verify setup
SELECT 'Database setup complete!' as status;

SELECT
  'users' as table_name,
  COUNT(*) as record_count
FROM public.users
UNION ALL
SELECT
  'animations',
  COUNT(*)
FROM public.animations
UNION ALL
SELECT
  'likes',
  COUNT(*)
FROM public.likes
UNION ALL
SELECT
  'comments',
  COUNT(*)
FROM public.comments;
