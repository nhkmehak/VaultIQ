'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import Link from 'next/link';
import { TrendingUp, Wallet, PieChart, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [portfolio, setPortfolio] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const loadData = async () => {
    try {
      const [portfolioData, insightsData] = await Promise.all([
        api.getPortfolio(token),
        api.getPortfolioInsights(token)
      ]);
      setPortfolio(portfolioData.portfolio);
      setInsights(insightsData.insights);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="text-black text-xl">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.first_name}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-black">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-semibold">Total Invested</h3>
              <Wallet className="text-black" size={24} />
            </div>
            <p className="text-4xl font-bold text-black">
              ₹{portfolio?.total_invested || '0.00'}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-300 hover:border-black transition">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-semibold">Expected Returns</h3>
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <p className="text-4xl font-bold text-green-600">
              ₹{portfolio?.total_expected_return || '0.00'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-300 hover:border-black transition">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-semibold">Total Investments</h3>
              <PieChart className="text-gray-800" size={24} />
            </div>
            <p className="text-4xl font-bold text-gray-800">
              {portfolio?.investments_count || 0}
            </p>
          </div>
        </div>

        {insights && (
          <div className="bg-black text-white p-8 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              🤖 AI Portfolio Insights
            </h2>
            {insights.message ? (
              <p className="text-gray-300">{insights.message}</p>
            ) : (
              <div className="space-y-2">
                {insights.insights && insights.insights.map((insight, i) => (
                  <p key={i} className="text-gray-200">• {insight}</p>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/products" className="group bg-white p-8 rounded-lg shadow-lg border-2 border-gray-300 hover:border-black transition">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold mb-2 text-black">Browse Products</h3>
                <p className="text-gray-600">Explore investment opportunities</p>
              </div>
              <ArrowRight className="text-black group-hover:translate-x-2 transition" size={32} />
            </div>
          </Link>

          <Link href="/investments" className="group bg-white p-8 rounded-lg shadow-lg border-2 border-gray-300 hover:border-black transition">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold mb-2 text-black">My Investments</h3>
                <p className="text-gray-600">View your complete portfolio</p>
              </div>
              <ArrowRight className="text-black group-hover:translate-x-2 transition" size={32} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}