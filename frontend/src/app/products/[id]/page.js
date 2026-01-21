'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function ProductDetail() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [amount, setAmount] = useState('');
  const [investing, setInvesting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (token && params.id) {
      loadProduct();
    }
  }, [token, params.id]);

  const loadProduct = async () => {
    try {
      const data = await api.getProduct(token, params.id);
      setProduct(data.product);
    } catch (err) {
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = async (e) => {
    e.preventDefault();
    setMessage('');
    setInvesting(true);

    try {
      const result = await api.createInvestment(token, {
        product_id: product.id,
        amount: parseFloat(amount)
      });

      if (result.error) {
        setMessage(result.error);
      } else {
        setMessage('Investment successful!');
        setTimeout(() => router.push('/investments'), 2000);
      }
    } catch (err) {
      setMessage('Investment failed. Please try again.');
    } finally {
      setInvesting(false);
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

  if (!product) {
    return <div className="container mx-auto px-4 py-8">Product not found</div>;
  }

  const expectedReturn = amount ? (parseFloat(amount) * (1 + (product.annual_yield / 100) * (product.tenure_months / 12))).toFixed(2) : '0.00';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/products" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Products
      </Link>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <span className={`px-3 py-1 rounded font-semibold ${getRiskColor(product.risk_level)}`}>
            {product.risk_level.toUpperCase()} RISK
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div>
            <p className="text-sm text-gray-600 mb-1">Type</p>
            <p className="text-lg font-semibold uppercase">{product.investment_type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Annual Yield</p>
            <p className="text-lg font-semibold text-green-600">{product.annual_yield}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Tenure</p>
            <p className="text-lg font-semibold">{product.tenure_months} months</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Min Investment</p>
            <p className="text-lg font-semibold">₹{product.min_investment}</p>
          </div>
        </div>

        {product.description && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">About</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>
        )}

        <div className="border-t pt-8">
          <h2 className="text-2xl font-semibold mb-4">Make an Investment</h2>
          
          {message && (
            <div className={`p-3 rounded mb-4 ${message.includes('successful') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleInvest} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Investment Amount (₹)
              </label>
              <input
                type="number"
                required
                min={product.min_investment}
                max={product.max_investment || undefined}
                step="100"
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Min: ₹${product.min_investment}`}
              />
            </div>

            {amount && parseFloat(amount) >= product.min_investment && (
              <div className="bg-blue-50 p-4 rounded">
                <p className="text-sm text-gray-600 mb-1">Expected Return at Maturity</p>
                <p className="text-2xl font-bold text-blue-600">₹{expectedReturn}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Profit: ₹{(expectedReturn - parseFloat(amount)).toFixed(2)}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={investing}
              className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400"
            >
              {investing ? 'Processing...' : 'Invest Now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}