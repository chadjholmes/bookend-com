'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Target, TrendingUp } from 'lucide-react'
import { Toaster, toast } from 'react-hot-toast';

export default function Home() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    if (!email) return;

    try {
      await addDoc(collection(db, 'betaSignups'), {
        email,
        timestamp: serverTimestamp()
      });

      setStatus('success');
      setEmail('');
      toast.success('Thanks for signing up! We\'ll be in touch soon.', {
        duration: 5000,
        style: {
          background: '#4338ca',
          color: '#fff',
        },
      });
    } catch (error) {
      console.error('Error adding email:', error);
      setStatus('error');
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 relative overflow-hidden">
      <Toaster position="bottom-center" />
      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-white text-2xl">📚</span>
            <span className="text-white text-2xl font-semibold">Bookend</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 pt-20 pb-32 text-center">
        <h1 className="text-white text-6xl font-semibold mb-6 max-w-3xl mx-auto leading-tight">
          Track your reading journey, connect with fellow bookworms.
        </h1>
        <p className="text-white/70 text-lg mb-12 max-w-2xl mx-auto">
          Build lasting reading habits, join vibrant book clubs, and discover your next favorite book. 
          Track your progress, set goals, and connect with readers worldwide.
        </p>
        <div className="flex justify-center gap-4">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email to get started"
              className="px-6 py-3 rounded-lg w-80 bg-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
              disabled={status === 'loading'}
            />
            <button 
              type="submit"
              className="bg-white text-indigo-700 px-6 py-3 rounded-lg hover:bg-white/90 font-medium disabled:opacity-50"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Signing up...' : 'Sign up for beta'}
            </button>
          </form>
          <Link 
            href="https://discord.gg/tGekukT5Su"
            target="_blank"
            className="bg-[#5865F2] text-white px-6 py-3 rounded-lg hover:bg-[#4752c4] font-medium flex items-center gap-2"
          >
            <Image 
              src="/discord-mark-white.svg" 
              alt="Discord"
              width={20}
              height={20}
            />
            Join Discord
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 pb-20">
        <div className="grid grid-cols-3 gap-12 text-white">
          <div className="flex flex-col items-center text-center">
            <BookOpen className="w-8 h-8 mb-4 opacity-80" />
            <h3 className="font-semibold mb-2 text-lg">Manage Your Library</h3>
            <p className="text-white/70 text-sm">Keep track of your books and organize your reading list</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Target className="w-8 h-8 mb-4 opacity-80" />
            <h3 className="font-semibold mb-2 text-lg">Set Goals</h3>
            <p className="text-white/70 text-sm">Create and track your reading goals to stay motivated</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <TrendingUp className="w-8 h-8 mb-4 opacity-80" />
            <h3 className="font-semibold mb-2 text-lg">View Your Progress</h3>
            <p className="text-white/70 text-sm">Track your reading stats and celebrate milestones</p>
          </div>
        </div>
      </section>

      {/* App Preview */}
      <section className="relative z-10 container mx-auto px-6 pb-20">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/10">
          <div className="grid grid-cols-3 gap-8">
            <div className="relative w-full max-w-[400px] mx-auto">
              <div className="absolute w-[120px] h-[25px] bg-black rounded-full top-3 left-1/2 -translate-x-1/2 z-10" />
              <Image
                src="/screenshots/library.png"
                alt="Library Screenshot"
                width={400}
                height={267}
                className="rounded-[40px] w-full shadow-lg border-8 border-black"
              />
            </div>
            <div className="relative w-full max-w-[400px] mx-auto">
              <div className="absolute w-[120px] h-[25px] bg-black rounded-full top-3 left-1/2 -translate-x-1/2 z-10" />
              <Image
                src="/screenshots/progress.png"
                alt="Progress Tracking Screenshot"
                width={400}
                height={267}
                className="rounded-[40px] w-full shadow-lg border-8 border-black"
              />
            </div>
            <div className="relative w-full max-w-[400px] mx-auto">
              <div className="absolute w-[120px] h-[25px] bg-black rounded-full top-3 left-1/2 -translate-x-1/2 z-10" />
              <Image
                src="/screenshots/clubs.png"
                alt="Book Clubs Screenshot"
                width={400}
                height={267}
                className="rounded-[40px] w-full shadow-lg border-8 border-black"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 