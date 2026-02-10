'use client'

import { useState, useEffect } from 'react'
import { Heart, MessageCircle, Share2, Sparkles, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Animation {
  id: string
  original_image: string
  animation_url: string
  template: string
  likes_count: number
  comments_count: number
  user: {
    username: string
    avatar_url: string
  }
  created_at: string
}

export default function ExplorePage() {
  const router = useRouter()
  const [animations, setAnimations] = useState<Animation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'trending' | 'new' | 'following'>('trending')

  useEffect(() => {
    fetchAnimations()
  }, [filter])

  const fetchAnimations = async () => {
    setLoading(true)
    try {
      if (!supabase) {
        // Use mock data if supabase not configured
        setAnimations(getMockAnimations())
        return
      }

      const { data, error } = await supabase
        .from('animations')
        .select(`
          *,
          user:user_id(username, avatar_url)
        `)
        .order(filter === 'trending' ? 'likes_count' : 'created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      setAnimations(data || [])
    } catch (error) {
      console.error('Failed to fetch animations:', error)
      // Mock data for demo
      setAnimations(getMockAnimations())
    } finally {
      setLoading(false)
    }
  }

  const getMockAnimations = (): Animation[] => {
    return [
      {
        id: '1',
        original_image: 'https://img-qn.nauknauk.io/assets/Elaina.jpg',
        animation_url: 'https://img-qn.nauknauk.io/assets/Elaina-h265.mp4',
        template: 'dance',
        likes_count: 1234,
        comments_count: 56,
        user: { username: 'BVE_X', avatar_url: 'https://img.nauknauk.io/tmp/avatar_1.png' },
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        original_image: 'https://img-qn.nauknauk.io/assets/Goku.jpg',
        animation_url: 'https://img-qn.nauknauk.io/assets/Goku.mp4',
        template: 'fight',
        likes_count: 892,
        comments_count: 34,
        user: { username: 'KK', avatar_url: 'https://img.nauknauk.io/tmp/avatar_2.png' },
        created_at: new Date().toISOString(),
      },
    ]
  }

  const handleLike = async (animationId: string) => {
    // Implement like functionality
    setAnimations(animations.map(anim => {
      if (anim.id === animationId) {
        return { ...anim, likes_count: anim.likes_count + 1 }
      }
      return anim
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black">
      {/* Header */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto border-b border-white/10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
          <Sparkles className="w-8 h-8 text-purple-400" />
          <span className="text-2xl font-bold text-white">NaukNauk</span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/animate')}
            className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
          >
            Create
          </button>
          <button className="px-4 py-2 text-white hover:text-purple-300 transition">
            Profile
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8">
          {[
            { key: 'trending', label: 'Trending', icon: TrendingUp },
            { key: 'new', label: 'New', icon: Sparkles },
            { key: 'following', label: 'Following', icon: null },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-6 py-3 rounded-full font-medium transition flex items-center gap-2 ${
                filter === tab.key
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              {tab.icon && <tab.icon className="w-5 h-5" />}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white mt-4">Loading amazing creations...</p>
          </div>
        ) : animations.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
            <p className="text-gray-400">No animations yet. Be the first to create one!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {animations.map((animation) => (
              <div
                key={animation.id}
                className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-purple-400/50 transition"
              >
                {/* Video */}
                <div className="relative aspect-square">
                  <video
                    src={animation.animation_url}
                    className="w-full h-full object-cover"
                    loop
                    muted
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause()
                      e.currentTarget.currentTime = 0
                    }}
                  />
                </div>

                {/* User Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={animation.user.avatar_url}
                        alt={animation.user.username}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-white font-medium text-sm">
                        {animation.user.username}
                      </span>
                    </div>
                    <span className="text-gray-400 text-xs">
                      {new Date(animation.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(animation.id)}
                      className="flex items-center gap-1 text-white hover:text-pink-400 transition"
                    >
                      <Heart className="w-5 h-5" />
                      <span className="text-sm">{animation.likes_count}</span>
                    </button>
                    <button className="flex items-center gap-1 text-white hover:text-purple-400 transition">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{animation.comments_count}</span>
                    </button>
                    <button className="ml-auto text-white hover:text-purple-400 transition">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
