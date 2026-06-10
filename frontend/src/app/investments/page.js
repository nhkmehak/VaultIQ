'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function Investments() {
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

  const riskData = portfolio?.investments ? [
    { name: 'Low Risk', value: portfolio.investments.filter(i => i.risk_level === 'low').length },
    { name: 'Moderate Risk', value: portfolio.investments.filter(i => i.risk_level === 'moderate').length },
    { name: 'High Risk', value: portfolio.investments.filter(i => i.risk_level === 'high').length },
  ].filter(d => d.value > 0) : [];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Investments</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Total Invested</h3>
          <p className="text-2xl font-bold text-blue-600">
            ₹{portfolio?.total_invested || '0.00'}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Expected Returns</h3>
          <p className="text-2xl font-bold text-green-600">
            ₹{portfolio?.total_expected_return || '0.00'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Total Gain</h3>
          <p className="text-2xl font-bold text-purple-600">
            ₹{portfolio?.total_gain || '0.00'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Active Investments</h3>
          <p className="text-2xl font-bold text-orange-600">
            {portfolio?.investments_count || 0}
          </p>
        </div>
      </div>

      {insights && !insights.message && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            🤖 AI Portfolio Insights
          </h2>
          <div className="space-y-2">
            {insights.insights && insights.insights.map((insight, i) => (
              <p key={i} className="text-gray-700">• {insight}</p>
            ))}
          </div>
        </div>
      )}

      {riskData.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-4">Risk Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-2xl font-bold p-6 border-b">Investment Details</h2>
        
        {portfolio?.investments && portfolio.investments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expected Return</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Maturity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {portfolio.investments.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{inv.name}</td>
                    <td className="px-6 py-4 uppercase text-sm">{inv.investment_type}</td>
                    <td className="px-6 py-4 font-semibold">₹{inv.amount}</td>
                    <td className="px-6 py-4 font-semibold text-green-600">₹{inv.expected_return}</td>
                    <td className="px-6 py-4 text-sm">{new Date(inv.maturity_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold
                        ${inv.risk_level === 'low' ? 'bg-green-100 text-green-800' :
                          inv.risk_level === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}>
                        {inv.risk_level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <p className="mb-4">No investments yet</p>
            <a href="/products" className="text-blue-600 hover:underline">
              Browse products to get started
            </a>
          </div>
        )}
      </div>
    </div>
  );
}   