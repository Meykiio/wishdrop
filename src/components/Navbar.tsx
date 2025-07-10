
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Menu, X, Sparkles, Trophy } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-border z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Heart className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
              <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1 sparkle" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
              WishDrop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/wishes" className="text-gray-700 hover:text-primary transition-colors duration-200">
              Browse Wishes
            </Link>
            <Link to="/leaderboard" className="text-gray-700 hover:text-primary transition-colors duration-200 flex items-center space-x-1">
              <Trophy className="h-4 w-4" />
              <span>Leaderboard</span>
            </Link>
            <Link to="/how-it-works" className="text-gray-700 hover:text-primary transition-colors duration-200">
              How It Works
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/auth">
              <Button variant="outline" className="hover:bg-primary/10">
                Sign In
              </Button>
            </Link>
            <Link to="/make-wish">
              <Button className="wish-gradient text-white hover:shadow-lg hover:shadow-primary/25 transition-all duration-300">
                Make a Wish
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border">
            <div className="flex flex-col space-y-4 pt-4">
              <Link to="/wishes" className="text-gray-700 hover:text-primary transition-colors">
                Browse Wishes
              </Link>
              <Link to="/leaderboard" className="text-gray-700 hover:text-primary transition-colors flex items-center space-x-1">
                <Trophy className="h-4 w-4" />
                <span>Leaderboard</span>
              </Link>
              <Link to="/how-it-works" className="text-gray-700 hover:text-primary transition-colors">
                How It Works
              </Link>
              <div className="flex flex-col space-y-2 pt-2">
                <Link to="/auth">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/make-wish">
                  <Button className="w-full wish-gradient text-white">
                    Make a Wish
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
