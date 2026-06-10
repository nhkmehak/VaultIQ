'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';

export default function Profile() {
  const { user, token, loading: authLoading, login } = useAuth();
  const router = useRouter();
  const [riskAppetite, setRiskAppetite] = useState('moderate');
  const [recommendations, setRecommendations] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setRiskAppetite(user.risk_appetite || 'moderate');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      loadRecommendations();
    }
  }, [token, riskAppetite]);

  const loadRecommendations = async () => {
    try {
      const data = await api.getRecommendations(token);
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error('Error loading recommendations:', err);
    }
  };

  const handleUpdateRisk = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const result = await api.updateRiskAppetite(token, riskAppetite);
      
      if (result.error) {
        setMessage(result.error);
      } else {
        const updatedUser = { ...user, risk_appetite: riskAppetite };
        login(updatedUser, token);
        setMessage('Risk appetite updated successfully!');
        loadRecommendations();
      }
    } catch (err) {
      setMessage('Update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
              <p className="text-lg">{user?.first_name} {user?.last_name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <p className="text-lg">{user?.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Current Risk Appetite</label>
              <p className="text-lg capitalize">
                <span className={`px-3 py-1 rounded font-semibold
                  ${user?.risk_appetite === 'low' ? 'bg-green-100 text-green-800' :
                    user?.risk_appetite === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'}`}>
                  {user?.risk_appetite}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-6">Update Risk Appetite</h2>
          
          {message && (
            <div className={`p-3 rounded mb-4 ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleUpdateRisk} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Risk Appetite</label>
              <select
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={riskAppetite}
                onChange={(e) => setRiskAppetite(e.target.value)}
              >
                <option value="low">Low - Conservative investments</option>
                <option value="moderate">Moderate - Balanced approach</option>
                <option value="high">High - Aggressive growth</option>
              </select>
            </div>

            <div className="bg-gray-50 p-4 rounded text-sm">
              <p className="font-semibold mb-2">What this means:</p>
              {riskAppetite === 'low' && (
                <p>Focus on stable, low-risk investments like bonds and FDs with steady returns.</p>
              )}
              {riskAppetite === 'moderate' && (
                <p>Balanced mix of stable and growth-oriented investments for moderate returns.</p>
              )}
              {riskAppetite === 'high' && (
                <p>Emphasis on high-growth investments like equity funds and ETFs with higher potential returns.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Updating...' : 'Update Risk Appetite'}
            </button>
          </form>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">🤖 AI Recommendations Based on Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map(product => (
              <div key={product.id} className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2 uppercase">{product.investment_type}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-green-600">{product.annual_yield}%</span>
                  <span className={`text-xs px-2 py-1 rounded
                    ${product.risk_level === 'low' ? 'bg-green-100 text-green-800' :
                      product.risk_level === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}`}>
                    {product.risk_level}
                  </span>
                </div>
                <a 
                  href={`/products/${product.id}`}
                  className="block mt-3 text-center bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700"
                >
                  View Details
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}