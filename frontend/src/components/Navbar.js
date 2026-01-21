'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href={user ? '/dashboard' : '/'} className="text-2xl font-bold">
            Grip Invest
          </Link>
          
          {user ? (
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="hover:text-blue-200">Dashboard</Link>
              <Link href="/products" className="hover:text-blue-200">Products</Link>
              <Link href="/investments" className="hover:text-blue-200">Investments</Link>
              <Link href="/logs" className="hover:text-blue-200">Logs</Link>
              <Link href="/profile" className="hover:text-blue-200">Profile</Link>
              <button 
                onClick={handleLogout}
                className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link href="/login" className="hover:text-blue-200">Login</Link>
              <Link href="/signup" className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}