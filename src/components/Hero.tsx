
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Gift, Star } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 text-purple-300 float-animation">
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="absolute top-40 right-20 text-pink-300 float-animation" style={{ animationDelay: '1s' }}>
          <Heart className="h-8 w-8" />
        </div>
        <div className="absolute bottom-40 left-20 text-blue-300 float-animation" style={{ animationDelay: '2s' }}>
          <Gift className="h-7 w-7" />
        </div>
        <div className="absolute bottom-20 right-10 text-yellow-400 float-animation" style={{ animationDelay: '3s' }}>
          <Star className="h-5 w-5" />
        </div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="slide-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Make Dreams
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Come True
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Where wishers share their dreams and generous souls make magic happen. 
            Join the kindness revolution and earn karma while changing lives.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/make-wish">
              <Button size="lg" className="wish-gradient text-white px-8 py-6 text-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 hover:scale-105">
                <Heart className="mr-2 h-5 w-5" />
                Make a Wish
              </Button>
            </Link>
            
            <Link to="/wishes">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all duration-300">
                <Gift className="mr-2 h-5 w-5" />
                Fulfill Dreams
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/80 transition-all duration-300">
              <div className="text-3xl font-bold text-purple-600 mb-2">1,234</div>
              <div className="text-gray-600">Wishes Granted</div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/80 transition-all duration-300">
              <div className="text-3xl font-bold text-pink-600 mb-2">$45,678</div>
              <div className="text-gray-600">Dreams Funded</div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/80 transition-all duration-300">
              <div className="text-3xl font-bold text-blue-600 mb-2">856</div>
              <div className="text-gray-600">Happy Hearts</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
