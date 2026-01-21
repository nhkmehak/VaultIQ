'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function Products() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (token) {
      loadProducts();
      loadRecommendations();
    }
  }, [token, filters]);

  const loadProducts = async () => {
    try {
      const data = await api.getProducts(token, filters);
      setProducts(data.products || []);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async () => {
    try {
      const data = await api.getRecommendations(token);
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error('Error loading recommendations:', err);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'moderate': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (authLoading || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Investment Products</h1>

      {recommendations.length > 0 && (
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">🤖 AI Recommendations for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map(product => (
              <Link 
                key={product.id} 
                href={`/products/${product.id}`}
                className="bg-white p-4 rounded shadow hover:shadow-lg transition"
              >
                <h3 className="font-semibold mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.investment_type.toUpperCase()}</p>
                <p className="text-lg font-bold text-blue-600">{product.annual_yield}% Yield</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            className="px-3 py-2 border rounded"
            onChange={(e) => setFilters({...filters, type: e.target.value || undefined})}
          >
            <option value="">All Types</option>
            <option value="bond">Bond</option>
            <option value="fd">FD</option>
            <option value="mf">Mutual Fund</option>
            <option value="etf">ETF</option>
          </select>

          <select
            className="px-3 py-2 border rounded"
            onChange={(e) => setFilters({...filters, risk_level: e.target.value || undefined})}
          >
            <option value="">All Risk Levels</option>
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>

          <button
            onClick={() => setFilters({})}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${getRiskColor(product.risk_level)}`}>
                {product.risk_level}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-3 uppercase">{product.investment_type}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Annual Yield</span>
                <span className="font-semibold text-green-600">{product.annual_yield}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tenure</span>
                <span className="font-semibold">{product.tenure_months} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Min Investment</span>
                <span className="font-semibold">₹{product.min_investment}</span>
              </div>
            </div>

            {product.description && (
              <p className="text-sm text-gray-700 line-clamp-2">{product.description}</p>
            )}
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No products found matching your filters.
        </div>
      )}
    </div>
  );
}