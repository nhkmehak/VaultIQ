'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';

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
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Total Invested</h3>
          <p className="text-3xl font-bold text-blue-600">
            ₹{portfolio?.total_invested || '0.00'}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Expected Returns</h3>
          <p className="text-3xl font-bold text-green-600">
            ₹{portfolio?.total_expected_return || '0.00'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Total Investments</h3>
          <p className="text-3xl font-bold text-purple-600">
            {portfolio?.investments_count || 0}
          </p>
        </div>
      </div>

      {insights && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            🤖 AI Portfolio Insights
          </h2>
          {insights.message ? (
            <p className="text-gray-600">{insights.message}</p>
          ) : (
            <div className="space-y-2">
              {insights.insights && insights.insights.map((insight, i) => (
                <p key={i} className="text-gray-700">• {insight}</p>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/products" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Browse Products</h3>
          <p className="text-gray-600">Explore investment opportunities</p>
        </Link>

        <Link href="/investments" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">My Investments</h3>
          <p className="text-gray-600">View your complete portfolio</p>
        </Link>
      </div>
    </div>
  );
}