'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Settings, Heart, Grid3X3, Bookmark } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface UserProfile {
  id: string
  username: string
  avatar_url: string
  bio: string
  followers_count: number
  following_count: number
  animations_count: number
}

interface Animation {
  id: string
  animation_url: string
  likes_count: number
  template: string
  created_at: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [animations, setAnimations] = useState<Animation[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'posts' | 'liked' | 'saved'>('posts')

  useEffect(() => {
    fetchProfile()
    fetchUserAnimations()
  }, [])

  const fetchProfile = async () => {
    try {
      if (!supabase) {
        // Use mock data if supabase not configured
        setProfile({
          id: 'mock-id',
          username: 'Demo User',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
          bio: 'Toy enthusiast & animation creator ✨',
          followers_count: 1234,
          following_count: 567,
          animations_count: 89,
        })
        return
      }

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      // Mock profile data for now
      setProfile({
        id: user.id,
        username: 'Demo User',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
        bio: 'Toy enthusiast & animation creator ✨',
        followers_count: 1234,
        following_count: 567,
        animations_count: 89,
      })
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserAnimations = async () => {
    try {
      // Mock animations
      setAnimations([
        {
          id: '1',
          animation_url: 'https://img-qn.nauknauk.io/assets/Elaina-h265.mp4',
          likes_count: 1234,
          template: 'dance',
          created_at: new Date().toISOString(),
        },
      ])
    } catch (error) {
      console.error('Failed to fetch animations:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
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
          <button className="p-2 text-white hover:text-purple-300 transition">
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <div className="flex items-start gap-8 mb-8">
          <div className="relative">
            <img
              src={profile?.avatar_url}
              alt={profile?.username}
              className="w-32 h-32 rounded-full border-4 border-purple-400"
            />
            <button className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full text-white hover:bg-purple-700 transition">
              <Settings className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{profile?.username}</h1>
            <p className="text-gray-400 mb-4">{profile?.bio}</p>

            <div className="flex gap-6 mb-4">
              <div>
                <span className="text-white font-bold text-lg">{profile?.animations_count}</span>
                <span className="text-gray-400 ml-1">animations</span>
              </div>
              <div>
                <span className="text-white font-bold text-lg">{profile?.followers_count}</span>
                <span className="text-gray-400 ml-1">followers</span>
              </div>
              <div>
                <span className="text-white font-bold text-lg">{profile?.following_count}</span>
                <span className="text-gray-400 ml-1">following</span>
              </div>
            </div>

            <button className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-8">
          {[
            { key: 'posts', label: 'Posts', icon: Grid3X3 },
            { key: 'liked', label: 'Liked', icon: Heart },
            { key: 'saved', label: 'Saved', icon: Bookmark },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 transition ${
                activeTab === tab.key
                  ? 'border-purple-400 text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {animations.map((animation) => (
            <div
              key={animation.id}
              className="relative aspect-square bg-white/5 rounded-xl overflow-hidden group"
            >
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
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <div className="flex items-center gap-2 text-white">
                  <Heart className="w-5 h-5" />
                  <span>{animation.likes_count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {animations.length === 0 && (
          <div className="text-center py-20">
            <Sparkles className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
            <p className="text-gray-400">
              {activeTab === 'posts' && "You haven't created any animations yet"}
              {activeTab === 'liked' && "You haven't liked any animations yet"}
              {activeTab === 'saved' && "You haven't saved any animations yet"}
            </p>
            {activeTab === 'posts' && (
              <button
                onClick={() => router.push('/animate')}
                className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
              >
                Create Your First Animation
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
