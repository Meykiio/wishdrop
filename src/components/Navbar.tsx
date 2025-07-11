
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Menu, X, User, Star, Trophy, Award } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-red-500" />
              <span className="text-xl font-bold text-gray-900">WishDrop</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-gray-700 hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') ? 'text-red-500 bg-red-50' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/wishes"
              className={`text-gray-700 hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/wishes') ? 'text-red-500 bg-red-50' : ''
              }`}
            >
              Browse Wishes
            </Link>
            <Link
              to="/leaderboard"
              className={`text-gray-700 hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                isActive('/leaderboard') ? 'text-red-500 bg-red-50' : ''
              }`}
            >
              <Trophy className="h-4 w-4" />
              <span>Leaderboard</span>
            </Link>
            <Link
              to="/badges"
              className={`text-gray-700 hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                isActive('/badges') ? 'text-red-500 bg-red-50' : ''
              }`}
            >
              <Award className="h-4 w-4" />
              <span>Badges</span>
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/make-wish"
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Make a Wish
                </Link>
                <Link
                  to="/profile"
                  className={`text-gray-700 hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                    isActive('/profile') ? 'text-red-500 bg-red-50' : ''
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
                <Button
                  onClick={signOut}
                  variant="outline"
                  className="text-sm"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/auth"
                  className="text-gray-700 hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth"
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-red-500 p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/') ? 'text-red-500 bg-red-50' : 'text-gray-700 hover:text-red-500'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/wishes"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/wishes') ? 'text-red-500 bg-red-50' : 'text-gray-700 hover:text-red-500'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Browse Wishes
              </Link>
              <Link
                to="/leaderboard"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/leaderboard') ? 'text-red-500 bg-red-50' : 'text-gray-700 hover:text-red-500'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Trophy className="h-4 w-4" />
                <span>Leaderboard</span>
              </Link>
              <Link
                to="/badges"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/badges') ? 'text-red-500 bg-red-50' : 'text-gray-700 hover:text-red-500'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Award className="h-4 w-4" />
                <span>Badges</span>
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/make-wish"
                    className="block px-3 py-2 rounded-md text-base font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Make a Wish
                  </Link>
                  <Link
                    to="/profile"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive('/profile') ? 'text-red-500 bg-red-50' : 'text-gray-700 hover:text-red-500'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-500 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-500 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth"
                    className="block px-3 py-2 rounded-md text-base font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
