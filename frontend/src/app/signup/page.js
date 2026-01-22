'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import PasswordStrength from '@/components/PasswordStrength';
import Link from 'next/link';

export default function Signup() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    risk_appetite: 'moderate'
  });
  const [passwordAnalysis, setPasswordAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await api.signup(formData);
      
      if (result.error) {
        setError(result.error);
      } else {
        setPasswordAnalysis(result.passwordAnalysis);
        login(result.user, result.token);
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-6 text-black">Create Account</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-black">First Name*</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black transition text-black"
              value={formData.first_name}
              onChange={(e) => setFormData({...formData, first_name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-black">Last Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black transition text-black"
              value={formData.last_name}
              onChange={(e) => setFormData({...formData, last_name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-black">Email*</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black transition text-black"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-black">Password*</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black transition text-black"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-black">Risk Appetite</label>
            <select
              className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black transition text-black"
              value={formData.risk_appetite}
              onChange={(e) => setFormData({...formData, risk_appetite: e.target.value})}
            >
              <option value="low">Low - Conservative</option>
              <option value="moderate">Moderate - Balanced</option>
              <option value="high">High - Aggressive</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded font-semibold hover:bg-gray-800 disabled:bg-gray-400 transition"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-black font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}