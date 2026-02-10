'use client'

import { useState } from 'react'
import { Wand2, Upload, Sparkles, Users, Zap } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>

        <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">NaukNauk</span>
          </div>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-white hover:text-purple-300 transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
            >
              Get Started
            </Link>
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Where imagination
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              shapes your everyday life
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Instantly transform photos of your collection into fun, animated videos.
            Share your passion, your way, just as you imagined.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/animate"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition shadow-2xl flex items-center gap-2"
            >
              <Wand2 className="w-5 h-5" />
              Start Animating
            </Link>
            <Link
              href="/explore"
              className="px-8 py-4 bg-white/10 backdrop-blur text-white rounded-full text-lg font-semibold hover:bg-white/20 transition border border-white/20"
            >
              Explore Gallery
            </Link>
          </div>

          {/* Demo Video Placeholder */}
          <div className="mt-16 relative max-w-4xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl border border-white/10 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <p className="text-white text-lg">Demo Animation Coming Soon</p>
                <p className="text-gray-400 text-sm mt-2">Upload a photo and watch it come to life</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-4">
          Your Fandom, Amplified
        </h2>
        <p className="text-gray-400 text-center mb-12 text-lg">
          Experience your collections with fellow fans in a whole new dimension
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Users,
              title: 'Collect',
              description: 'Organize and showcase your toy collection in a beautiful digital display. Share your treasures with a community that appreciates them.',
              color: 'from-purple-500 to-indigo-500'
            },
            {
              icon: Sparkles,
              title: 'Connect',
              description: 'Find fellow enthusiasts who share your passion. Build meaningful connections through your shared interests and fandoms.',
              color: 'from-pink-500 to-rose-500'
            },
            {
              icon: Zap,
              title: 'Animate',
              description: 'Bring your static figures to life. Transform pictures into dynamic animations and create stories with your favorite characters.',
              color: 'from-amber-500 to-orange-500'
            }
          ].map((feature, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`relative group p-8 rounded-3xl bg-gradient-to-br ${feature.color} bg-opacity-10 border border-white/10 backdrop-blur-sm transition-all duration-300 ${
                hoveredCard === index ? 'scale-105 shadow-2xl' : ''
              }`}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Bring Your Collection to Life?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Download NaukNauk today and join thousands of toy enthusiasts
            </p>
            <Link
              href="/signup"
              className="inline-block px-8 py-4 bg-white text-purple-600 rounded-full text-lg font-semibold hover:bg-gray-100 transition shadow-xl"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400">© 2025 NaukNauk. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-white transition">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
