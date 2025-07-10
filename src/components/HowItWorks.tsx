
import React from 'react';
import { Heart, Search, Gift, Trophy } from 'lucide-react';

const steps = [
  {
    icon: Heart,
    title: 'Make a Wish',
    description: 'Share your dream with photos, videos, and your story. Be authentic and heartfelt.',
    color: 'text-pink-500'
  },
  {
    icon: Search,
    title: 'Get Discovered',
    description: 'Generous donors browse wishes, filtering by cause, location, and urgency.',
    color: 'text-blue-500'
  },
  {
    icon: Gift,
    title: 'Dreams Come True',
    description: 'Anonymous heroes fulfill wishes and get rewarded with karma points and badges.',
    color: 'text-purple-500'
  },
  {
    icon: Trophy,
    title: 'Earn Karma & Glory',
    description: 'Climb the leaderboard, unlock badges, and become a legend in our community.',
    color: 'text-yellow-500'
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple steps to make magic happen and join the kindness revolution
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-6">
                <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className={`h-10 w-10 ${step.color}`} />
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-purple-200 to-pink-200 transform -translate-x-1/2"></div>
                )}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-600 transition-colors">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Ready to make a difference?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of dreamers and heroes who are changing the world, one wish at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105">
                Start Making Wishes
              </button>
              <button className="px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-300">
                Become a Hero
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
