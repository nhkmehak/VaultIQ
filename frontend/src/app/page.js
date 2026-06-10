'use client';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { TrendingUp, Shield, BarChart3, ArrowRight } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative bg-black text-white overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" 
            style={{ 
              backgroundImage: 'url("https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1600")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
        </div>
        
        <div className="relative container mx-auto px-6 py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-7xl font-light mb-6 tracking-tight">
              Grip Invest
            </h1>
            <p className="text-xl mb-4 text-gray-400 font-light">
              Smart Investment Platform
            </p>
            <p className="text-base mb-12 text-gray-400 max-w-2xl mx-auto leading-relaxed">
              AI-powered investment recommendations tailored to your financial goals. 
              Build wealth with bonds, fixed deposits, mutual funds, and ETFs.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/signup"
                className="bg-white text-black px-8 py-3.5 text-sm font-medium hover:bg-gray-200 transition-colors inline-flex items-center gap-2"
              >
                Get Started
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="bg-transparent text-white border border-gray-600 px-8 py-3.5 text-sm font-medium hover:bg-gray-900 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-black">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-light text-center mb-20 text-white">
            Why Choose Grip Invest
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 border border-gray-700 group-hover:border-white transition-colors">
                <TrendingUp size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-light mb-4 text-white">
                AI Recommendations
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Get personalized investment suggestions powered by advanced AI algorithms 
                based on your risk profile and goals.
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 border border-gray-700 group-hover:border-white transition-colors">
                <BarChart3 size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-light mb-4 text-white">
                Portfolio Insights
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Track your investments with comprehensive analytics, charts, and 
                AI-powered insights to maximize returns.
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 border border-gray-700 group-hover:border-white transition-colors">
                <Shield size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-light mb-4 text-white">
                Secure & Reliable
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Bank-level security with complete transaction logging and audit 
                trails to keep your investments safe.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section with Image */}
      <div className="relative py-24 overflow-hidden border-y border-gray-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" 
            style={{ 
              backgroundImage: 'url("https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
          </div>
        </div>
        <div className="relative container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-5xl mx-auto text-center">
            <div>
              <div className="text-5xl font-light mb-3 text-white">7.5%+</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest">Average Returns</div>
            </div>
            <div>
              <div className="text-5xl font-light mb-3 text-white">100%</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest">Secure Platform</div>
            </div>
            <div>
              <div className="text-5xl font-light mb-3 text-white">24/7</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest">Support</div>
            </div>
            <div>
              <div className="text-5xl font-light mb-3 text-white">AI</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest">Powered Insights</div>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Types */}
      <div className="py-24 bg-black">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-light text-center mb-20 text-white">
            Investment Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <div className="relative overflow-hidden h-80 border border-gray-800 group">
              <div 
                className="absolute inset-0"
                style={{ 
                  backgroundImage: 'url("https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              ></div>
              <div className="absolute inset-0 bg-black bg-opacity-60 group-hover:bg-opacity-50 transition-all"></div>
              <div className="relative h-full flex flex-col justify-end p-8">
                <h3 className="text-3xl font-light text-white mb-3">Bonds & FDs</h3>
                <p className="text-sm text-gray-300">
                  Secure, fixed-income investments with guaranteed returns
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden h-80 border border-gray-800 group">
              <div 
                className="absolute inset-0"
                style={{ 
                  backgroundImage: 'url("https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              ></div>
              <div className="absolute inset-0 bg-black bg-opacity-60 group-hover:bg-opacity-50 transition-all"></div>
              <div className="relative h-full flex flex-col justify-end p-8">
                <h3 className="text-3xl font-light text-white mb-3">Mutual Funds</h3>
                <p className="text-sm text-gray-300">
                  Diversified portfolios managed by expert fund managers
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden h-80 border border-gray-800 group">
              <div 
                className="absolute inset-0"
                style={{ 
                  backgroundImage: 'url("https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              ></div>
              <div className="absolute inset-0 bg-black bg-opacity-60 group-hover:bg-opacity-50 transition-all"></div>
              <div className="relative h-full flex flex-col justify-end p-8">
                <h3 className="text-3xl font-light text-white mb-3">ETFs</h3>
                <p className="text-sm text-gray-300">
                  Exchange-traded funds for market index exposure
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden h-80 border border-gray-800 group">
              <div 
                className="absolute inset-0"
                style={{ 
                  backgroundImage: 'url("https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              ></div>
              <div className="absolute inset-0 bg-black bg-opacity-60 group-hover:bg-opacity-50 transition-all"></div>
              <div className="relative h-full flex flex-col justify-end p-8">
                <h3 className="text-3xl font-light text-white mb-3">Growth Funds</h3>
                <p className="text-sm text-gray-300">
                  High-potential investments for aggressive growth
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 border-t border-gray-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" 
            style={{ 
              backgroundImage: 'url("https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1600")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
          </div>
        </div>
        <div className="relative container mx-auto px-6 text-center">
          <h2 className="text-4xl font-light mb-6 text-white">
            Ready to Start Investing?
          </h2>
          <p className="text-base text-gray-400 mb-10 max-w-2xl mx-auto">
            Join thousands of investors building wealth with AI-powered insights
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-black px-10 py-3.5 text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
}