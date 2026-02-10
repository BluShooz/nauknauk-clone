'use client'

import { useState, useRef } from 'react'
import { Upload, Wand2, Download, Sparkles, Loader2 } from 'lucide-react'
import { animateWithPrompt } from '@/lib/replicate'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const ANIMATION_TEMPLATES = [
  { id: 'dance', name: 'Dance', prompt: 'dancing energetically', icon: '💃' },
  { id: 'fight', name: 'Battle', prompt: 'in an epic battle pose', icon: '⚔️' },
  { id: 'fly', name: 'Fly', prompt: 'flying through the air', icon: '🚀' },
  { id: 'magic', name: 'Magic', prompt: 'casting a magic spell', icon: '✨' },
  { id: 'run', name: 'Run', prompt: 'running fast', icon: '🏃' },
  { id: 'wave', name: 'Wave', prompt: 'waving hello', icon: '👋' },
]

export default function AnimatePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationResult, setAnimationResult] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (base64Image: string): Promise<string> => {
    // Convert base64 to blob
    const response = await fetch(base64Image)
    const blob = await response.blob()
    const file = new File([blob], 'image.png', { type: 'image/png' })

    // Upload to Supabase storage
    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    const fileName = `${Date.now()}-${Math.random()}.png`
    const { error } = await supabase.storage
      .from('images')
      .upload(fileName, file)

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(fileName)

    return publicUrl
  }

  const handleAnimate = async () => {
    if (!image) return

    setIsAnimating(true)
    setProgress(0)
    setAnimationResult(null)

    try {
      setProgress(10)
      const imageUrl = await uploadImage(image)
      setProgress(30)

      const template = ANIMATION_TEMPLATES.find(t => t.id === selectedTemplate)
      const prompt = template?.prompt || 'animated character'

      setProgress(50)

      // Animate with template
      const result = await animateWithPrompt({
        image: imageUrl,
        prompt,
      })

      setProgress(90)

      if (Array.isArray(result)) {
        setAnimationResult(String(result[0]))
      } else if (typeof result === 'string') {
        setAnimationResult(result)
      } else {
        setAnimationResult(String(result))
      }

      setProgress(100)

      // Save to database
      if (supabase) {
        await supabase.from('animations').insert({
          original_image: imageUrl,
          animation_url: result,
          template: selectedTemplate,
          created_at: new Date().toISOString(),
        })
      }

    } catch (error) {
      console.error('Animation failed:', error)
      alert('Animation failed. Please try again.')
    } finally {
      setIsAnimating(false)
    }
  }

  const handleDownload = () => {
    if (animationResult) {
      const link = document.createElement('a')
      link.href = animationResult
      link.download = 'animation.mp4'
      link.click()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black">
      {/* Header */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
          <Sparkles className="w-8 h-8 text-purple-400" />
          <span className="text-2xl font-bold text-white">NaukNauk</span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/explore')}
            className="px-4 py-2 text-white hover:text-purple-300 transition"
          >
            Explore
          </button>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
          >
            Profile
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Bring Your Figure to Life
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6">Upload Image</h2>

            {!image ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-purple-400/50 rounded-2xl p-12 text-center cursor-pointer hover:border-purple-400 transition"
              >
                <Upload className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <p className="text-white text-lg mb-2">Click to upload or drag and drop</p>
                <p className="text-gray-400">PNG, JPG up to 10MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative">
                <img
                  src={image}
                  alt="Uploaded"
                  className="w-full rounded-2xl"
                />
                <button
                  onClick={() => {
                    setImage(null)
                    setAnimationResult(null)
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Animation Result */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6">Animation</h2>

            {isAnimating ? (
              <div className="flex flex-col items-center justify-center h-80">
                <Loader2 className="w-16 h-16 text-purple-400 animate-spin mb-4" />
                <p className="text-white text-lg mb-2">Creating magic...</p>
                <p className="text-gray-400">{progress}% complete</p>
                <div className="w-full bg-white/10 rounded-full h-2 mt-4">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            ) : animationResult ? (
              <div className="space-y-4">
                <video
                  src={animationResult}
                  controls
                  className="w-full rounded-2xl"
                  autoPlay
                  loop
                />
                <button
                  onClick={handleDownload}
                  className="w-full py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Animation
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-80 text-center">
                <Wand2 className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
                <p className="text-gray-400">Your animation will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Templates */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-6">Choose Animation Style</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ANIMATION_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  selectedTemplate === template.id
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-white/10 bg-white/5 hover:border-purple-400/50'
                }`}
              >
                <div className="text-4xl mb-2">{template.icon}</div>
                <div className="text-white font-medium">{template.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Animate Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleAnimate}
            disabled={!image || !selectedTemplate || isAnimating}
            className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            {isAnimating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Animating...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Animate Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
