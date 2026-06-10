'use client';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };
 
  const pagename = router.pathname;
  const navbarbg = pagename === '/dashboard' || pagename === '/products' || pagename === '/investments' || pagename === '/login' || pagename === '/signup'||pagename==='logs'||pagename==='profile';
  return (
    <nav className="bg-black border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <Link 
            href={user ? '/dashboard' : '/'} 
            className="text-xl font-semibold tracking-wide text-white hover:text-gray-300 transition-colors"
          >
            GRIP INVEST
          </Link>

          {user ? (
            <div className="flex items-center gap-8">
              <Link 
                href="/dashboard" 
                className="text-sm font-medium text-gray-700 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                href="/products" 
                className="text-sm font-medium text-gray-700 hover:text-white transition-colors"
              >
                Products
              </Link>
              <Link 
                href="/investments" 
                className="text-sm font-medium text-gray-700 hover:text-white transition-colors"
              >
                Investments
              </Link>
              <Link 
                href="/logs" 
                className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
              >
                Logs
              </Link>
              <Link 
                href="/profile" 
                className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-black text-white px-6 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link 
                href="/login" 
                className="text-sm font-medium text-white hover:text-gray-600 transition-colors px-4 py-2.5"
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="text-sm font-medium text-white hover:text-gray-600 transition-colors px-4 py-2.5"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}