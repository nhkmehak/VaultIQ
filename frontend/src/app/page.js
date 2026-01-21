'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="text-center text-white px-4">
        <h1 className="text-6xl font-bold mb-4">Grip Invest</h1>
        <p className="text-2xl mb-8">Your Smart Investment Platform</p>
        <p className="text-lg mb-12 max-w-2xl mx-auto">
          Invest in bonds, FDs, mutual funds, and ETFs with AI-powered recommendations
          tailored to your risk appetite.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link 
            href="/signup"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition"
          >
            Get Started
          </Link>
          <Link 
            href="/login"
            className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition"
          >
            Login
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">AI Recommendations</h3>
            <p>Get personalized investment suggestions based on your risk profile</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Portfolio Insights</h3>
            <p>Track your investments with AI-powered analytics and insights</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Secure & Simple</h3>
            <p>Easy-to-use platform with robust security and transaction logging</p>
          </div>
        </div>
      </div>
    </div>
  );
}